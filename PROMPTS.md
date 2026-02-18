# Job Lens v1 — Agent Prompts

> Purpose: Copy-paste prompts to instruct each agent for each work item
> See `EXECUTION.md` for timing and coordination strategy
> See `WORKITEMS.md` for work item details and dependencies

---

## How to Use

1. Follow the execution order in `EXECUTION.md`
2. Copy the prompt for the current work item
3. Paste it into a new Claude Code session (or terminal)
4. Let the agent work autonomously
5. Verify the output before moving to the next prompt

For Phase 2, run Terminal 1/2/3 prompts simultaneously in separate terminals.

---

## Phase 1: Foundation (Sequential on `main`)

### Step 1 — WI-001: Project Scaffold (scaffold agent)

```
You are setting up the project scaffold for "Job Lens", a local web dashboard that analyzes job listings from Google Sheets. Work on the `main` branch.

Create the following from scratch in this directory:

1. Initialize a Vite + React project with JavaScript (not TypeScript). Use `npm create vite@latest . -- --template react` or equivalent that works in the current directory.

2. Install dependencies:
   - `recharts` (charting library)
   - `googleapis` (Google Sheets API)
   - `express` (backend server)
   - `cors` (CORS middleware for Express)
   - `concurrently` (run multiple processes) as a dev dependency

3. Create `.gitignore` with entries for:
   - node_modules/
   - credentials.json
   - token.json
   - .env
   - .DS_Store
   - dist/
   - .llm-cache.json

4. Create server directory with placeholder files:
   - `server/index.js` — Express server entry point, placeholder that starts on port 3001 and responds to GET / with "Job Lens API"
   - `server/sheets.js` — export placeholder functions: `getJobListings()`, `getSkills()`
   - `server/llm.js` — export placeholder: `analyzeDescription()`

5. Create source directories with placeholder files:
   - `src/api/client.js` — export placeholder functions: `fetchJobs()`, `fetchSkills()`
   - `src/analysis/keywords.js` — export placeholder: `getKeywordFrequencies()`
   - `src/analysis/skillGap.js` — export placeholder: `analyzeSkillGaps()`
   - `src/analysis/salary.js` — export placeholder: `parseSalary()`, `analyzeSalaries()`
   - `src/analysis/location.js` — export placeholder: `analyzeLocations()`

6. Configure `vite.config.js` with a dev proxy:
   - Forward `/api` requests to `http://localhost:3001`

7. Add npm scripts to `package.json`:
   - `"server": "node server/index.js"`
   - `"dev": "concurrently \"vite\" \"node server/index.js\""`

8. Verify: run `npm run dev` and confirm both Vite and Express start without errors.

Each placeholder function should have a comment like `// TODO: implement in WI-XXX` and return an empty array or null. The point is to establish the file structure, not implement logic.

Commit when done with message: "WI-001: Initialize project scaffold with Vite, Express, and folder structure"
```

---

### Step 2 — WI-002: App Shell (frontend agent)

```
You are building the app shell for "Job Lens", a local job analysis dashboard. Work on the `main` branch.

Read the existing `src/App.jsx` (created by Vite scaffold) and replace it with a dashboard shell:

1. Set the page title to "Job Lens"

2. Create a dashboard layout with labeled placeholder sections for 5 panels:
   - Keyword Frequency Chart
   - Skill Gap Heatmap
   - Salary Overview
   - Location & Remote Breakdown
   - Jobs Table

3. Each panel should be a simple div/section with:
   - A heading with the panel name
   - A placeholder message like "Data will appear here"
   - A basic border or background to visually distinguish panels

4. Use a simple CSS grid or flexbox layout. Nothing fancy — just enough to see all 5 panels on screen. Add styles to `src/App.css` or inline.

5. Clean up any Vite boilerplate (default counter component, logos, etc.)

6. Verify: `npm run dev` shows the dashboard with all 5 labeled panels.

Commit with message: "WI-002: Add Job Lens dashboard shell with placeholder panels"
```

---

### Step 3 — WI-003: Sheets OAuth & Configuration (backend agent)

```
You are implementing Google Sheets authentication for "Job Lens". Work on the `main` branch.

