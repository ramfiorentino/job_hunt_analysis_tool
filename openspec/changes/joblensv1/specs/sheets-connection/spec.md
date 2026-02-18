## ADDED Requirements

### Requirement: Google Sheets OAuth authentication
The server SHALL authenticate with the Google Sheets API using OAuth 2.0 credentials stored locally in `credentials.json`, with the token persisted in `token.json`.

#### Scenario: First-time authentication
- **WHEN** the server starts and no `token.json` exists
- **THEN** it opens a browser window for the user to authorize access, and stores the resulting token in `token.json`

#### Scenario: Subsequent authentication
- **WHEN** the server starts and a valid `token.json` exists
- **THEN** it authenticates silently without user interaction

### Requirement: Read job listings tab
The server SHALL expose a `GET /api/jobs` endpoint that reads the job listings tab from the configured Google Spreadsheet and returns the data as a JSON array of objects (one per row, keyed by column headers).

#### Scenario: Successful job data fetch
- **WHEN** the frontend calls `GET /api/jobs`
- **THEN** the server returns a JSON array where each object contains the job listing's fields (Job Title, URL, Company, Salary, Keywords, Location, Remote Status, Description, and any additional columns like Open Questions, Benefits, Industry, Company Size, Company Vibe, Latest Funding Round, Lead Source, Priority)

#### Scenario: Empty spreadsheet
- **WHEN** the job listings tab has only headers and no data rows
- **THEN** the server returns an empty JSON array `[]`

### Requirement: Read skills tab
The server SHALL expose a `GET /api/skills` endpoint that reads the skills tab from the configured Google Spreadsheet and returns the data as a JSON array of objects with category, skill name, and proficiency level.

#### Scenario: Successful skills data fetch
- **WHEN** the frontend calls `GET /api/skills`
- **THEN** the server returns a JSON array where each object contains `category`, `skill`, and `proficiency`

### Requirement: Spreadsheet configuration
The server SHALL read the Spreadsheet ID, job listings tab name, and skills tab name from environment variables or a local configuration file.

#### Scenario: Configuration provided
- **WHEN** the server starts with the spreadsheet ID and tab names configured
- **THEN** it uses those values to read from the correct spreadsheet and tabs

#### Scenario: Configuration missing
- **WHEN** the server starts without required configuration
- **THEN** it logs a clear error message indicating which configuration values are missing
