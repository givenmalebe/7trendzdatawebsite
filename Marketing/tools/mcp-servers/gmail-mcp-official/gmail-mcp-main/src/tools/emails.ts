import { getGmailClient, withErrorHandling } from '../gmail/client.js';
import { parseMessage, parseMessageMinimal, composeEmail, formatEmailForDisplay } from '../gmail/mime.js';
import {
  SearchEmailsInput,
  ReadEmailInput,
  SendEmailInput,
  DraftEmailInput,
  DeleteEmailInput,
  ModifyEmailInput,
  GetThreadInput,
} from '../schemas/index.js';
import { ParsedEmail, ThreadInfo } from '../gmail/types.js';

export async function searchEmails(input: SearchEmailsInput): Promise<{
  messages: ParsedEmail[];
  nextPageToken?: string;
  resultSizeEstimate: number;
}> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: input.query,
      maxResults: input.maxResults,
      pageToken: input.pageToken,
      includeSpamTrash: input.includeSpamTrash,
    });

    const messages: ParsedEmail[] = [];

    if (response.data.messages) {
      // Fetch each message with metadata format for search results
      for (const msg of response.data.messages) {
        if (msg.id) {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'metadata',
            metadataHeaders: ['From', 'To', 'Subject', 'Date'],
          });
          messages.push(parseMessageMinimal(fullMessage.data));
        }
      }
    }

    return {
      messages,
      nextPageToken: response.data.nextPageToken || undefined,
      resultSizeEstimate: response.data.resultSizeEstimate || 0,
    };
  }, 'Search emails');
}

export async function readEmail(input: ReadEmailInput): Promise<ParsedEmail> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.messages.get({
      userId: 'me',
      id: input.messageId,
      format: input.format,
    });

    return parseMessage(response.data);
  }, 'Read email');
}

export async function sendEmail(input: SendEmailInput): Promise<{ id: string; threadId: string }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const raw = await composeEmail({
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      body: input.body,
      isHtml: input.isHtml,
      attachments: input.attachments,
      threadId: input.threadId,
      inReplyTo: input.inReplyTo,
      references: input.references,
    });

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        threadId: input.threadId,
      },
    });

    return {
      id: response.data.id || '',
      threadId: response.data.threadId || '',
    };
  }, 'Send email');
}

export async function draftEmail(input: DraftEmailInput): Promise<{ id: string; messageId: string }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const raw = await composeEmail({
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      body: input.body,
      isHtml: input.isHtml,
      attachments: input.attachments,
      threadId: input.threadId,
    });

    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw,
          threadId: input.threadId,
        },
      },
    });

    return {
      id: response.data.id || '',
      messageId: response.data.message?.id || '',
    };
  }, 'Create draft');
}

export async function deleteEmail(input: DeleteEmailInput): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    if (input.permanent) {
      await gmail.users.messages.delete({
        userId: 'me',
        id: input.messageId,
      });
    } else {
      await gmail.users.messages.trash({
        userId: 'me',
        id: input.messageId,
      });
    }

    return { success: true };
  }, 'Delete email');
}

export async function modifyEmail(input: ModifyEmailInput): Promise<ParsedEmail> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: input.messageId,
      requestBody: {
        addLabelIds: input.addLabelIds,
        removeLabelIds: input.removeLabelIds,
      },
    });

    return parseMessage(response.data);
  }, 'Modify email');
}

export async function getThread(input: GetThreadInput): Promise<ThreadInfo> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.threads.get({
      userId: 'me',
      id: input.threadId,
      format: input.format,
    });

    const messages = (response.data.messages || []).map(msg => parseMessage(msg));

    return {
      id: response.data.id || '',
      historyId: response.data.historyId || '',
      messages,
    };
  }, 'Get thread');
}

// Utility function for formatting search results
export function formatSearchResults(results: { messages: ParsedEmail[]; nextPageToken?: string; resultSizeEstimate: number }): string {
  const lines: string[] = [];

  lines.push(`Found ${results.resultSizeEstimate} results (showing ${results.messages.length})`);
  if (results.nextPageToken) {
    lines.push(`Next page token: ${results.nextPageToken}`);
  }
  lines.push('');

  for (const msg of results.messages) {
    const unread = msg.labelIds.includes('UNREAD') ? '[UNREAD] ' : '';
    lines.push(`${unread}${msg.id}: ${msg.headers.subject || '(no subject)'}`);
    lines.push(`  From: ${msg.headers.from || 'unknown'}`);
    lines.push(`  Date: ${msg.headers.date || 'unknown'}`);
    lines.push(`  Snippet: ${msg.snippet.substring(0, 100)}...`);
    lines.push('');
  }

  return lines.join('\n');
}

// Re-export formatting utility
export { formatEmailForDisplay };
