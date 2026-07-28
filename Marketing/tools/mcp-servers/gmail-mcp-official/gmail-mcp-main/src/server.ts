import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { isAuthenticated, getCurrentAccount } from './gmail/auth.js';

export function createServer(): McpServer {
  const account = getCurrentAccount();
  const server = new McpServer({
    name: account === 'default' ? 'gmail-mcp' : `gmail-mcp-${account}`,
    version: '1.0.0',
  });

  // Register all tools and resources
  registerTools(server);
  registerResources(server);

  return server;
}

export async function runServer(): Promise<void> {
  const account = getCurrentAccount();

  // Check authentication before starting
  if (!isAuthenticated()) {
    console.error(`Not authenticated for account "${account}". Please run "gmail-mcp auth --account ${account}" first.`);
    process.exit(1);
  }

  const server = createServer();
  const transport = new StdioServerTransport();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.error('Shutting down...');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('Shutting down...');
    await server.close();
    process.exit(0);
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
  });

  // Connect and start serving
  await server.connect(transport);

  // Log to stderr so it doesn't interfere with MCP protocol on stdout
  console.error(`Gmail MCP server started (account: ${account})`);
}
