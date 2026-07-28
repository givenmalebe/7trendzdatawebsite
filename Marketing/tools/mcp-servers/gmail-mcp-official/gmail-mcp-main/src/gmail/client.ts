import { google, gmail_v1 } from 'googleapis';
import { getAuthenticatedClient } from './auth.js';

let gmailClient: gmail_v1.Gmail | null = null;

export async function getGmailClient(): Promise<gmail_v1.Gmail> {
  if (!gmailClient) {
    const auth = await getAuthenticatedClient();
    gmailClient = google.gmail({ version: 'v1', auth });
  }
  return gmailClient;
}

export function resetGmailClient(): void {
  gmailClient = null;
}

export class GmailApiError extends Error {
  code: number;
  details?: unknown;

  constructor(message: string, code: number, details?: unknown) {
    super(message);
    this.name = 'GmailApiError';
    this.code = code;
    this.details = details;
  }

  static fromGoogleError(error: unknown): GmailApiError {
    if (error && typeof error === 'object' && 'code' in error) {
      const googleError = error as { code: number; message?: string; errors?: unknown };
      return new GmailApiError(
        googleError.message || 'Unknown Gmail API error',
        googleError.code,
        googleError.errors
      );
    }
    if (error instanceof Error) {
      return new GmailApiError(error.message, 500);
    }
    return new GmailApiError('Unknown error', 500);
  }
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const gmailError = GmailApiError.fromGoogleError(error);

    // Add context to the error message
    gmailError.message = `${context}: ${gmailError.message}`;

    // Map common error codes to user-friendly messages
    switch (gmailError.code) {
      case 401:
        gmailError.message = 'Authentication expired. Please run "gmail-mcp auth" to re-authenticate.';
        break;
      case 403:
        gmailError.message = `Permission denied: ${gmailError.message}. Check that the required Gmail API scopes are enabled.`;
        break;
      case 404:
        gmailError.message = `Not found: ${gmailError.message}`;
        break;
      case 429:
        gmailError.message = 'Rate limit exceeded. Please wait a moment and try again.';
        break;
    }

    throw gmailError;
  }
}