The Express server is in `server/`. The user will provide `credentials.json` (Google OAuth client credentials) in the project root.

Implement in `server/sheets.js`:

1. OAuth 2.0 authentication flow using `googleapis`:
   - Read client credentials from `credentials.json` in the project root
   - On first run: open browser for user authorization, save token to `token.json`
   - On subsequent runs: load token from `token.json` silently
   - Required scopes: `https://www.googleapis.com/auth/spreadsheets.readonly`

2. Export an `authorize()` function that returns an authenticated Google Sheets client

3. Spreadsheet configuration via environment variables:
   - `SPREADSHEET_ID` — the Google Spreadsheet ID
   - `JOBS_TAB_NAME` — name of the job listings tab (default: "Job Listings")
   - `SKILLS_TAB_NAME` — name of the skills tab (default: "Skills")
   - Read from `.env` file using `dotenv` (install it as a dependency)

4. Create `.env.example` with placeholder values:
   ```
   SPREADSHEET_ID=your-spreadsheet-id-here
   JOBS_TAB_NAME=Job Listings
   SKILLS_TAB_NAME=Skills
   ```

5. Add error handling:
   - If `credentials.json` is missing: log clear error, exit gracefully
   - If `.env` is missing or SPREADSHEET_ID is empty: log clear error

6. Update `.gitignore` to include `.env` if not already there

Commit with message: "WI-003: Implement Google Sheets OAuth and spreadsheet configuration"
```

---

### Step 4 — WI-004: Sheets Data Endpoints (backend agent)

```
You are implementing the API endpoints for "Job Lens". Work on the `main` branch.

Read the existing `server/sheets.js` (OAuth implemented) and `server/index.js` (placeholder).

Implement:

1. In `server/sheets.js`, add two data-reading functions:
   - `getJobListings(auth)` — reads the job listings tab, returns JSON array where each row becomes an object keyed by column headers. Expected columns: Title, Company, Salary, Keywords, Location, Remote Status, Description, URL.
   - `getSkills(auth)` — reads the skills tab, returns JSON array with objects containing `category`, `skill`, and `proficiency` fields.
   - Both functions should handle empty spreadsheets (return `[]`)

2. In `server/index.js`, build out the Express server:
   - Import and call `authorize()` from sheets.js on startup
   - `GET /api/jobs` — calls `getJobListings()`, returns JSON response
   - `GET /api/skills` — calls `getSkills()`, returns JSON response
   - Add `cors()` middleware
   - Add error handling middleware (500 responses with error message)
   - Listen on port 3001

3. The first row of each tab is the header row. Use header values as object keys.

4. Verify by starting the server and hitting both endpoints (they should return data from the spreadsheet, or `[]` if empty).

Commit with message: "WI-004: Implement /api/jobs and /api/skills endpoints"
```

---

### Step 5 — WI-005: Frontend API Client (frontend agent)

```
You are implementing the frontend API client for "Job Lens". Work on the `main` branch.

Read the existing `src/api/client.js` (placeholder).

Implement:

1. `fetchJobs()` — fetches `GET /api/jobs`, returns the JSON array
2. `fetchSkills()` — fetches `GET /api/skills`, returns the JSON array
3. Both should handle errors gracefully (log to console, return empty array)
4. Use plain `fetch()` — no extra HTTP libraries needed
5. The Vite proxy is already configured to forward `/api` to Express

Example usage (for verification):
```js
const jobs = await fetchJobs()   // [{title: "...", company: "...", ...}, ...]
const skills = await fetchSkills() // [{category: "...", skill: "...", proficiency: "..."}, ...]
```

Optionally, wire a quick test in App.jsx — fetch jobs on mount and log to console to confirm the full pipeline works (Google Sheets → Express → Frontend). This is for verification only.

