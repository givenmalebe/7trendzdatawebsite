import { getGmailClient, withErrorHandling } from '../gmail/client.js';
import {
  GetFilterInput,
  CreateFilterInput,
  DeleteFilterInput,
  CreateFilterFromTemplateInput,
} from '../schemas/index.js';
import { FilterInfo, FilterCriteria, FilterAction } from '../gmail/types.js';

function parseFilter(filter: any): FilterInfo {
  return {
    id: filter.id || '',
    criteria: {
      from: filter.criteria?.from,
      to: filter.criteria?.to,
      subject: filter.criteria?.subject,
      query: filter.criteria?.query,
      negatedQuery: filter.criteria?.negatedQuery,
      hasAttachment: filter.criteria?.hasAttachment,
      excludeChats: filter.criteria?.excludeChats,
      size: filter.criteria?.size,
      sizeComparison: filter.criteria?.sizeComparison,
    },
    action: {
      addLabelIds: filter.action?.addLabelIds,
      removeLabelIds: filter.action?.removeLabelIds,
      forward: filter.action?.forward,
    },
  };
}

export async function listFilters(): Promise<{ filters: FilterInfo[] }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.settings.filters.list({
      userId: 'me',
    });

    const filters = (response.data.filter || []).map(parseFilter);

    return { filters };
  }, 'List filters');
}

export async function getFilter(input: GetFilterInput): Promise<FilterInfo> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.settings.filters.get({
      userId: 'me',
      id: input.filterId,
    });

    return parseFilter(response.data);
  }, 'Get filter');
}

export async function createFilter(input: CreateFilterInput): Promise<FilterInfo> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    const response = await gmail.users.settings.filters.create({
      userId: 'me',
      requestBody: {
        criteria: {
          from: input.criteria.from,
          to: input.criteria.to,
          subject: input.criteria.subject,
          query: input.criteria.query,
          negatedQuery: input.criteria.negatedQuery,
          hasAttachment: input.criteria.hasAttachment,
          excludeChats: input.criteria.excludeChats,
          size: input.criteria.size,
          sizeComparison: input.criteria.sizeComparison,
        },
        action: {
          addLabelIds: input.action.addLabelIds,
          removeLabelIds: input.action.removeLabelIds,
          forward: input.action.forward,
        },
      },
    });

    return parseFilter(response.data);
  }, 'Create filter');
}

export async function deleteFilter(input: DeleteFilterInput): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();

    await gmail.users.settings.filters.delete({
      userId: 'me',
      id: input.filterId,
    });

    return { success: true };
  }, 'Delete filter');
}

// Predefined filter templates
const FILTER_TEMPLATES: Record<string, (params: Record<string, string>) => { criteria: FilterCriteria; action: FilterAction }> = {
  // Filter emails from a specific sender and apply a label
  from_sender: (params) => ({
    criteria: {
      from: params.from,
    },
    action: {
      addLabelIds: params.labelId ? [params.labelId] : undefined,
      removeLabelIds: params.removeLabelId ? [params.removeLabelId] : undefined,
    },
  }),

  // Filter emails to a specific recipient
  to_recipient: (params) => ({
    criteria: {
      to: params.to,
    },
    action: {
      addLabelIds: params.labelId ? [params.labelId] : undefined,
      removeLabelIds: params.removeLabelId ? [params.removeLabelId] : undefined,
    },
  }),

  // Filter emails with attachments
  with_attachments: (params) => ({
    criteria: {
      hasAttachment: true,
      from: params.from,
    },
    action: {
      addLabelIds: params.labelId ? [params.labelId] : undefined,
    },
  }),

  // Filter emails with specific subject keywords
  with_subject: (params) => ({
    criteria: {
      subject: params.subject,
    },
    action: {
      addLabelIds: params.labelId ? [params.labelId] : undefined,
    },
  }),

  // Filter emails larger than a size
  larger_than: (params) => ({
    criteria: {
      size: parseInt(params.size || '5000000', 10), // Default 5MB
      sizeComparison: 'larger',
    },
    action: {
      addLabelIds: params.labelId ? [params.labelId] : undefined,
    },
  }),

  // Mark emails as important from sender
  mark_important: (params) => ({
    criteria: {
      from: params.from,
    },
    action: {
      addLabelIds: ['IMPORTANT'],
    },
  }),
};

export async function createFilterFromTemplate(input: CreateFilterFromTemplateInput): Promise<FilterInfo> {
  return withErrorHandling(async () => {
    const templateFn = FILTER_TEMPLATES[input.template];
    if (!templateFn) {
      throw new Error(`Unknown filter template: ${input.template}. Available: ${Object.keys(FILTER_TEMPLATES).join(', ')}`);
    }

    const { criteria, action } = templateFn(input.params);

    return createFilter({ criteria, action });
  }, 'Create filter from template');
}

// Utility function to format filters for display
export function formatFilters(filters: FilterInfo[]): string {
  if (filters.length === 0) {
    return 'No filters found';
  }

  const lines: string[] = [];

  for (const filter of filters) {
    lines.push(`Filter: ${filter.id}`);

    // Criteria
    lines.push('  Criteria:');
    if (filter.criteria.from) lines.push(`    From: ${filter.criteria.from}`);
    if (filter.criteria.to) lines.push(`    To: ${filter.criteria.to}`);
    if (filter.criteria.subject) lines.push(`    Subject: ${filter.criteria.subject}`);
    if (filter.criteria.query) lines.push(`    Query: ${filter.criteria.query}`);
    if (filter.criteria.hasAttachment) lines.push(`    Has attachment: yes`);
    if (filter.criteria.size) {
      lines.push(`    Size ${filter.criteria.sizeComparison || 'larger'}: ${filter.criteria.size} bytes`);
    }

    // Actions
    lines.push('  Actions:');
    if (filter.action.addLabelIds?.length) {
      lines.push(`    Add labels: ${filter.action.addLabelIds.join(', ')}`);
    }
    if (filter.action.removeLabelIds?.length) {
      lines.push(`    Remove labels: ${filter.action.removeLabelIds.join(', ')}`);
    }
    if (filter.action.forward) {
      lines.push(`    Forward to: ${filter.action.forward}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

export function getAvailableTemplates(): string[] {
  return Object.keys(FILTER_TEMPLATES);
}
