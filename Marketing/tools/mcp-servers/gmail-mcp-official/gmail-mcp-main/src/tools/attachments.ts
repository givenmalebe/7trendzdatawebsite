import * as fs from 'fs';
import * as path from 'path';
import { getGmailClient, withErrorHandling } from '../gmail/client.js';
import { parseMessage } from '../gmail/mime.js';
import { DownloadAttachmentInput, ListAttachmentsInput } from '../schemas/index.js';
import { Attachment } from '../gmail/types.js';

export async function downloadAttachment(input: DownloadAttachmentInput): Promise<{
  success: boolean;
  path: string;
  size: number;
}> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    // Get the attachment data
    const response = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: input.messageId,
      id: input.attachmentId,
    });

    const data = response.data.data;
    if (!data) {
      throw new Error('Attachment data is empty');
    }

    // Decode from URL-safe base64
    const buffer = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

    // Ensure directory exists
    const dir = path.dirname(input.savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(input.savePath, buffer);

    return {
      success: true,
      path: input.savePath,
      size: buffer.length,
    };
  }, 'Download attachment');
}

export async function listAttachments(input: ListAttachmentsInput): Promise<{
  messageId: string;
  attachments: Attachment[];
}> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    // Get the message to extract attachment info
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: input.messageId,
      format: 'full',
    });

    const parsed = parseMessage(response.data);

    return {
      messageId: input.messageId,
      attachments: parsed.attachments,
    };
  }, 'List attachments');
}

// Utility function to format attachment list
export function formatAttachments(messageId: string, attachments: Attachment[]): string {
  if (attachments.length === 0) {
    return `No attachments found in message ${messageId}`;
  }

  const lines: string[] = [];
  lines.push(`Attachments in message ${messageId}:`);
  lines.push('');

  for (const att of attachments) {
    lines.push(`  - ${att.filename}`);
    lines.push(`    ID: ${att.id}`);
    lines.push(`    Type: ${att.mimeType}`);
    lines.push(`    Size: ${formatBytes(att.size)}`);
    lines.push('');
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
