## ADDED Requirements

### Requirement: Vite React project initialization
The project SHALL be initialized as a Vite + React application using JavaScript (not TypeScript) with the standard Vite project structure.

#### Scenario: Project runs locally
- **WHEN** the developer runs `npm run dev`
- **THEN** Vite starts a local dev server and serves the React application in the browser

### Requirement: Core dependencies installed
The project SHALL include `recharts`, `googleapis`, and `express` as dependencies in `package.json`. The `@anthropic-ai/sdk` dependency SHALL be added in Phase 3.

#### Scenario: Phase 1-2 dependencies available
- **WHEN** a module imports from `recharts`, `googleapis`, or `express`
- **THEN** the import resolves without error

### Requirement: Source folder structure
The project SHALL contain `src/analysis/`, `src/api/`, `src/components/`, and `server/` directories with placeholder files as defined in the design document.

#### Scenario: Placeholder modules exist
- **WHEN** a future task needs to add analysis logic or a component
- **THEN** the target directory and placeholder file already exist as the entry point

### Requirement: OAuth credentials excluded from version control
The `.gitignore` file SHALL include entries for `credentials.json`, `token.json`, `node_modules/`, and `.DS_Store`.

#### Scenario: Credentials not tracked by git
- **WHEN** `credentials.json` or `token.json` exist in the project root
- **THEN** `git status` does not show them as untracked or modified files

### Requirement: Vite proxy configuration
The `vite.config.js` SHALL configure a dev proxy that forwards `/api/*` requests to the local Express server.

#### Scenario: Frontend API calls reach Express
- **WHEN** the React app makes a fetch request to `/api/jobs`
- **THEN** Vite proxies the request to the Express server running on its configured port