Commit with message: "WI-005: Implement fetchJobs and fetchSkills API client functions"
```

---

## Phase 2: Core Analysis (3 Parallel Branches)

### Branch Setup

Before starting Phase 2, create 3 branches from `main`:

```bash
git checkout main
git checkout -b track-a
git checkout main
git checkout -b track-b
git checkout main
git checkout -b track-c
```

---

### Terminal 1 — Track A: Keywords + Skill Gap

#### WI-006: Keyword Extraction Logic (analysis agent)

```
You are implementing keyword analysis for "Job Lens". Work on the `track-a` branch.

Read `src/analysis/keywords.js` (placeholder) and the API client at `src/api/client.js`.

Implement in `src/analysis/keywords.js`:

1. `normalizeKeyword(keyword)` — takes a raw keyword string, returns normalized version:
   - Lowercase, trim whitespace
   - Collapse known variants. Start with these aliases:
     - react, reactjs, react.js → "react"
     - node, nodejs, node.js → "node.js"
     - js, javascript → "javascript"
     - ts, typescript → "typescript"
     - postgres, postgresql → "postgresql"
     - mongo, mongodb → "mongodb"
     - aws, amazon web services → "aws"
     - gcp, google cloud → "gcp"
     - k8s, kubernetes → "kubernetes"
     - ml, machine learning → "machine learning"
   - Return the normalized string

2. `getKeywordFrequencies(jobs)` — takes an array of job objects (from /api/jobs):
   - Extract keywords from each job's `Keywords` field (split on commas, trim)
   - Normalize each keyword
   - Count occurrences across all listings
   - Return array sorted by count descending: `[{keyword: "react", count: 25}, ...]`

3. Export both functions.

Commit with message: "WI-006: Implement keyword extraction, normalization, and frequency counting"
```

#### WI-007: Keyword Frequency Chart (frontend agent)

```
You are building the keyword chart for "Job Lens". Work on the `track-a` branch.

Read `src/analysis/keywords.js` (just implemented) and `src/App.jsx`.

1. Create `src/components/KeywordChart.jsx`:
   - Receives keyword frequency data as a prop: `[{keyword: "react", count: 25}, ...]`
   - Renders a Recharts horizontal bar chart (`BarChart` with `layout="vertical"`)
   - Keywords on Y-axis (`YAxis dataKey="keyword"`)
   - Counts on X-axis
   - Sorted with highest frequency at the top
   - Show top 15 keywords (or all if fewer than 15)

2. Wire into `src/App.jsx`:
   - Import `fetchJobs` from the API client
   - Import `getKeywordFrequencies` from analysis module
   - Fetch jobs on component mount (useEffect + useState)
   - Compute keyword frequencies from fetched data
   - Replace the "Keyword Frequency Chart" placeholder with the actual `<KeywordChart>` component
   - Show a "Loading..." message while data is being fetched

Commit with message: "WI-007: Add keyword frequency horizontal bar chart"
```

#### WI-008: Skill Gap Analysis Logic (analysis agent)

```
You are implementing skill gap analysis for "Job Lens". Work on the `track-a` branch.

Read `src/analysis/keywords.js` (keyword normalization) and `src/api/client.js`.

Implement in `src/analysis/skillGap.js`:

1. `analyzeSkillGaps(keywordFrequencies, skills)` — takes:
   - `keywordFrequencies`: array from `getKeywordFrequencies()` → `[{keyword, count}, ...]`
   - `skills`: array from `/api/skills` → `[{category, skill, proficiency}, ...]`

2. For each keyword in the market data, check if the user has a matching skill (compare using `normalizeKeyword()` from keywords.js).

3. Categorize each entry:
   - **strength**: user has the skill AND demand is high (count >= threshold, e.g., 3+)
   - **gap**: user does NOT have the skill AND demand is high
   - **low-demand**: user has the skill but demand is low

4. Return array: `[{skill, demand, proficiency, category}]` where:
   - `skill`: normalized skill name
   - `demand`: count from keyword frequencies (0 if not in market data)
   - `proficiency`: user's proficiency level ("Beginner"/"Intermediate"/"Advanced") or null if user lacks it
   - `category`: "strength" | "gap" | "low-demand"

5. Export the function.

