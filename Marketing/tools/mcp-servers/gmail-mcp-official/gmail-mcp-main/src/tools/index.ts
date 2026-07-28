import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import * as schemas from '../schemas/index.js';
import * as emails from './emails.js';
import * as labels from './labels.js';
import * as filters from './filters.js';
import * as batch from './batch.js';
import * as attachments from './attachments.js';
import { getGmailClient, withErrorHandling } from '../gmail/client.js';

export function registerTools(server: McpServer): void {
  // ===============================
  // Email Operations (7 tools)
  // ===============================

  server.tool(
    'search_emails',
    'Search Gmail messages using Gmail query syntax. Supports queries like "from:sender@example.com", "is:unread", "subject:hello", "after:2024/01/01".',
    schemas.searchEmailsSchema.shape,
    async (args) => {
      const input = schemas.searchEmailsSchema.parse(args);
      const result = await emails.searchEmails(input);
      return {
        content: [{ type: 'text', text: emails.formatSearchResults(result) }],
      };
    }
  );

  server.tool(
    'read_email',
    'Read a specific email message by ID. Returns full message content including headers, body, and attachment information.',
    schemas.readEmailSchema.shape,
    async (args) => {
      const input = schemas.readEmailSchema.parse(args);
      const result = await emails.readEmail(input);
      return {
        content: [{ type: 'text', text: emails.formatEmailForDisplay(result) }],
      };
    }
  );

  server.tool(
    'send_email',
    'Send an email. Supports to, cc, bcc, attachments, and threading (replies).',
    schemas.sendEmailSchema.shape,
    async (args) => {
      const input = schemas.sendEmailSchema.parse(args);
      const result = await emails.sendEmail(input);
      return {
        content: [{ type: 'text', text: `Email sent successfully.\nMessage ID: ${result.id}\nThread ID: ${result.threadId}` }],
      };
    }
  );

  server.tool(
    'draft_email',
    'Create an email draft without sending. The draft can be edited and sent later from Gmail.',
    schemas.draftEmailSchema.shape,
    async (args) => {
      const input = schemas.draftEmailSchema.parse(args);
      const result = await emails.draftEmail(input);
      return {
        content: [{ type: 'text', text: `Draft created successfully.\nDraft ID: ${result.id}\nMessage ID: ${result.messageId}` }],
      };
    }
  );

  server.tool(
    'delete_email',
    'Delete an email message. By default moves to trash; use permanent=true for permanent deletion.',
    schemas.deleteEmailSchema.shape,
    async (args) => {
      const input = schemas.deleteEmailSchema.parse(args);
      const result = await emails.deleteEmail(input);
      const action = input.permanent ? 'permanently deleted' : 'moved to trash';
      return {
        content: [{ type: 'text', text: `Email ${action} successfully.` }],
      };
    }
  );

  server.tool(
    'modify_email',
    'Modify labels on an email message. Can add and remove labels simultaneously.',
    schemas.modifyEmailSchema.shape,
    async (args) => {
      const input = schemas.modifyEmailSchema.parse(args);
      const result = await emails.modifyEmail(input);
      return {
        content: [{ type: 'text', text: `Email labels modified.\nCurrent labels: ${result.labelIds.join(', ')}` }],
      };
    }
  );

  server.tool(
    'get_thread',
    'Get all messages in an email thread/conversation.',
    schemas.getThreadSchema.shape,
    async (args) => {
      const input = schemas.getThreadSchema.parse(args);
      const result = await emails.getThread(input);
      const lines = [`Thread ${result.id} (${result.messages.length} messages):\n`];
      for (const msg of result.messages) {
        lines.push(emails.formatEmailForDisplay(msg));
        lines.push('\n---\n');
      }
      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    }
  );

  // ===============================
  // Label Management (6 tools)
  // ===============================

  server.tool(
    'list_labels',
    'List all Gmail labels including system labels (INBOX, SENT, etc.) and user-created labels.',
    schemas.listLabelsSchema.shape,
    async () => {
      const result = await labels.listLabels();
      return {
        content: [{ type: 'text', text: labels.formatLabels(result.labels) }],
      };
    }
  );

  server.tool(
    'get_label',
    'Get details about a specific label by ID.',
    schemas.getLabelSchema.shape,
    async (args) => {
      const input = schemas.getLabelSchema.parse(args);
      const result = await labels.getLabel(input);
      const lines = [
        `Label: ${result.name}`,
        `ID: ${result.id}`,
        `Type: ${result.type}`,
      ];
      if (result.messagesTotal !== undefined) lines.push(`Messages: ${result.messagesTotal}`);
      if (result.messagesUnread !== undefined) lines.push(`Unread: ${result.messagesUnread}`);
      if (result.color) lines.push(`Color: ${result.color.backgroundColor}`);
      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    }
  );

  server.tool(
    'create_label',
    'Create a new Gmail label with optional color and visibility settings.',
    schemas.createLabelSchema.shape,
    async (args) => {
      const input = schemas.createLabelSchema.parse(args);
      const result = await labels.createLabel(input);
      return {
        content: [{ type: 'text', text: `Label created successfully.\nName: ${result.name}\nID: ${result.id}` }],
      };
    }
  );

  server.tool(
    'update_label',
    'Update an existing label. Can rename, change visibility, or update color.',
    schemas.updateLabelSchema.shape,
    async (args) => {
      const input = schemas.updateLabelSchema.parse(args);
      const result = await labels.updateLabel(input);
      return {
        content: [{ type: 'text', text: `Label updated successfully.\nName: ${result.name}\nID: ${result.id}` }],
      };
    }
  );

  server.tool(
    'delete_label',
    'Delete a user-created label. System labels cannot be deleted.',
    schemas.deleteLabelSchema.shape,
    async (args) => {
      const input = schemas.deleteLabelSchema.parse(args);
      await labels.deleteLabel(input);
      return {
        content: [{ type: 'text', text: 'Label deleted successfully.' }],
      };
    }
  );

  server.tool(
    'get_or_create_label',
    'Get an existing label by name, or create it if it does not exist. Idempotent operation.',
    schemas.getOrCreateLabelSchema.shape,
    async (args) => {
      const input = schemas.getOrCreateLabelSchema.parse(args);
      const result = await labels.getOrCreateLabel(input);
      const action = result.created ? 'Created new' : 'Found existing';
      return {
        content: [{ type: 'text', text: `${action} label.\nName: ${result.name}\nID: ${result.id}` }],
      };
    }
  );

  // ===============================
  // Filter Management (5 tools)
  // ===============================

  server.tool(
    'list_filters',
    'List all Gmail filters configured on the account.',
    schemas.listFiltersSchema.shape,
    async () => {
      const result = await filters.listFilters();
      return {
        content: [{ type: 'text', text: filters.formatFilters(result.filters) }],
      };
    }
  );

  server.tool(
    'get_filter',
    'Get details about a specific filter by ID.',
    schemas.getFilterSchema.shape,
    async (args) => {
      const input = schemas.getFilterSchema.parse(args);
      const result = await filters.getFilter(input);
      return {
        content: [{ type: 'text', text: filters.formatFilters([result]) }],
      };
    }
  );

  server.tool(
    'create_filter',
    'Create a new Gmail filter with custom criteria and actions.',
    schemas.createFilterSchema.shape,
    async (args) => {
      const input = schemas.createFilterSchema.parse(args);
      const result = await filters.createFilter(input);
      return {
        content: [{ type: 'text', text: `Filter created successfully.\nID: ${result.id}` }],
      };
    }
  );

  server.tool(
    'delete_filter',
    'Delete a Gmail filter by ID.',
    schemas.deleteFilterSchema.shape,
    async (args) => {
      const input = schemas.deleteFilterSchema.parse(args);
      await filters.deleteFilter(input);
      return {
        content: [{ type: 'text', text: 'Filter deleted successfully.' }],
      };
    }
  );

  server.tool(
    'create_filter_from_template',
    'Create a filter using a predefined template. Templates: from_sender, to_recipient, with_attachments, with_subject, larger_than, mark_important.',
    schemas.createFilterFromTemplateSchema.shape,
    async (args) => {
      const input = schemas.createFilterFromTemplateSchema.parse(args);
      const result = await filters.createFilterFromTemplate(input);
      return {
        content: [{ type: 'text', text: `Filter created from template "${input.template}".\nID: ${result.id}` }],
      };
    }
  );

  // ===============================
  // Batch Operations (2 tools)
  // ===============================

  server.tool(
    'batch_modify_emails',
    'Modify labels on multiple emails at once. Processes up to 50 messages per batch with automatic fallback.',
    schemas.batchModifyEmailsSchema.shape,
    async (args) => {
      const input = schemas.batchModifyEmailsSchema.parse(args);
      const result = await batch.batchModifyEmails(input);
      return {
        content: [{ type: 'text', text: batch.formatBatchResult(result, 'Batch modify') }],
      };
    }
  );

  server.tool(
    'batch_delete_emails',
    'Delete multiple emails at once. By default moves to trash; use permanent=true for permanent deletion.',
    schemas.batchDeleteEmailsSchema.shape,
    async (args) => {
      const input = schemas.batchDeleteEmailsSchema.parse(args);
      const result = await batch.batchDeleteEmails(input);
      return {
        content: [{ type: 'text', text: batch.formatBatchResult(result, 'Batch delete') }],
      };
    }
  );

  // ===============================
  // Attachments (2 tools)
  // ===============================

  server.tool(
    'download_attachment',
    'Download an email attachment to the local filesystem.',
    schemas.downloadAttachmentSchema.shape,
    async (args) => {
      const input = schemas.downloadAttachmentSchema.parse(args);
      const result = await attachments.downloadAttachment(input);
      return {
        content: [{ type: 'text', text: `Attachment downloaded successfully.\nPath: ${result.path}\nSize: ${result.size} bytes` }],
      };
    }
  );

  server.tool(
    'list_attachments',
    'List all attachments in a specific email message.',
    schemas.listAttachmentsSchema.shape,
    async (args) => {
      const input = schemas.listAttachmentsSchema.parse(args);
      const result = await attachments.listAttachments(input);
      return {
        content: [{ type: 'text', text: attachments.formatAttachments(result.messageId, result.attachments) }],
      };
    }
  );

  // ===============================
  // Utilities (2 tools)
  // ===============================

  server.tool(
    'get_profile',
    'Get the Gmail profile including email address, total messages, and history ID.',
    schemas.getProfileSchema.shape,
    async () => {
      const result = await withErrorHandling(async () => {
        const gmail = await getGmailClient();
        const response = await gmail.users.getProfile({ userId: 'me' });
        return {
          emailAddress: response.data.emailAddress || '',
          messagesTotal: response.data.messagesTotal || 0,
          threadsTotal: response.data.threadsTotal || 0,
          historyId: response.data.historyId || '',
        };
      }, 'Get profile');
      return {
        content: [{
          type: 'text',
          text: [
            `Email: ${result.emailAddress}`,
            `Total Messages: ${result.messagesTotal}`,
            `Total Threads: ${result.threadsTotal}`,
            `History ID: ${result.historyId}`,
          ].join('\n'),
        }],
      };
    }
  );

  server.tool(
    'get_quota',
    'Get Gmail storage quota usage information.',
    schemas.getQuotaSchema.shape,
    async () => {
      const result = await withErrorHandling(async () => {
        const gmail = await getGmailClient();
        // Gmail doesn't have a direct quota endpoint, so we estimate from profile
        // For actual quota, we'd need to use Google Drive API
        const response = await gmail.users.getProfile({ userId: 'me' });
        return {
          emailAddress: response.data.emailAddress || '',
          messagesTotal: response.data.messagesTotal || 0,
        };
      }, 'Get quota');
      return {
        content: [{
          type: 'text',
          text: [
            `Email: ${result.emailAddress}`,
            `Total Messages: ${result.messagesTotal}`,
            '(Note: For detailed storage quota, use Google Drive API)',
          ].join('\n'),
        }],
      };
    }
  );
}
