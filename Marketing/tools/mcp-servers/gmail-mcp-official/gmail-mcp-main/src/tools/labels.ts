import { getGmailClient, withErrorHandling } from '../gmail/client.js';
import {
  GetLabelInput,
  CreateLabelInput,
  UpdateLabelInput,
  DeleteLabelInput,
  GetOrCreateLabelInput,
} from '../schemas/index.js';
import { LabelInfo } from '../gmail/types.js';

function parseLabel(label: any): LabelInfo {
  return {
    id: label.id || '',
    name: label.name || '',
    type: label.type === 'system' ? 'system' : 'user',
    messageListVisibility: label.messageListVisibility,
    labelListVisibility: label.labelListVisibility,
    color: label.color ? {
      backgroundColor: label.color.backgroundColor,
      textColor: label.color.textColor,
    } : undefined,
    messagesTotal: label.messagesTotal,
    messagesUnread: label.messagesUnread,
    threadsTotal: label.threadsTotal,
    threadsUnread: label.threadsUnread,
  };
}

export async function listLabels(): Promise<{ labels: LabelInfo[] }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.labels.list({
      userId: 'me',
    });

    const labels = (response.data.labels || []).map(parseLabel);

    // Sort: system labels first, then user labels alphabetically
    labels.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'system' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return { labels };
  }, 'List labels');
}

export async function getLabel(input: GetLabelInput): Promise<LabelInfo> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.labels.get({
      userId: 'me',
      id: input.labelId,
    });

    return parseLabel(response.data);
  }, 'Get label');
}

export async function createLabel(input: CreateLabelInput): Promise<LabelInfo> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const requestBody: any = {
      name: input.name,
      messageListVisibility: input.messageListVisibility,
      labelListVisibility: input.labelListVisibility,
    };

    if (input.backgroundColor || input.textColor) {
      requestBody.color = {
        backgroundColor: input.backgroundColor,
        textColor: input.textColor,
      };
    }

    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody,
    });

    return parseLabel(response.data);
  }, 'Create label');
}

export async function updateLabel(input: UpdateLabelInput): Promise<LabelInfo> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    // First get the existing label to preserve unchanged properties
    const existingResponse = await gmail.users.labels.get({
      userId: 'me',
      id: input.labelId,
    });

    const existing = existingResponse.data;

    const requestBody: any = {
      name: input.name ?? existing.name,
      messageListVisibility: input.messageListVisibility ?? existing.messageListVisibility,
      labelListVisibility: input.labelListVisibility ?? existing.labelListVisibility,
    };

    if (input.backgroundColor || input.textColor) {
      requestBody.color = {
        backgroundColor: input.backgroundColor ?? existing.color?.backgroundColor,
        textColor: input.textColor ?? existing.color?.textColor,
      };
    } else if (existing.color) {
      requestBody.color = existing.color;
    }

    const response = await gmail.users.labels.update({
      userId: 'me',
      id: input.labelId,
      requestBody,
    });

    return parseLabel(response.data);
  }, 'Update label');
}

export async function deleteLabel(input: DeleteLabelInput): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    await gmail.users.labels.delete({
      userId: 'me',
      id: input.labelId,
    });

    return { success: true };
  }, 'Delete label');
}

export async function getOrCreateLabel(input: GetOrCreateLabelInput): Promise<LabelInfo & { created: boolean }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    // First, try to find an existing label with this name
    const listResponse = await gmail.users.labels.list({
      userId: 'me',
    });

    const existingLabel = (listResponse.data.labels || []).find(
      label => label.name?.toLowerCase() === input.name.toLowerCase()
    );

    if (existingLabel && existingLabel.id) {
      const labelInfo = await getLabel({ labelId: existingLabel.id });
      return { ...labelInfo, created: false };
    }

    // Label doesn't exist, create it
    const newLabel = await createLabel(input);
    return { ...newLabel, created: true };
  }, 'Get or create label');
}

// Utility function to format labels for display
export function formatLabels(labels: LabelInfo[]): string {
  const lines: string[] = [];

  const systemLabels = labels.filter(l => l.type === 'system');
  const userLabels = labels.filter(l => l.type === 'user');

  if (systemLabels.length > 0) {
    lines.push('System Labels:');
    for (const label of systemLabels) {
      const unread = label.messagesUnread ? ` (${label.messagesUnread} unread)` : '';
      lines.push(`  - ${label.name} [${label.id}]${unread}`);
    }
    lines.push('');
  }

  if (userLabels.length > 0) {
    lines.push('User Labels:');
    for (const label of userLabels) {
      const unread = label.messagesUnread ? ` (${label.messagesUnread} unread)` : '';
      const color = label.color ? ` [${label.color.backgroundColor}]` : '';
      lines.push(`  - ${label.name} [${label.id}]${unread}${color}`);
    }
  }

  if (lines.length === 0) {
    lines.push('No labels found');
  }

  return lines.join('\n');
}
