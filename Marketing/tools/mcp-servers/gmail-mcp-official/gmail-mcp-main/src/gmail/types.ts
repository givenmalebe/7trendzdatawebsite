import { gmail_v1 } from 'googleapis';

export interface GmailCredentials {
  installed?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  web?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface ParsedEmail {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  headers: {
    from?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    date?: string;
    messageId?: string;
    inReplyTo?: string;
    references?: string;
  };
  body: {
    plain?: string;
    html?: string;
  };
  attachments: Attachment[];
  internalDate: string;
  sizeEstimate: number;
}

export interface SearchResult {
  messages: ParsedEmail[];
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export interface LabelInfo {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageListVisibility?: string;
  labelListVisibility?: string;
  color?: {
    backgroundColor?: string;
    textColor?: string;
  };
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number;
}

export interface FilterCriteria {
  from?: string;
  to?: string;
  subject?: string;
  query?: string;
  negatedQuery?: string;
  hasAttachment?: boolean;
  excludeChats?: boolean;
  size?: number;
  sizeComparison?: 'larger' | 'smaller';
}

export interface FilterAction {
  addLabelIds?: string[];
  removeLabelIds?: string[];
  forward?: string;
}

export interface FilterInfo {
  id: string;
  criteria: FilterCriteria;
  action: FilterAction;
}

export interface SendEmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  attachments?: AttachmentInput[];
  threadId?: string;
  inReplyTo?: string;
  references?: string;
}

export interface AttachmentInput {
  filename: string;
  content: string; // base64 encoded
  mimeType?: string;
}

export interface DraftEmailOptions extends SendEmailOptions {}

export interface BatchModifyOptions {
  messageIds: string[];
  addLabelIds?: string[];
  removeLabelIds?: string[];
}

export interface BatchDeleteOptions {
  messageIds: string[];
  permanent?: boolean;
}

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface ThreadInfo {
  id: string;
  historyId: string;
  messages: ParsedEmail[];
}

export type GmailMessage = gmail_v1.Schema$Message;
export type GmailLabel = gmail_v1.Schema$Label;
export type GmailFilter = gmail_v1.Schema$Filter;
export type GmailThread = gmail_v1.Schema$Thread;
