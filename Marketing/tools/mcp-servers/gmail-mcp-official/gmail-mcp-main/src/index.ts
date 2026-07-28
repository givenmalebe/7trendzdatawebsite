#!/usr/bin/env node

import { runAuthFlow, setCurrentAccount, listAuthenticatedAccounts } from './gmail/auth.js';
import { runServer } from './server.js';

function parseArgs(args: string[]): { command: string | null; account: string } {
  let command: string | null = null;
  let account = 'default';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--account' || arg === '-a') {
      if (i + 1 < args.length) {
        account = args[i + 1];
        i++; // skip next arg
      }
    } else if (!arg.startsWith('-')) {
      command = arg;
    }
  }

  return { command, account };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, account } = parseArgs(args);

  // Set the account for all operations
  setCurrentAccount(account);

  switch (command) {
    case 'auth':
      await runAuthFlow();
      break;

    case 'list':
    case 'accounts':
      const accounts = listAuthenticatedAccounts();
      if (accounts.length === 0) {
        console.log('No authenticated accounts. Run "gmail-mcp auth --account <name>" to add one.');
      } else {
        console.log('Authenticated accounts:');
        accounts.forEach(a => console.log(`  - ${a}`));
      }
      break;

    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;

    case 'version':
    case '--version':
    case '-v':
      console.log('gmail-mcp v1.0.0');
      break;

    default:
      // Default: run as MCP server
      await runServer();
      break;
  }
}

function printHelp(): void {
  console.log(`
Gmail MCP Server - A Model Context Protocol server for Gmail

USAGE:
  gmail-mcp [COMMAND] [OPTIONS]

COMMANDS:
  (none)     Run the MCP server (default)
  auth       Authenticate with Gmail via OAuth
  list       List authenticated accounts
  help       Show this help message
  version    Show version information

OPTIONS:
  --account, -a <name>   Account name for multi-account support (default: "default")

EXAMPLES:
  gmail-mcp auth --account massena       # Authenticate the "massena" account
  gmail-mcp auth --account playful       # Authenticate the "playful" account
  gmail-mcp --account massena            # Run server for "massena" account
  gmail-mcp list                         # List all authenticated accounts

SETUP:
  1. Create OAuth credentials in Google Cloud Console:
     - Go to https://console.cloud.google.com/
     - Create or select a project
     - Enable the Gmail API
     - Go to Credentials > Create Credentials > OAuth Client ID
     - Choose "Desktop app" as the application type
     - Download the JSON file

  2. Save credentials:
     - Save the downloaded JSON as ~/.gmail-mcp/credentials.json

  3. Authenticate:
     - Run: gmail-mcp auth
     - Follow the browser prompts to authorize

  4. Add to Claude Code:
     - Run: claude mcp add gmail-massena -- node /path/to/gmail-mcp/dist/index.js --account massena
     - Run: claude mcp add gmail-playful -- node /path/to/gmail-mcp/dist/index.js --account playful

AVAILABLE TOOLS:
  Email Operations:
    - search_emails      Search with Gmail query syntax
    - read_email         Read a specific message
    - send_email         Send an email
    - draft_email        Create a draft
    - delete_email       Delete/trash a message
    - modify_email       Add/remove labels
    - get_thread         Get full conversation

  Label Management:
    - list_labels        List all labels
    - get_label          Get label details
    - create_label       Create a new label
    - update_label       Update a label
    - delete_label       Delete a label
    - get_or_create_label Idempotent label creation

  Filter Management:
    - list_filters       List all filters
    - get_filter         Get filter details
    - create_filter      Create a new filter
    - delete_filter      Delete a filter
    - create_filter_from_template Use preset templates

  Batch Operations:
    - batch_modify_emails Bulk label changes
    - batch_delete_emails Bulk delete

  Attachments:
    - download_attachment Download to filesystem
    - list_attachments    List message attachments

  Utilities:
    - get_profile        Get user profile
    - get_quota          Get storage info

RESOURCES:
  - gmail://messages/{messageId}  Access message by ID
  - gmail://threads/{threadId}    Access thread by ID
  - gmail://labels/{labelId}      Access label by ID
`);
}

main().catch((error) => {
  console.error('Error:', error.message || error);
  process.exit(1);
});