Commit with message: "WI-008: Implement skill gap analysis comparing market demand to user skills"
```

#### WI-009: Skill Gap Heatmap (frontend agent)

```
You are building the skill gap heatmap for "Job Lens". Work on the `track-a` branch.

Read `src/analysis/skillGap.js` (just implemented) and `src/App.jsx`.

1. Create `src/components/SkillGapHeatmap.jsx`:
   - Receives skill gap data as a prop: `[{skill, demand, proficiency, category}, ...]`
   - Renders a Recharts heatmap-style visualization:
     - Use a ScatterChart with demand on X-axis and proficiency on Y-axis
     - Map proficiency levels to numeric values: Beginner=1, Intermediate=2, Advanced=3, null=0
     - Color-code by category: green for strengths, red for gaps, gray for low-demand
     - Label each point with the skill name
   - Alternative: if ScatterChart doesn't work well as a heatmap, use a custom grid with colored cells (divs with Recharts-inspired styling)

2. Wire into `src/App.jsx`:
   - Import `fetchSkills` from the API client
   - Import `analyzeSkillGaps` from analysis module
   - Fetch skills on mount (alongside jobs which should already be fetched)
   - Compute skill gaps from keyword frequencies + skills data
   - Replace the "Skill Gap Heatmap" placeholder with the actual component

Commit with message: "WI-009: Add skill gap heatmap visualization"
```

---

### Terminal 2 — Track B: Salary + Location

#### WI-010: Salary Parsing & Statistics (analysis agent)

```
You are implementing salary analysis for "Job Lens". Work on the `track-b` branch.

All salaries are in EUR. Implement in `src/analysis/salary.js`:

1. `parseSalary(salaryString)` — takes a raw salary string from the spreadsheet, returns `{min, max}` or `null` if unparseable.
   Handle these formats:
   - Ranges: "€80k-€100k", "80000-100000", "80k-100k", "€80,000-€100,000"
   - Single values: "€90k", "90000", "€90,000", "90k"
   - "k" suffix means multiply by 1000
   - Strip currency symbols (€), commas, whitespace
   - For single values: min and max are the same
   - Return `null` for: blank, "Competitive", "Negotiable", or any unrecognizable format
   - Do NOT crash on unexpected input

2. `analyzeSalaries(jobs)` — takes the jobs array:
   - Parse each job's `Salary` field using `parseSalary()`
   - Filter out nulls (unparseable)
   - Calculate statistics across parseable listings:
     - `min`: lowest minimum salary
     - `max`: highest maximum salary
     - `average`: mean of all midpoints ((min+max)/2)
     - `median`: median of all midpoints
     - `count`: number of parseable listings
     - `total`: total number of listings (for "X of Y have salary data")
   - Return `{min, max, average, median, count, total, parsed}` where `parsed` is the array of `{min, max, title, company}` for each parseable listing

3. Export both functions.

IMPORTANT: `parseSalary()` will be reused by the jobs table filter (Track C). Keep it a clean, standalone export.

Commit with message: "WI-010: Implement EUR salary parser and salary statistics"
```

#### WI-011: Salary Chart (frontend agent)

```
You are building the salary chart for "Job Lens". Work on the `track-b` branch.

Read `src/analysis/salary.js` (just implemented) and `src/App.jsx`.

1. Create `src/components/SalaryChart.jsx`:
   - Receives salary analysis data as a prop (output of `analyzeSalaries()`)
   - Show salary distribution chart using Recharts:
     - Use a BarChart or ComposedChart showing salary ranges of individual listings
     - Display min/max/average/median as reference lines or annotations
     - Label axes: X = "Salary (EUR)", Y = count or listing
   - Display summary stats: "X of Y listings have salary data | Min: €X | Max: €X | Avg: €X | Median: €X"

2. Wire into `src/App.jsx`:
   - Import `analyzeSalaries` from analysis module
   - Compute salary stats from fetched jobs data
   - Replace the "Salary Overview" placeholder with the actual component

