import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import open from 'open';
import { GmailCredentials, OAuthTokens } from './types.js';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.settings.basic',
];

const CONFIG_DIR = path.join(process.env.HOME || '~', '.gmail-mcp');
const TOKENS_DIR = path.join(CONFIG_DIR, 'tokens');
const CREDENTIALS_PATH = path.join(CONFIG_DIR, 'credentials.json');
const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

// Current account for multi-account support
let currentAccount: string = 'default';

export function setCurrentAccount(account: string): void {
  currentAccount = account;
}

export function getCurrentAccount(): string {
  return currentAccount;
}

function getTokenPath(account?: string): string {
  const acct = account || currentAccount;
  return path.join(TOKENS_DIR, `${acct}.json`);
}

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  if (!fs.existsSync(TOKENS_DIR)) {
    fs.mkdirSync(TOKENS_DIR, { recursive: true, mode: 0o700 });
  }
}

function loadCredentials(): GmailCredentials {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `Credentials file not found at ${CREDENTIALS_PATH}. ` +
      'Please download OAuth credentials from Google Cloud Console and save them there.'
    );
  }
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(content);
}

function loadTokens(account?: string): OAuthTokens | null {
  const tokenPath = getTokenPath(account);
  if (!fs.existsSync(tokenPath)) {
    return null;
  }
  const content = fs.readFileSync(tokenPath, 'utf-8');
  return JSON.parse(content);
}

function saveTokens(tokens: OAuthTokens, account?: string): void {
  ensureConfigDir();
  const tokenPath = getTokenPath(account);
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), { mode: 0o600 });
}

function getClientConfig(credentials: GmailCredentials) {
  const config = credentials.installed || credentials.web;
  if (!config) {
    throw new Error('Invalid credentials format. Expected "installed" or "web" key.');
  }
  return config;
}

export function createOAuth2Client(): OAuth2Client {
  const credentials = loadCredentials();
  const config = getClientConfig(credentials);

  return new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    REDIRECT_URI
  );
}

export async function getAuthenticatedClient(): Promise<OAuth2Client> {
  const oauth2Client = createOAuth2Client();
  const tokens = loadTokens();

  if (!tokens) {
    throw new Error(
      `Not authenticated for account "${currentAccount}". Please run "gmail-mcp auth --account ${currentAccount}" first.`
    );
  }

  oauth2Client.setCredentials(tokens);

  // Set up automatic token refresh
  oauth2Client.on('tokens', (newTokens) => {
    const existingTokens = loadTokens();
    const updatedTokens = {
      ...existingTokens,
      ...newTokens,
    } as OAuthTokens;
    saveTokens(updatedTokens);
  });

  // Check if token needs refresh
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      const updatedTokens = {
        ...tokens,
        ...credentials,
      } as OAuthTokens;
      saveTokens(updatedTokens);
      oauth2Client.setCredentials(updatedTokens);
    } catch (error) {
      throw new Error(
        `Token refresh failed for account "${currentAccount}". Please run "gmail-mcp auth --account ${currentAccount}" to re-authenticate.`
      );
    }
  }

  return oauth2Client;
}

async function waitForAuthCode(authUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url || '', `http://localhost:${REDIRECT_PORT}`);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: system-ui; padding: 40px; text-align: center;">
              <h1 style="color: #d93025;">Authentication Failed</h1>
              <p>Error: ${error}</p>
              <p>You can close this window.</p>
            </body>
          </html>
        `);
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: system-ui; padding: 40px; text-align: center;">
              <h1 style="color: #1a73e8;">Authentication Successful!</h1>
              <p>You can close this window and return to the terminal.</p>
            </body>
          </html>
        `);
        server.close();
        resolve(code);
      }
    });

    server.listen(REDIRECT_PORT, () => {
      console.error(`\nOpening browser for authentication...`);
      console.error(`If the browser doesn't open, visit: ${authUrl}\n`);
      open(authUrl);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${REDIRECT_PORT} is in use. Please close other applications using this port.`));
      } else {
        reject(err);
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timed out. Please try again.'));
    }, 5 * 60 * 1000);
  });
}

export async function runAuthFlow(): Promise<void> {
  ensureConfigDir();

  const tokenPath = getTokenPath();
  console.error('Gmail MCP Authentication');
  console.error('========================\n');
  console.error(`Account: ${currentAccount}\n`);

  // Check for credentials file
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`Credentials file not found at: ${CREDENTIALS_PATH}\n`);
    console.error('To set up authentication:');
    console.error('1. Go to https://console.cloud.google.com/');
    console.error('2. Create or select a project');
    console.error('3. Enable the Gmail API');
    console.error('4. Go to Credentials > Create Credentials > OAuth Client ID');
    console.error('5. Choose "Desktop app" as the application type');
    console.error('6. Download the JSON file');
    console.error(`7. Save it as: ${CREDENTIALS_PATH}\n`);
    process.exit(1);
  }

  const oauth2Client = createOAuth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to get refresh token
  });

  try {
    const code = await waitForAuthCode(authUrl);

    console.error('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);

    saveTokens(tokens as OAuthTokens);

    console.error('\nAuthentication successful!');
    console.error(`Tokens saved to: ${tokenPath}\n`);
    console.error(`You can now use the Gmail MCP server with --account ${currentAccount}`);
  } catch (error) {
    console.error('\nAuthentication failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export function isAuthenticated(): boolean {
  const tokens = loadTokens();
  return tokens !== null && !!tokens.refresh_token;
}

export function listAuthenticatedAccounts(): string[] {
  if (!fs.existsSync(TOKENS_DIR)) {
    return [];
  }
  return fs.readdirSync(TOKENS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

export { CONFIG_DIR, CREDENTIALS_PATH, TOKENS_DIR };
