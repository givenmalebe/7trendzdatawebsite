import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getGmailClient, withErrorHandling } from '../gmail/client.js';
import { parseMessage, formatEmailForDisplay } from '../gmail/mime.js';

export function registerResources(server: McpServer): void {
  // Message resource
  server.resource(
    'gmail://messages/{messageId}',
    'Get a Gmail message by ID',
    async (uri) => {
      const match = uri.href.match(/gmail:\/\/messages\/(.+)/);
      if (!match) {
        throw new Error('Invalid message URI');
      }
      const messageId = match[1];

      const result = await withErrorHandling(async () => {
        const gmail = await getGmailClient();
        const response = await gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full',
        });
        return parseMessage(response.data);
      }, 'Get message resource');

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'text/plain',
          text: formatEmailForDisplay(result),
        }],
      };
    }
  );

  // Thread resource
  server.resource(
    'gmail://threads/{threadId}',
    'Get a Gmail thread by ID',
    async (uri) => {
      const match = uri.href.match(/gmail:\/\/threads\/(.+)/);
      if (!match) {
        throw new Error('Invalid thread URI');
      }
      const threadId = match[1];

      const result = await withErrorHandling(async () => {
        const gmail = await getGmailClient();
        const response = await gmail.users.threads.get({
          userId: 'me',
          id: threadId,
          format: 'full',
        });
        return {
          id: response.data.id || '',
          historyId: response.data.historyId || '',
          messages: (response.data.messages || []).map(msg => parseMessage(msg)),
        };
      }, 'Get thread resource');

      const lines = [`Thread ${result.id} (${result.messages.length} messages):\n`];
      for (const msg of result.messages) {
        lines.push(formatEmailForDisplay(msg));
        lines.push('\n---\n');
      }

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'text/plain',
          text: lines.join('\n'),
        }],
      };
    }
  );

  // Label resource
  server.resource(
    'gmail://labels/{labelId}',
    'Get a Gmail label by ID',
    async (uri) => {
      const match = uri.href.match(/gmail:\/\/labels\/(.+)/);
      if (!match) {
        throw new Error('Invalid label URI');
      }
      const labelId = match[1];

      const result = await withErrorHandling(async () => {
        const gmail = await getGmailClient();
        const response = await gmail.users.labels.get({
          userId: 'me',
          id: labelId,
        });
        return response.data;
      }, 'Get label resource');

      const lines = [
        `Label: ${result.name}`,
        `ID: ${result.id}`,
        `Type: ${result.type}`,
      ];
      if (result.messagesTotal !== undefined) lines.push(`Messages: ${result.messagesTotal}`);
      if (result.messagesUnread !== undefined) lines.push(`Unread: ${result.messagesUnread}`);
      if (result.threadsTotal !== undefined) lines.push(`Threads: ${result.threadsTotal}`);
      if (result.threadsUnread !== undefined) lines.push(`Unread Threads: ${result.threadsUnread}`);
      if (result.color) {
        lines.push(`Background Color: ${result.color.backgroundColor}`);
        lines.push(`Text Color: ${result.color.textColor}`);
      }

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'text/plain',
          text: lines.join('\n'),
        }],
      };
    }
  );
}