Commit with message: "WI-011: Add salary distribution chart with EUR statistics"
```

#### WI-012: Location Analysis Logic (analysis agent)

```
You are implementing location analysis for "Job Lens". Work on the `track-b` branch.

Implement in `src/analysis/location.js`:

1. `analyzeLocations(jobs)` — takes the jobs array, returns:

   a. Remote status breakdown:
      - Read each job's `Remote Status` column (this is a dedicated column, NOT parsed from location text)
      - Group by value: "Remote", "Hybrid", "On-site"
      - Handle case-insensitive matching and minor variations ("On-Site", "Onsite", "On site" → "On-site")
      - Return: `[{status: "Remote", count: 15}, {status: "Hybrid", count: 8}, {status: "On-site", count: 7}]`

   b. Location grouping:
      - Read each job's `Location` column
      - Group by city/region name
      - Basic normalization: trim whitespace, title case
      - Simple alias map for common variations: "NYC"/"New York City" → "New York", "SF"/"San Fran" → "San Francisco"
      - Return: `[{location: "New York", count: 5}, {location: "Berlin", count: 4}, ...]` sorted by count descending

2. Return object: `{remoteBreakdown, locationGroups}`

3. Export the function.

Commit with message: "WI-012: Implement remote status categorization and location grouping"
```

#### WI-013: Location Charts (frontend agent)

```
You are building the location visualization for "Job Lens". Work on the `track-b` branch.

Read `src/analysis/location.js` (just implemented) and `src/App.jsx`.

1. Create `src/components/LocationBreakdown.jsx`:
   - Receives location analysis data as a prop (`{remoteBreakdown, locationGroups}`)
   - Two sub-charts:
     a. Remote status: PieChart or donut chart showing Remote/Hybrid/On-site proportions
     b. Location groups: horizontal BarChart showing top cities/regions by count
   - Use Recharts for both

2. Wire into `src/App.jsx`:
   - Import `analyzeLocations` from analysis module
   - Compute location data from fetched jobs
   - Replace the "Location & Remote Breakdown" placeholder with the actual component

Commit with message: "WI-013: Add remote status pie chart and location bar chart"
```

---

### Terminal 3 — Track C: Jobs Table

#### WI-014: Jobs Table (frontend agent)

```
You are building the jobs table for "Job Lens". Work on the `track-c` branch.

Read `src/App.jsx`.

1. Create `src/components/JobsTable.jsx`:
   - Receives jobs array as a prop (from `/api/jobs`)
   - Renders an HTML table with columns:
     - Title (linked to the URL if present)
     - Company
     - Salary (raw string as-is)
     - Keywords (comma-separated)
     - Location
     - Remote Status
   - Basic table styling: borders, alternating row colors, header styling
   - If no jobs data, show "No listings found"

2. Wire into `src/App.jsx`:
   - Replace the "Jobs Table" placeholder with `<JobsTable>`, passing the fetched jobs data

Commit with message: "WI-014: Add jobs table displaying all listings"
```

#### WI-015: Jobs Table Filters (frontend agent)

```
You are adding filters to the jobs table for "Job Lens". Work on the `track-c` branch.

IMPORTANT: This work item depends on WI-010 from Track B. Before starting, cherry-pick the WI-010 commit:
```bash
git log track-b --oneline  # find the WI-010 commit hash
git cherry-pick <hash>     # brings salary.js into track-c
```

Read `src/components/JobsTable.jsx` (just created) and `src/analysis/salary.js` (cherry-picked from track-b).

Add three filters above the jobs table:

1. **Keyword filter**: dropdown or multi-select showing all unique keywords found across listings. When keyword(s) selected, show only listings containing those keywords. Extract unique keywords from the jobs data.

2. **Text search**: text input that filters rows where ANY field contains the search string (case-insensitive). Debounce or filter on each keystroke.

3. **Salary range filter**: two number inputs (min/max EUR). Import `parseSalary()` from `src/analysis/salary.js`. Parse each listing's salary, filter to show only listings whose parsed salary range overlaps with the user's filter range. Listings with unparseable salary are hidden when a salary filter is active.

All filters should work together (AND logic — a listing must match ALL active filters).

