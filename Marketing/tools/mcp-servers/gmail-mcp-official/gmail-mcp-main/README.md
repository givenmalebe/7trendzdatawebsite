# Gmail MCP Server

A comprehensive Model Context Protocol (MCP) server for Gmail, providing 24 tools for full email management including sending, receiving, labels, filters, attachments, and batch operations.

## Features

- **24 Gmail Tools**: Full email operations, label management, filters, batch operations, and attachments
- **Multi-Account Support**: Manage multiple Gmail accounts with `--account` flag
- **OAuth Authentication**: Secure authentication with automatic token refresh
- **Attachment Support**: Download and send attachments
- **Batch Operations**: Efficiently modify or delete up to 1000 emails at once
- **Filter Templates**: Pre-built filter templates for common use cases
- **MCP Resources**: Access messages, threads, and labels via URI

## Prerequisites

- Node.js 18+
- A Google Cloud Project with Gmail API enabled
- OAuth 2.0 credentials (Desktop app type)

## Setup

### 1. Create Google Cloud OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth Client ID"
   - If prompted, configure the OAuth consent screen:
     - Choose "External" user type (or "Internal" for Workspace)
     - Fill in required fields (app name, user support email, developer email)
     - Add scopes: `gmail.modify` and `gmail.settings.basic`
     - Add your email as a test user
   - Select "Desktop app" as the application type
   - Name it (e.g., "Gmail MCP")
   - Click "Create"
5. Download the JSON credentials file

### 2. Install and Configure

```bash
# Clone or download the project
cd gmail-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Create config directory and save credentials
mkdir -p ~/.gmail-mcp
cp /path/to/downloaded/credentials.json ~/.gmail-mcp/credentials.json

# Authenticate (for a single account)
node dist/index.js auth

# Or authenticate with a named account (for multi-account support)
node dist/index.js auth --account work
node dist/index.js auth --account personal
```

The auth command will:
1. Open your browser to Google's OAuth consent page
2. Ask you to authorize the application
3. Save the tokens to `~/.gmail-mcp/tokens/<account>.json`

To list authenticated accounts:
```bash
node dist/index.js list
```

### 3. Add to Claude Code

For a single account:
```bash
claude mcp add gmail -- node /path/to/gmail-mcp/dist/index.js
```

For multiple accounts, add each with its own name:
```bash
claude mcp add gmail-work -- node /path/to/gmail-mcp/dist/index.js --account work
claude mcp add gmail-personal -- node /path/to/gmail-mcp/dist/index.js --account personal
```

Or add manually to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "gmail-work": {
      "command": "node",
      "args": ["/path/to/gmail-mcp/dist/index.js", "--account", "work"]
    },
    "gmail-personal": {
      "command": "node",
      "args": ["/path/to/gmail-mcp/dist/index.js", "--account", "personal"]
    }
  }
}
```

## Available Tools

### Email Operations (7 tools)

| Tool | Description |
|------|-------------|
| `search_emails` | Search with Gmail query syntax, pagination |
| `read_email` | Full message with headers, body, attachment info |
| `send_email` | Send with to/cc/bcc, attachments, threading |
| `draft_email` | Create draft without sending |
| `delete_email` | Trash or permanent delete |
| `modify_email` | Add/remove labels from message |
| `get_thread` | Get full conversation thread |

### Label Management (6 tools)

| Tool | Description |
|------|-------------|
| `list_labels` | All labels (system + user) |
| `create_label` | Create with color, visibility |
| `update_label` | Rename, change settings |
| `delete_label` | Remove custom label |
| `get_or_create_label` | Idempotent label creation |
| `get_label` | Get single label details |

### Filter Management (5 tools)

| Tool | Description |
|------|-------------|
| `list_filters` | All Gmail filters |
| `get_filter` | Single filter details |
| `create_filter` | Custom criteria + actions |
| `delete_filter` | Remove filter |
| `create_filter_from_template` | Preset templates |

### Batch Operations (2 tools)

| Tool | Description |
|------|-------------|
| `batch_modify_emails` | Bulk add/remove labels (50 at a time) |
| `batch_delete_emails` | Bulk delete with fallback |

### Attachments (2 tools)

| Tool | Description |
|------|-------------|
| `download_attachment` | Save to local filesystem |
| `list_attachments` | Get attachment metadata for message |

### Utilities (2 tools)

| Tool | Description |
|------|-------------|
| `get_profile` | User email address, history ID |
| `get_quota` | Storage usage info |

## Resources

| Resource | URI Pattern |
|----------|-------------|
| Message | `gmail://messages/{messageId}` |
| Thread | `gmail://threads/{threadId}` |
| Label | `gmail://labels/{labelId}` |

## Usage Examples

### Search for unread emails
```
Search my Gmail for unread emails from the last week
```

### Read a specific email
```
Read the email with ID 18abc123def
```

### Send an email
```
Send an email to john@example.com with subject "Hello" and body "Hi John, how are you?"
```

### Create a filter
```
Create a Gmail filter that labels all emails from newsletter@example.com with "Newsletters"
```

### Batch operations
```
Move all emails matching "is:unread older_than:30d" to trash
```

## OAuth Scopes

The server uses these scopes:
- `gmail.modify` - Read, compose, send, and modify emails and labels
- `gmail.settings.basic` - Manage mail filters

## File Structure

```
gmail-mcp/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── server.ts             # MCP server setup
│   ├── gmail/
│   │   ├── auth.ts           # OAuth flow
│   │   ├── client.ts         # Gmail API wrapper
│   │   ├── mime.ts           # MIME parsing/encoding
│   │   └── types.ts          # Type definitions
│   ├── tools/
│   │   ├── index.ts          # Tool registration
│   │   ├── emails.ts         # Email operations
│   │   ├── labels.ts         # Label management
│   │   ├── filters.ts        # Filter management
│   │   ├── batch.ts          # Batch operations
│   │   └── attachments.ts    # Attachment handling
│   ├── resources/
│   │   └── index.ts          # MCP resources
│   └── schemas/
│       └── index.ts          # Zod schemas
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- Credentials stored in `~/.gmail-mcp/` with restricted permissions (0600)
- Per-account tokens stored in `~/.gmail-mcp/tokens/`
- Tokens automatically refresh when expired
- OAuth callback only on localhost
- No external telemetry or data collection

## Troubleshooting

### "Not authenticated" error
Run `node dist/index.js auth --account <name>` to authenticate.

### "Permission denied" error
Ensure your OAuth credentials have the correct scopes and the Gmail API is enabled.

### Token refresh fails
Delete `~/.gmail-mcp/tokens/<account>.json` and run auth again.

### Port 3000 in use
The OAuth callback requires port 3000. Close any applications using this port.

## License

MIT
