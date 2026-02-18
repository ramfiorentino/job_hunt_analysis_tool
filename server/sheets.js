import { google } from 'googleapis'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import { exec } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CREDENTIALS_PATH = path.join(ROOT, 'credentials.json')
const TOKEN_PATH = path.join(ROOT, 'token.json')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const OAUTH_PORT = 3002

let authClient = null

function openBrowser(url) {
  exec(`open "${url}"`, err => {
    if (err) console.log('Could not open browser automatically.')
  })
}

function waitForOAuthCode() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${OAUTH_PORT}`)
      const code = url.searchParams.get('code')
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<html><body><h2>Authorization successful! You can close this tab and return to the terminal.</h2></body></html>')
        server.close()
        resolve(code)
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Authorization failed — no code received.')
        server.close()
        reject(new Error('No authorization code in callback'))
      }
    })
    server.listen(OAUTH_PORT, () => {
      console.log(`Waiting for authorization callback on port ${OAUTH_PORT}...`)
    })
    server.on('error', reject)
  })
}

export async function initAuth() {
  if (authClient) return

  let credContent
  try {
    credContent = await readFile(CREDENTIALS_PATH, 'utf8')
  } catch {
    throw new Error(`credentials.json not found at ${CREDENTIALS_PATH}. See SETUP.md step 3.4.`)
  }

  const creds = JSON.parse(credContent)
  const { client_id, client_secret } = creds.installed || creds.web

  const REDIRECT_URI = `http://localhost:${OAUTH_PORT}`
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI)

  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(await readFile(TOKEN_PATH, 'utf8'))
    oAuth2Client.setCredentials(token)
    authClient = oAuth2Client
    console.log('Google Sheets authenticated (token.json loaded)')
    return
  }

  // First-time OAuth flow
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES })
  console.log('\n=== Google Sheets Authorization Required ===')
  console.log('Opening browser... If it does not open, visit:\n')
  console.log(authUrl)
  console.log()
  openBrowser(authUrl)

  const code = await waitForOAuthCode()
  const { tokens } = await oAuth2Client.getToken(code)
  oAuth2Client.setCredentials(tokens)
  await writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2))
  console.log('\nAuthorization complete. token.json saved.\n')
  authClient = oAuth2Client
}

function checkConfig() {
  const { SPREADSHEET_ID, JOBS_TAB_NAME, SKILLS_TAB_NAME } = process.env
  const missing = []
  if (!SPREADSHEET_ID) missing.push('SPREADSHEET_ID')
  if (!JOBS_TAB_NAME) missing.push('JOBS_TAB_NAME')
  if (!SKILLS_TAB_NAME) missing.push('SKILLS_TAB_NAME')
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. Check your .env file.`)
  }
  return { SPREADSHEET_ID, JOBS_TAB_NAME, SKILLS_TAB_NAME }
}

async function readSheet(tabName) {
  const { SPREADSHEET_ID } = checkConfig()
  const sheets = google.sheets({ version: 'v4', auth: authClient })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: tabName,
  })
  const rows = response.data.values
  if (!rows || rows.length < 1) return []

  const [headers, ...dataRows] = rows
  return dataRows
    .filter(row => row && row.some(cell => cell !== ''))
    .map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])))
}

export async function getJobs() {
  const { JOBS_TAB_NAME } = checkConfig()
  return readSheet(JOBS_TAB_NAME)
}

export async function getSkills() {
  const { SKILLS_TAB_NAME } = checkConfig()
  return readSheet(SKILLS_TAB_NAME)
}