Commit with message: "WI-015: Add keyword, text search, and salary range filters to jobs table"
```

---

### Phase 2 Merge

After all three tracks complete:

```
All three tracks are done. Merge them into main:

```bash
git checkout main
git merge track-a
git merge track-b
git merge track-c
```

If there are merge conflicts in `src/App.jsx` (expected — all three tracks added imports and components):
- Keep ALL imports from all three tracks
- Keep ALL component wiring from all three tracks
- The result should have all 5 panels rendering with their real components

After merging, verify:
1. `npm run dev` starts without errors
2. All 5 panels render with data from the spreadsheet
3. Filters in the jobs table work
```

---

## Phase 3: LLM Integration & Polish (Sequential on `main`)

### Step 1 — WI-016: Claude API Setup (backend agent)

```
You are setting up Claude API integration for "Job Lens". Work on the `main` branch.

1. Install `@anthropic-ai/sdk` as a dependency

2. Add `ANTHROPIC_API_KEY` to `.env.example`

3. Implement in `server/llm.js`:
   - Import and initialize the Anthropic client
   - Read API key from `process.env.ANTHROPIC_API_KEY`
   - Export an `isLlmAvailable()` function that returns true/false based on whether the key is configured
   - Export a `createClient()` function that returns the initialized Anthropic client
   - If API key is missing: `isLlmAvailable()` returns false, no errors thrown

4. In `server/index.js`:
   - Import `isLlmAvailable` from llm.js
   - Add `GET /api/llm-status` endpoint that returns `{available: true/false}`
   - Log on startup whether LLM features are available

5. Verify: start server without API key → no errors, `/api/llm-status` returns `{available: false}`. Start with key → returns `{available: true}`.

Commit with message: "WI-016: Set up Claude API client with graceful degradation"
```

---

### Step 2 — WI-017: Description Analysis & Caching (backend agent)

```
You are implementing LLM-powered job description analysis for "Job Lens". Work on the `main` branch.

Read `server/llm.js` (API client setup) and `server/index.js`.

1. In `server/llm.js`, implement:
   - `analyzeDescription(client, description)` — sends a job description to Claude and returns structured analysis:
     ```json
     {
       "extractedSkills": ["react", "node.js", "aws"],
       "seniorityLevel": "Mid-Senior",
       "hardSkills": ["react", "aws"],
       "softSkills": ["leadership", "communication"],
       "roleCategory": "Frontend Engineer"
     }
     ```
   - Use the Claude Messages API with a clear system prompt that asks for this structured JSON output
   - Use `claude-sonnet-4-5-20250929` model for cost efficiency

