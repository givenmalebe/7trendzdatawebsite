import { z } from 'zod';

// Email Operations Schemas

export const searchEmailsSchema = z.object({
  query: z.string().describe('Gmail search query (e.g., "from:sender@example.com", "is:unread", "subject:hello")'),
  maxResults: z.number().min(1).max(500).default(10).describe('Maximum number of results to return (1-500)'),
  pageToken: z.string().optional().describe('Page token for pagination'),
  includeSpamTrash: z.boolean().default(false).describe('Include messages from SPAM and TRASH'),
});

export const readEmailSchema = z.object({
  messageId: z.string().describe('The ID of the message to read'),
  format: z.enum(['full', 'metadata', 'minimal', 'raw']).default('full').describe('Format of the message to return'),
});

export const sendEmailSchema = z.object({
  to: z.union([z.string(), z.array(z.string())]).describe('Recipient email address(es)'),
  cc: z.union([z.string(), z.array(z.string())]).optional().describe('CC recipient(s)'),
  bcc: z.union([z.string(), z.array(z.string())]).optional().describe('BCC recipient(s)'),
  subject: z.string().describe('Email subject'),
  body: z.string().describe('Email body content'),
  isHtml: z.boolean().default(false).describe('Whether the body is HTML'),
  attachments: z.array(z.object({
    filename: z.string().describe('Attachment filename'),
    content: z.string().describe('Base64 encoded file content'),
    mimeType: z.string().optional().describe('MIME type (auto-detected if not provided)'),
  })).optional().describe('File attachments'),
  threadId: z.string().optional().describe('Thread ID to reply in'),
  inReplyTo: z.string().optional().describe('Message-ID to reply to'),
  references: z.string().optional().describe('References header for threading'),
});

export const draftEmailSchema = z.object({
  to: z.union([z.string(), z.array(z.string())]).describe('Recipient email address(es)'),
  cc: z.union([z.string(), z.array(z.string())]).optional().describe('CC recipient(s)'),
  bcc: z.union([z.string(), z.array(z.string())]).optional().describe('BCC recipient(s)'),
  subject: z.string().describe('Email subject'),
  body: z.string().describe('Email body content'),
  isHtml: z.boolean().default(false).describe('Whether the body is HTML'),
  attachments: z.array(z.object({
    filename: z.string().describe('Attachment filename'),
    content: z.string().describe('Base64 encoded file content'),
    mimeType: z.string().optional().describe('MIME type'),
  })).optional().describe('File attachments'),
  threadId: z.string().optional().describe('Thread ID to reply in'),
});

export const deleteEmailSchema = z.object({
  messageId: z.string().describe('The ID of the message to delete'),
  permanent: z.boolean().default(false).describe('If true, permanently delete (not trash)'),
});

export const modifyEmailSchema = z.object({
  messageId: z.string().describe('The ID of the message to modify'),
  addLabelIds: z.array(z.string()).optional().describe('Label IDs to add'),
  removeLabelIds: z.array(z.string()).optional().describe('Label IDs to remove'),
});

export const getThreadSchema = z.object({
  threadId: z.string().describe('The ID of the thread to get'),
  format: z.enum(['full', 'metadata', 'minimal']).default('full').describe('Format of messages'),
});

// Label Schemas

export const listLabelsSchema = z.object({});

export const getLabelSchema = z.object({
  labelId: z.string().describe('The ID of the label to get'),
});

export const createLabelSchema = z.object({
  name: z.string().describe('Display name for the label'),
  messageListVisibility: z.enum(['show', 'hide']).optional().describe('Visibility in message list'),
  labelListVisibility: z.enum(['labelShow', 'labelShowIfUnread', 'labelHide']).optional().describe('Visibility in label list'),
  backgroundColor: z.string().optional().describe('Background color hex code'),
  textColor: z.string().optional().describe('Text color hex code'),
});

export const updateLabelSchema = z.object({
  labelId: z.string().describe('The ID of the label to update'),
  name: z.string().optional().describe('New display name'),
  messageListVisibility: z.enum(['show', 'hide']).optional().describe('Visibility in message list'),
  labelListVisibility: z.enum(['labelShow', 'labelShowIfUnread', 'labelHide']).optional().describe('Visibility in label list'),
  backgroundColor: z.string().optional().describe('Background color hex code'),
  textColor: z.string().optional().describe('Text color hex code'),
});

export const deleteLabelSchema = z.object({
  labelId: z.string().describe('The ID of the label to delete'),
});

