import { getGmailClient, withErrorHandling } from '../gmail/client.js';
import { BatchModifyEmailsInput, BatchDeleteEmailsInput } from '../schemas/index.js';

const BATCH_SIZE = 50; // Gmail API limit for batch operations

interface BatchResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
}

export async function batchModifyEmails(input: BatchModifyEmailsInput): Promise<BatchResult> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();
    const errors: string[] = [];
    let processed = 0;
    let failed = 0;

    // Process in batches of 50
    for (let i = 0; i < input.messageIds.length; i += BATCH_SIZE) {
      const batch = input.messageIds.slice(i, i + BATCH_SIZE);

      try {
        await gmail.users.messages.batchModify({
          userId: 'me',
          requestBody: {
            ids: batch,
            addLabelIds: input.addLabelIds,
            removeLabelIds: input.removeLabelIds,
          },
        });
        processed += batch.length;
      } catch (error) {
        // Fallback to individual modifications if batch fails
        for (const messageId of batch) {
          try {
            await gmail.users.messages.modify({
              userId: 'me',
              id: messageId,
              requestBody: {
                addLabelIds: input.addLabelIds,
                removeLabelIds: input.removeLabelIds,
              },
            });
            processed++;
          } catch (individualError) {
            failed++;
            const errorMsg = individualError instanceof Error ? individualError.message : 'Unknown error';
            errors.push(`Failed to modify ${messageId}: ${errorMsg}`);
          }
        }
      }
    }

    return {
      success: failed === 0,
      processed,
      failed,
      errors,
    };
  }, 'Batch modify emails');
}

export async function batchDeleteEmails(input: BatchDeleteEmailsInput): Promise<BatchResult> {
  return withErrorHandling(async () => {
    const gmail = await getGmailClient();
    const errors: string[] = [];
    let processed = 0;
    let failed = 0;

    if (input.permanent) {
      // Permanent delete - use batchDelete
      for (let i = 0; i < input.messageIds.length; i += BATCH_SIZE) {
        const batch = input.messageIds.slice(i, i + BATCH_SIZE);

        try {
          await gmail.users.messages.batchDelete({
            userId: 'me',
            requestBody: {
              ids: batch,
            },
          });
          processed += batch.length;
        } catch (error) {
          // Fallback to individual deletions
          for (const messageId of batch) {
            try {
              await gmail.users.messages.delete({
                userId: 'me',
                id: messageId,
              });
              processed++;
            } catch (individualError) {
              failed++;
              const errorMsg = individualError instanceof Error ? individualError.message : 'Unknown error';
              errors.push(`Failed to delete ${messageId}: ${errorMsg}`);
            }
          }
        }
      }
    } else {
      // Move to trash - use batchModify to add TRASH label
      for (let i = 0; i < input.messageIds.length; i += BATCH_SIZE) {
        const batch = input.messageIds.slice(i, i + BATCH_SIZE);

        try {
          await gmail.users.messages.batchModify({
            userId: 'me',
            requestBody: {
              ids: batch,
              addLabelIds: ['TRASH'],
              removeLabelIds: ['INBOX'],
            },
          });
          processed += batch.length;
        } catch (error) {
          // Fallback to individual trash operations
          for (const messageId of batch) {
            try {
              await gmail.users.messages.trash({
                userId: 'me',
                id: messageId,
              });
              processed++;
            } catch (individualError) {
              failed++;
              const errorMsg = individualError instanceof Error ? individualError.message : 'Unknown error';
              errors.push(`Failed to trash ${messageId}: ${errorMsg}`);
            }
          }
        }
      }
    }

    return {
      success: failed === 0,
      processed,
      failed,
      errors,
    };
  }, 'Batch delete emails');
}

// Utility function to format batch results
export function formatBatchResult(result: BatchResult, operation: string): string {
  const lines: string[] = [];

  if (result.success) {
    lines.push(`${operation} completed successfully.`);
  } else {
    lines.push(`${operation} completed with some failures.`);
  }

  lines.push(`Processed: ${result.processed}`);
  if (result.failed > 0) {
    lines.push(`Failed: ${result.failed}`);
  }

  if (result.errors.length > 0) {
    lines.push('');
    lines.push('Errors:');
    for (const error of result.errors.slice(0, 10)) {
      lines.push(`  - ${error}`);
    }
    if (result.errors.length > 10) {
      lines.push(`  ... and ${result.errors.length - 10} more errors`);
    }
  }

  return lines.join('\n');
}