2. Implement caching in `server/llm.js`:
   - `loadCache()` — reads `.llm-cache.json` from project root (create empty `{}` if doesn't exist)
   - `saveCache(cache)` — writes cache to `.llm-cache.json`
   - Cache key: SHA-256 hash of the description text
   - `getCachedOrAnalyze(client, description)` — checks cache first, calls API only if miss, saves to cache
   - Ensure `.llm-cache.json` is in `.gitignore`

3. In `server/index.js`, add:
   - `POST /api/analyze` — accepts `{descriptions: [{id, text}, ...]}`, returns `{results: [{id, analysis}, ...]}`
   - Process descriptions in sequence (not parallel, to respect rate limits)
   - Use cached results where available
   - If LLM is not available, return 503 with `{error: "LLM not configured"}`

Commit with message: "WI-017: Implement Claude description analysis with file-based caching"
```

---

### Step 3 — WI-018: LLM Insights Display (frontend agent)

```
You are building the LLM insights panel for "Job Lens". Work on the `main` branch.

Read `src/api/client.js`, `src/App.jsx`, and the existing components.

1. In `src/api/client.js`, add:
   - `checkLlmStatus()` — fetches `GET /api/llm-status`, returns `{available: boolean}`
   - `analyzeDescriptions(descriptions)` — posts to `POST /api/analyze`, returns results

2. Create `src/components/LlmInsights.jsx`:
   - Receives LLM analysis results as a prop
   - Displays aggregated insights:
     a. **Top extracted skills** across all analyzed descriptions (frequency count, similar to keyword chart)
     b. **Role categories** found (grouped count)
     c. **Seniority distribution** (count of each level)
     d. **Hard vs soft skills** breakdown
   - Use simple lists/tables or small Recharts charts

3. Wire into `src/App.jsx`:
   - On mount, check LLM status
   - If available, trigger analysis for all job descriptions
   - Show loading state during analysis ("Analyzing X descriptions...")
   - Add LLM insights panel to the dashboard (new section, below or alongside existing panels)
   - If LLM is not available, show a subtle message: "LLM insights unavailable — add ANTHROPIC_API_KEY to enable"

4. Integrate LLM-extracted skills into existing views:
   - In `KeywordChart.jsx`: optionally show LLM-extracted skills as a secondary data source (different color or separate section)
   - In `SkillGapHeatmap.jsx`: include LLM-extracted skills in the gap analysis

Commit with message: "WI-018: Add LLM insights panel and integrate extracted skills into existing views"
```

---

### Step 4 — WI-019: Dashboard Polish (frontend agent)

```
You are polishing the Job Lens dashboard for final delivery. Work on the `main` branch.

Read `src/App.jsx` and all components in `src/components/`.

1. **Layout**: Arrange all panels in a coherent dashboard grid:
   - Top row: Keyword Chart + Skill Gap Heatmap (side by side)
   - Middle row: Salary Chart + Location Breakdown (side by side)
   - Full width: Jobs Table with filters
   - Below or in a collapsible section: LLM Insights (if available)
   - Use CSS Grid for the layout

2. **Visual consistency**:
   - Consistent panel styling: same border, padding, heading style across all panels
   - Consistent color palette across all Recharts components
   - Clean typography: system font stack, reasonable sizes

3. **Loading states**:
   - Show skeleton/spinner while data is being fetched
   - Show individual panel loading states (some panels may load faster than others)
   - Handle error states: if API fails, show error message in affected panel, don't break other panels

4. **Navigation**: If all panels don't fit on one screen, add a sticky header with anchor links or tabs to jump between sections

5. **Final verification**:
   - All 5 analysis panels render correctly
   - Jobs table filters work (keyword, text search, salary range)
   - LLM insights show when API key is configured
   - Dashboard works without API key (Phase 2 features only)
   - No console errors

Commit with message: "WI-019: Polish dashboard layout, styling, and loading states"
```

---

## Quick Reference

| Phase | Step | Branch | Agent | Work Item | Prompt Section |
|---|---|---|---|---|---|
| 1 | 1 | main | scaffold | WI-001 | Step 1 |
| 1 | 2 | main | frontend | WI-002 | Step 2 |
| 1 | 3 | main | backend | WI-003 | Step 3 |
| 1 | 4 | main | backend | WI-004 | Step 4 |
| 1 | 5 | main | frontend | WI-005 | Step 5 |
| 2 | — | track-a | analysis | WI-006 | Terminal 1 |
| 2 | — | track-a | frontend | WI-007 | Terminal 1 |
| 2 | — | track-a | analysis | WI-008 | Terminal 1 |
| 2 | — | track-a | frontend | WI-009 | Terminal 1 |
| 2 | — | track-b | analysis | WI-010 | Terminal 2 |
| 2 | — | track-b | frontend | WI-011 | Terminal 2 |
| 2 | — | track-b | analysis | WI-012 | Terminal 2 |
| 2 | — | track-b | frontend | WI-013 | Terminal 2 |
| 2 | — | track-c | frontend | WI-014 | Terminal 3 |
| 2 | — | track-c | frontend | WI-015 | Terminal 3 |
| 2 | merge | main | human | — | Phase 2 Merge |
| 3 | 1 | main | backend | WI-016 | Step 1 |
| 3 | 2 | main | backend | WI-017 | Step 2 |
| 3 | 3 | main | frontend | WI-018 | Step 3 |
| 3 | 4 | main | frontend | WI-019 | Step 4 |