export const getOrCreateLabelSchema = z.object({
  name: z.string().describe('Display name for the label'),
  messageListVisibility: z.enum(['show', 'hide']).optional().describe('Visibility in message list'),
  labelListVisibility: z.enum(['labelShow', 'labelShowIfUnread', 'labelHide']).optional().describe('Visibility in label list'),
  backgroundColor: z.string().optional().describe('Background color hex code'),
  textColor: z.string().optional().describe('Text color hex code'),
});

// Filter Schemas

export const listFiltersSchema = z.object({});

export const getFilterSchema = z.object({
  filterId: z.string().describe('The ID of the filter to get'),
});

export const createFilterSchema = z.object({
  criteria: z.object({
    from: z.string().optional().describe('Sender email pattern'),
    to: z.string().optional().describe('Recipient email pattern'),
    subject: z.string().optional().describe('Subject contains'),
    query: z.string().optional().describe('Gmail search query'),
    negatedQuery: z.string().optional().describe('Negated search query'),
    hasAttachment: z.boolean().optional().describe('Has attachment'),
    excludeChats: z.boolean().optional().describe('Exclude chat messages'),
    size: z.number().optional().describe('Size threshold in bytes'),
    sizeComparison: z.enum(['larger', 'smaller']).optional().describe('Size comparison type'),
  }).describe('Filter matching criteria'),
  action: z.object({
    addLabelIds: z.array(z.string()).optional().describe('Labels to add'),
    removeLabelIds: z.array(z.string()).optional().describe('Labels to remove'),
    forward: z.string().optional().describe('Email to forward to'),
  }).describe('Actions to perform'),
});

export const deleteFilterSchema = z.object({
  filterId: z.string().describe('The ID of the filter to delete'),
});

export const createFilterFromTemplateSchema = z.object({
  template: z.enum([
    'from_sender',
    'to_recipient',
    'with_attachments',
    'with_subject',
    'larger_than',
    'mark_important',
  ]).describe('Template name'),
  params: z.record(z.string()).describe('Template parameters (e.g., {from: "sender@example.com", labelId: "IMPORTANT"})'),
});

// Batch Schemas

export const batchModifyEmailsSchema = z.object({
  messageIds: z.array(z.string()).min(1).max(1000).describe('Message IDs to modify'),
  addLabelIds: z.array(z.string()).optional().describe('Label IDs to add'),
  removeLabelIds: z.array(z.string()).optional().describe('Label IDs to remove'),
});

export const batchDeleteEmailsSchema = z.object({
  messageIds: z.array(z.string()).min(1).max(1000).describe('Message IDs to delete'),
  permanent: z.boolean().default(false).describe('If true, permanently delete'),
});

// Attachment Schemas

export const downloadAttachmentSchema = z.object({
  messageId: z.string().describe('The message ID containing the attachment'),
  attachmentId: z.string().describe('The attachment ID'),
  savePath: z.string().describe('Local filesystem path to save the file'),
});

export const listAttachmentsSchema = z.object({
  messageId: z.string().describe('The message ID to list attachments for'),
});

// Utility Schemas

export const getProfileSchema = z.object({});

export const getQuotaSchema = z.object({});

// Type exports
export type SearchEmailsInput = z.infer<typeof searchEmailsSchema>;
export type ReadEmailInput = z.infer<typeof readEmailSchema>;
export type SendEmailInput = z.infer<typeof sendEmailSchema>;
export type DraftEmailInput = z.infer<typeof draftEmailSchema>;
export type DeleteEmailInput = z.infer<typeof deleteEmailSchema>;
export type ModifyEmailInput = z.infer<typeof modifyEmailSchema>;
export type GetThreadInput = z.infer<typeof getThreadSchema>;

export type GetLabelInput = z.infer<typeof getLabelSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
export type DeleteLabelInput = z.infer<typeof deleteLabelSchema>;
export type GetOrCreateLabelInput = z.infer<typeof getOrCreateLabelSchema>;

export type GetFilterInput = z.infer<typeof getFilterSchema>;
export type CreateFilterInput = z.infer<typeof createFilterSchema>;
export type DeleteFilterInput = z.infer<typeof deleteFilterSchema>;
export type CreateFilterFromTemplateInput = z.infer<typeof createFilterFromTemplateSchema>;

export type BatchModifyEmailsInput = z.infer<typeof batchModifyEmailsSchema>;
export type BatchDeleteEmailsInput = z.infer<typeof batchDeleteEmailsSchema>;

export type DownloadAttachmentInput = z.infer<typeof downloadAttachmentSchema>;
export type ListAttachmentsInput = z.infer<typeof listAttachmentsSchema>;
