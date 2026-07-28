import { gmail_v1 } from 'googleapis';
import nodemailer from 'nodemailer';
import * as mimeTypes from 'mime-types';
import { ParsedEmail, Attachment, SendEmailOptions, AttachmentInput } from './types.js';

type MessagePart = gmail_v1.Schema$MessagePart;
type Message = gmail_v1.Schema$Message;

function decodeBase64Url(data: string): string {
  // Gmail uses URL-safe base64, need to convert to standard base64
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function encodeBase64Url(data: string | Buffer): string {
  const buffer = typeof data === 'string' ? Buffer.from(data) : data;
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function getHeader(headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  const header = headers.find(h => h.name?.toLowerCase() === name.toLowerCase());
  return header?.value || undefined;
}

function extractBody(part: MessagePart, mimeType: string): string | undefined {
  if (part.mimeType === mimeType && part.body?.data) {
    return decodeBase64Url(part.body.data);
  }

  if (part.parts) {
    for (const subpart of part.parts) {
      const body = extractBody(subpart, mimeType);
      if (body) return body;
    }
  }

  return undefined;
}

function extractAttachments(part: MessagePart, attachments: Attachment[] = []): Attachment[] {
  if (part.body?.attachmentId) {
    attachments.push({
      id: part.body.attachmentId,
      filename: part.filename || 'unnamed',
      mimeType: part.mimeType || 'application/octet-stream',
      size: part.body.size || 0,
    });
  }

  if (part.parts) {
    for (const subpart of part.parts) {
      extractAttachments(subpart, attachments);
    }
  }

  return attachments;
}

export function parseMessage(message: Message): ParsedEmail {
  const payload = message.payload;
  const headers = payload?.headers;

  const parsedHeaders = {
    from: getHeader(headers, 'From'),
    to: getHeader(headers, 'To'),
    cc: getHeader(headers, 'Cc'),
    bcc: getHeader(headers, 'Bcc'),
    subject: getHeader(headers, 'Subject'),
    date: getHeader(headers, 'Date'),
    messageId: getHeader(headers, 'Message-ID'),
    inReplyTo: getHeader(headers, 'In-Reply-To'),
    references: getHeader(headers, 'References'),
  };

  let plainBody: string | undefined;
  let htmlBody: string | undefined;
  let attachments: Attachment[] = [];

  if (payload) {
    plainBody = extractBody(payload, 'text/plain');
    htmlBody = extractBody(payload, 'text/html');
    attachments = extractAttachments(payload);
  }

  return {
    id: message.id || '',
    threadId: message.threadId || '',
    labelIds: message.labelIds || [],
    snippet: message.snippet || '',
    headers: parsedHeaders,
    body: {
      plain: plainBody,
      html: htmlBody,
    },
    attachments,
    internalDate: message.internalDate || '',
    sizeEstimate: message.sizeEstimate || 0,
  };
}

export function parseMessageMinimal(message: Message): ParsedEmail {
  // For list operations, we get less data
  const headers = message.payload?.headers;

  return {
    id: message.id || '',
    threadId: message.threadId || '',
    labelIds: message.labelIds || [],
    snippet: message.snippet || '',
    headers: {
      from: getHeader(headers, 'From'),
      to: getHeader(headers, 'To'),
      subject: getHeader(headers, 'Subject'),
      date: getHeader(headers, 'Date'),
    },
    body: {},
    attachments: [],
    internalDate: message.internalDate || '',
    sizeEstimate: message.sizeEstimate || 0,
  };
}

function encodeRFC2047(text: string): string {
  // Check if encoding is needed (non-ASCII characters)
  if (!/[^\x00-\x7F]/.test(text)) {
    return text;
  }
  const encoded = Buffer.from(text, 'utf-8').toString('base64');
  return `=?UTF-8?B?${encoded}?=`;
}

function formatAddress(email: string, name?: string): string {
  if (name) {
    return `${encodeRFC2047(name)} <${email}>`;
  }
  return email;
}

function normalizeAddresses(addresses: string | string[] | undefined): string[] {
  if (!addresses) return [];
  if (typeof addresses === 'string') return [addresses];
  return addresses;
}

export async function composeEmail(options: SendEmailOptions): Promise<string> {
  const { to, cc, bcc, subject, body, isHtml, attachments, threadId, inReplyTo, references } = options;

  // Create mail options
  const mailOptions: nodemailer.SendMailOptions = {
    to: normalizeAddresses(to),
    cc: normalizeAddresses(cc),
    bcc: normalizeAddresses(bcc),
    subject,
    headers: {} as Record<string, string>,
  };

  if (isHtml) {
    mailOptions.html = body;
  } else {
    mailOptions.text = body;
  }

  // Handle threading headers
  if (inReplyTo) {
    (mailOptions.headers as Record<string, string>)['In-Reply-To'] = inReplyTo;
  }
  if (references) {
    (mailOptions.headers as Record<string, string>)['References'] = references;
  }

  // Handle attachments
  if (attachments && attachments.length > 0) {
    mailOptions.attachments = attachments.map((att: AttachmentInput) => ({
      filename: att.filename,
      content: Buffer.from(att.content, 'base64'),
      contentType: att.mimeType || mimeTypes.lookup(att.filename) || 'application/octet-stream',
    }));
  }

  // Use nodemailer to compose the email
  const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
        return;
      }

      const chunks: Buffer[] = [];
      info.message.on('data', (chunk: Buffer) => chunks.push(chunk));
      info.message.on('end', () => {
        const rawEmail = Buffer.concat(chunks);
        resolve(encodeBase64Url(rawEmail));
      });
      info.message.on('error', reject);
    });
  });
}

export function formatEmailForDisplay(email: ParsedEmail): string {
  const lines: string[] = [];

  lines.push(`ID: ${email.id}`);
  lines.push(`Thread ID: ${email.threadId}`);
  lines.push(`Labels: ${email.labelIds.join(', ') || 'none'}`);
  lines.push('');

  if (email.headers.date) lines.push(`Date: ${email.headers.date}`);
  if (email.headers.from) lines.push(`From: ${email.headers.from}`);
  if (email.headers.to) lines.push(`To: ${email.headers.to}`);
  if (email.headers.cc) lines.push(`Cc: ${email.headers.cc}`);
  if (email.headers.subject) lines.push(`Subject: ${email.headers.subject}`);

  lines.push('');

  if (email.body.plain) {
    lines.push('--- Body ---');
    lines.push(email.body.plain);
  } else if (email.body.html) {
    lines.push('--- Body (HTML) ---');
    lines.push(email.body.html);
  }

  if (email.attachments.length > 0) {
    lines.push('');
    lines.push('--- Attachments ---');
    for (const att of email.attachments) {
      lines.push(`- ${att.filename} (${att.mimeType}, ${formatBytes(att.size)})`);
    }
  }

  return lines.join('\n');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export { encodeBase64Url, decodeBase64Url };
