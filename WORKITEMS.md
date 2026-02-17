# Job Lens v1 — Work Items

> Generated: 2026-02-17
> Derived from: `ROADMAP.md`, `openspec/changes/joblensv1/`
> Purpose: Assignable units of work for autonomous AI agents

---

## How to Read This File

Each work item is a self-contained assignment for an agent. It includes:
- **What** to build (requirement + acceptance criteria)
- **Where** it fits (dependencies, phase, track)
- **How** it connects (interface contracts — inputs and outputs)
- **Who** owns it (agent type)
- **When** it's done (verification)

Agents should read their assigned work items AND the interface contracts of their dependencies to understand what data they'll receive.

---

## Work Item Index

| ID | Name | Phase | Track | Agent | Status | Dependencies |
|---|---|---|---|---|---|---|
| WI-001 | Project scaffold | 1 | — | scaffold | pending | none |
| WI-002 | App shell | 1 | — | frontend | pending | WI-001 |
| WI-003 | Sheets OAuth & config | 1 | — | backend | pending | WI-001 |
| WI-004 | Sheets data endpoints | 1 | — | backend | pending | WI-003 |
| WI-005 | Frontend API client | 1 | — | frontend | pending | WI-004 |
| WI-006 | Keyword extraction logic | 2 | A | analysis | pending | WI-005 |
| WI-007 | Keyword frequency chart | 2 | A | frontend | pending | WI-006 |
| WI-008 | Skill gap analysis logic | 2 | A | analysis | pending | WI-006 |
| WI-009 | Skill gap heatmap | 2 | A | frontend | pending | WI-008 |
| WI-010 | Salary parsing & statistics | 2 | B | analysis | pending | WI-005 |
| WI-011 | Salary chart | 2 | B | frontend | pending | WI-010 |
| WI-012 | Location analysis logic | 2 | B | analysis | pending | WI-005 |
| WI-013 | Location charts | 2 | B | frontend | pending | WI-012 |
| WI-014 | Jobs table | 2 | C | frontend | pending | WI-005 |
| WI-015 | Jobs table filters | 2 | C | frontend | pending | WI-014, WI-010 |
| WI-016 | Claude API setup | 3 | — | backend | pending | WI-001 |
| WI-017 | Description analysis & caching | 3 | — | backend | pending | WI-016 |
| WI-018 | LLM insights display | 3 | — | frontend | pending | WI-017 |
| WI-019 | Dashboard polish | 3 | — | frontend | pending | WI-007, WI-009, WI-011, WI-013, WI-015, WI-018 |

---

## Phase 1: Foundation

---

### WI-001: Project Scaffold

| Field | Value |
|---|---|
| **Requirements** | REQ-001, REQ-002, REQ-003, REQ-004, REQ-005 |
| **Phase** | 1 |
| **Track** | — |
| **Agent** | scaffold |
| **Priority** | P0 (enabler — blocks everything) |
| **Dependencies** | none |
| **Blocks** | WI-002, WI-003, WI-005, WI-016 |
| **Tasks** | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.10 |

**Statement:** Initialize the Vite + React project with all dependencies, folder structure, .gitignore, Vite proxy config, and concurrent dev server setup (Vite + Express via `concurrently`).

**Acceptance Criteria:**
- `npm run dev` starts both Vite and Express without error
- `recharts`, `googleapis`, `express`, `concurrently` importable
- `src/analysis/`, `src/api/`, `src/components/`, `server/` exist with placeholder files
- `credentials.json`, `token.json`, `node_modules/`, `.DS_Store` are git-ignored
- Frontend fetch to `/api/jobs` is proxied to Express server port

**Interface Contracts:**
- Output: Working project skeleton that all other work items build on
- `server/index.js` listens on a configured port (e.g., 3001)
- `vite.config.js` proxies `/api/*` → `http://localhost:3001`
- `package.json` scripts: `"dev": "concurrently \"npm run dev:client\" \"npm run dev:server\""`

**Files Touched:**
- `package.json` (create)
- `vite.config.js` (create)
- `.gitignore` (create)
- `server/index.js` (create — placeholder Express server)
- `server/sheets.js` (create — placeholder)
- `server/llm.js` (create — placeholder)
- `src/main.jsx` (modify — Vite template)
- `src/App.jsx` (modify — Vite template)
- `src/api/client.js` (create — placeholder)
- `src/analysis/keywords.js` (create — placeholder)
- `src/analysis/skillGap.js` (create — placeholder)
- `src/analysis/salary.js` (create — placeholder)
- `src/analysis/location.js` (create — placeholder)

---

### WI-002: App Shell

| Field | Value |
|---|---|
| **Requirements** | REQ-006, REQ-007 |
| **Phase** | 1 |
| **Track** | — |
| **Agent** | frontend |
| **Priority** | P0 (enabler) |
| **Dependencies** | WI-001 |
| **Blocks** | WI-007, WI-009, WI-011, WI-013, WI-014 |
| **Tasks** | 1.9 |

**Statement:** Replace Vite's default App.jsx with a "Job Lens" dashboard shell containing labeled placeholder sections for each analysis panel (keyword chart, skill gap heatmap, salary chart, location breakdown, jobs table).

**Acceptance Criteria:**
- Browser shows page with "Job Lens" title
- Five labeled placeholder areas visible for future panels
- `src/main.jsx` renders `src/App.jsx` into the DOM

**Interface Contracts:**
- Output: `<App />` component with placeholder `<div>` sections that future components will replace
- Each placeholder has an `id` or clear location for panel insertion:
  - `keyword-chart-panel`
  - `skill-gap-panel`
  - `salary-chart-panel`
  - `location-panel`
  - `jobs-table-panel`

**Files Touched:**
- `src/App.jsx` (modify)
- `src/main.jsx` (verify — should already work from Vite template)

---

### WI-003: Sheets OAuth & Configuration

| Field | Value |
|---|---|
| **Requirements** | REQ-008, REQ-011 |
| **Phase** | 1 |
| **Track** | — |
| **Agent** | backend |
| **Priority** | P0 (enabler) |
| **Dependencies** | WI-001 |
| **Blocks** | WI-004 |
| **Tasks** | 2.1, 2.2, 2.5, 2.6 |

**Statement:** Implement Google Sheets OAuth 2.0 authentication in `server/sheets.js` with first-run browser auth flow, token persistence, and spreadsheet configuration via environment variables. Handle missing configuration with clear error messages.

**Acceptance Criteria:**
- First run with no `token.json`: opens browser for OAuth consent, stores token
- Subsequent runs with valid `token.json`: authenticates silently
- Server reads `SPREADSHEET_ID`, `JOBS_TAB_NAME`, `SKILLS_TAB_NAME` from environment or `.env` file
- Missing configuration logs: `"Missing SPREADSHEET_ID configuration"` (or equivalent)

**Interface Contracts:**
- Output: Authenticated Google Sheets API client available for use by WI-004
- Export: `getAuthenticatedClient()` → authenticated `google.sheets` instance
- Config: Environment variables or `.env` file:
  ```
  SPREADSHEET_ID=1abc...xyz
  JOBS_TAB_NAME=Job Listings
  SKILLS_TAB_NAME=My Skills
  ```

**Human Decision Required:**
- User must provide Google Spreadsheet URL (to extract spreadsheet ID)
- User must provide exact tab names
- User must create Google Cloud Console project and download `credentials.json`

**Files Touched:**
- `server/sheets.js` (implement)
- `.env.example` (create — template for required env vars)
- `.gitignore` (add `.env`)

---

### WI-004: Sheets Data Endpoints

| Field | Value |
|---|---|
| **Requirements** | REQ-009, REQ-010 |
| **Phase** | 1 |
| **Track** | — |
| **Agent** | backend |
| **Priority** | P0 (enabler) |
| **Dependencies** | WI-003 |
| **Blocks** | WI-005 |
| **Tasks** | 2.3, 2.4, 2.8 |

**Statement:** Implement `GET /api/jobs` and `GET /api/skills` Express endpoints that read from the Google Spreadsheet and return structured JSON.

**Acceptance Criteria:**
- `GET /api/jobs` returns JSON array where each object has: `title`, `company`, `salary`, `keywords`, `location`, `remoteStatus`, `description`, `url`
- `GET /api/skills` returns JSON array where each object has: `category`, `skill`, `proficiency`
- Empty spreadsheet tab returns `[]`
- API errors return `500` with descriptive error message

**Interface Contracts:**
- Input: Authenticated Sheets client from WI-003
- Output — `GET /api/jobs`:
  ```json
  [
    {
      "title": "Senior Frontend Engineer",
      "company": "Acme Corp",
      "salary": "€80k-€100k",
      "keywords": "React, Node.js, AWS",
      "location": "Berlin",
      "remoteStatus": "Hybrid",
      "description": "We are looking for...",
      "url": "https://example.com/job/123"
    }
  ]
  ```
- Output — `GET /api/skills`:
  ```json
  [
    {"category": "Frontend", "skill": "React", "proficiency": "Advanced"},
    {"category": "DevOps", "skill": "Docker", "proficiency": "Beginner"}
  ]
  ```

**Files Touched:**
- `server/index.js` (add routes)
- `server/sheets.js` (add data reading functions)

---

### WI-005: Frontend API Client

| Field | Value |
|---|---|
| **Requirements** | (supports REQ-009, REQ-010) |
| **Phase** | 1 |
| **Track** | — |
| **Agent** | frontend |
| **Priority** | P0 (enabler) |
| **Dependencies** | WI-004 |
| **Blocks** | WI-006, WI-008, WI-010, WI-012, WI-014 |
| **Tasks** | 2.7 |

**Statement:** Implement fetch wrapper functions in `src/api/client.js` that call the backend API endpoints and return parsed JSON.

**Acceptance Criteria:**
- `fetchJobs()` calls `GET /api/jobs` and returns the parsed JSON array
- `fetchSkills()` calls `GET /api/skills` and returns the parsed JSON array
- Errors are caught and re-thrown with descriptive messages

**Interface Contracts:**
- Input: Backend endpoints from WI-004
- Output:
  ```js
  /** @returns {Promise<Array<Object>>} Job listings */
  export async function fetchJobs() {}

  /** @returns {Promise<Array<Object>>} User skills */
  export async function fetchSkills() {}
  ```

**Files Touched:**
- `src/api/client.js` (implement)

---

## Phase 2: Core Analysis & Filtering

---

### WI-006: Keyword Extraction Logic

| Field | Value |
|---|---|
| **Requirements** | REQ-012, REQ-013, REQ-014 |
| **Phase** | 2 |
| **Track** | A |
| **Agent** | analysis |
| **Priority** | P1 (high value) |
| **Dependencies** | WI-005 |
| **Blocks** | WI-007, WI-008 |
| **Tasks** | 3.1, 3.2, 3.3 |

**Statement:** Implement keyword extraction, normalization, and frequency counting in `src/analysis/keywords.js`. Split keywords by comma, normalize variants, count occurrences, sort descending.

**Acceptance Criteria:**
- Keywords split from `"React, Node.js, AWS"` → `["react", "node.js", "aws"]`
- Variants collapsed: `"React"`, `"ReactJS"`, `"React.js"` all count as `"react"`
- Output sorted by frequency descending
- Works with the job data shape from `fetchJobs()`

**Interface Contracts:**
- Input: `Array<{keywords: string}>` from `fetchJobs()`
- Output:
  ```js
  /**
   * @param {Array<{keywords: string}>} jobs
   * @returns {Array<{keyword: string, count: number}>} sorted descending
   */
  export function getKeywordFrequencies(jobs) {}

  /**
   * @param {string} keyword
   * @returns {string} normalized keyword
   */
  export function normalizeKeyword(keyword) {}
  ```

**Files Touched:**
- `src/analysis/keywords.js` (implement)

---

### WI-007: Keyword Frequency Chart

| Field | Value |
|---|---|
| **Requirements** | REQ-015 |
| **Phase** | 2 |
| **Track** | A |
| **Agent** | frontend |
| **Priority** | P1 (high value) |
| **Dependencies** | WI-006 |
| **Blocks** | WI-019 |
| **Tasks** | 3.4, 3.5 |

**Statement:** Build `KeywordChart.jsx` component that renders keyword frequencies as a Recharts horizontal bar chart, and wire it into `App.jsx`.

**Acceptance Criteria:**
- Horizontal bar chart displays keywords on Y-axis, count on X-axis
- Sorted with most common keyword at top
- Renders with live data from the spreadsheet
- Replaces the keyword chart placeholder in the app shell

**Interface Contracts:**
- Input: `getKeywordFrequencies(jobs)` from WI-006 → `Array<{keyword, count}>`
- Output: `<KeywordChart data={frequencies} />` React component

**Files Touched:**
- `src/components/KeywordChart.jsx` (create)
- `src/App.jsx` (wire up component)

---

### WI-008: Skill Gap Analysis Logic

| Field | Value |
|---|---|
| **Requirements** | REQ-016, REQ-018 |
| **Phase** | 2 |
| **Track** | A |
| **Agent** | analysis |
| **Priority** | P1 (highest user value) |
| **Dependencies** | WI-006 (keyword frequencies) |
| **Blocks** | WI-009 |
| **Tasks** | 4.1, 4.2, 4.3 |

**Statement:** Implement skill gap comparison in `src/analysis/skillGap.js`. Match market keyword frequencies against the user's categorized/rated skills. Categorize each as strength, gap, or low-demand.

**Acceptance Criteria:**
- "react" appears 25 times + user has React/Advanced → `{status: "strength"}`
- "docker" appears 20 times + user doesn't have it → `{status: "gap"}`
- "jquery" appears 1 time + user has it → `{status: "low-demand"}`
- Proficiency levels (Beginner/Intermediate/Advanced) correctly included in output

**Interface Contracts:**
- Input:
  - `Array<{keyword, count}>` from `getKeywordFrequencies()` (WI-006)
  - `Array<{category, skill, proficiency}>` from `fetchSkills()` (WI-005)
- Output:
  ```js
  /**
   * @param {Array<{keyword: string, count: number}>} frequencies
   * @param {Array<{category: string, skill: string, proficiency: string}>} skills
   * @returns {Array<{
   *   skill: string,
   *   demand: number,
   *   userHas: boolean,
   *   proficiency: string|null,
   *   category: string|null,
   *   status: 'strength'|'gap'|'low-demand'
   * }>}
   */
  export function analyzeSkillGaps(frequencies, skills) {}
  ```

**Files Touched:**
- `src/analysis/skillGap.js` (implement)

---

### WI-009: Skill Gap Heatmap

| Field | Value |
|---|---|
| **Requirements** | REQ-017 |
| **Phase** | 2 |
| **Track** | A |
| **Agent** | frontend |
| **Priority** | P1 (highest user value) |
| **Dependencies** | WI-008 |
| **Blocks** | WI-019 |
| **Tasks** | 4.4, 4.5 |

**Statement:** Build `SkillGapHeatmap.jsx` component that renders the skill gap analysis as a 2D heatmap (demand vs proficiency) with color coding, and wire it into `App.jsx`.

**Acceptance Criteria:**
- Heatmap renders with market demand on one axis, proficiency on the other
- Green = strength (user has + high demand)
- Red = gap (user lacks + high demand)
- Neutral = low demand
- Different proficiency levels position skills at different Y positions

**Interface Contracts:**
- Input: `analyzeSkillGaps(frequencies, skills)` from WI-008
- Output: `<SkillGapHeatmap data={gaps} />` React component

**Files Touched:**
- `src/components/SkillGapHeatmap.jsx` (create)
- `src/App.jsx` (wire up component)

---

### WI-010: Salary Parsing & Statistics

| Field | Value |
|---|---|
| **Requirements** | REQ-019, REQ-020 |
| **Phase** | 2 |
| **Track** | B |
| **Agent** | analysis |
| **Priority** | P2 (medium-high value) |
| **Dependencies** | WI-005 |
| **Blocks** | WI-011, WI-015 |
| **Tasks** | 5.1, 5.2, 5.3 |

**Statement:** Implement salary parsing and statistics in `src/analysis/salary.js`. Parse EUR salary strings in various formats, handle unparseable values gracefully, calculate aggregate statistics.

**Acceptance Criteria:**
- `parseSalary("€80k-€100k")` → `{min: 80000, max: 100000}`
- `parseSalary("€90,000")` → `{min: 90000, max: 90000}`
- `parseSalary("Competitive")` → `null`
- `parseSalary("")` → `null`
- `analyzeSalaries(jobs)` returns `{min, max, average, median, parsed[], unparseable}`

**Interface Contracts:**
- Input: `Array<{salary: string}>` from `fetchJobs()`
- Output:
  ```js
  /**
   * @param {string} salaryString — raw EUR salary (e.g., "€80k-€100k")
   * @returns {{min: number, max: number}|null}
   */
  export function parseSalary(salaryString) {}

  /**
   * @param {Array<{salary: string, title: string}>} jobs
   * @returns {{
   *   min: number, max: number, average: number, median: number,
   *   parsed: Array<{title: string, min: number, max: number}>,
   *   unparseable: number
   * }}
   */
  export function analyzeSalaries(jobs) {}
  ```
- **Cross-track note:** `parseSalary()` is reused by WI-015 (jobs table salary filter)

**Files Touched:**
- `src/analysis/salary.js` (implement)

---

### WI-011: Salary Chart

| Field | Value |
|---|---|
| **Requirements** | REQ-021 |
| **Phase** | 2 |
| **Track** | B |
| **Agent** | frontend |
| **Priority** | P2 (medium-high value) |
| **Dependencies** | WI-010 |
| **Blocks** | WI-019 |
| **Tasks** | 5.4, 5.5 |

**Statement:** Build `SalaryChart.jsx` component that renders salary distribution with min/max/average indicators in EUR, and wire it into `App.jsx`.

**Acceptance Criteria:**
- Chart displays salary distribution across listings
- Min, max, and average indicators visible
- Values displayed in EUR (€)
- Unparseable listings excluded from chart without error

**Interface Contracts:**
- Input: `analyzeSalaries(jobs)` from WI-010
- Output: `<SalaryChart data={salaryStats} />` React component

**Files Touched:**
- `src/components/SalaryChart.jsx` (create)
- `src/App.jsx` (wire up component)

---

### WI-012: Location Analysis Logic

| Field | Value |
|---|---|
| **Requirements** | REQ-022, REQ-023 |
| **Phase** | 2 |
| **Track** | B |
| **Agent** | analysis |
| **Priority** | P2 (medium value) |
| **Dependencies** | WI-005 |
| **Blocks** | WI-013 |
| **Tasks** | 6.1, 6.2 |

**Statement:** Implement remote status categorization and location grouping in `src/analysis/location.js`. Read remote status from the dedicated spreadsheet column. Group listings by city/region with basic normalization.

**Acceptance Criteria:**
- Remote status read directly from `remoteStatus` field (not parsed from location text)
- Listings counted per category: Remote, Hybrid, On-site
- Location grouping normalizes common variants (e.g., "NYC" and "New York" grouped together)
- Output sorted by count descending

**Interface Contracts:**
- Input: `Array<{location: string, remoteStatus: string}>` from `fetchJobs()`
- Output:
  ```js
  /**
   * @param {Array<{location: string, remoteStatus: string}>} jobs
   * @returns {{
   *   remoteBreakdown: {remote: number, hybrid: number, onsite: number},
   *   locationGroups: Array<{location: string, count: number}>
   * }}
   */
  export function analyzeLocations(jobs) {}
  ```

**Files Touched:**
- `src/analysis/location.js` (implement)

---

### WI-013: Location Charts

| Field | Value |
|---|---|
| **Requirements** | REQ-024 |
| **Phase** | 2 |
| **Track** | B |
| **Agent** | frontend |
| **Priority** | P2 (medium value) |
| **Dependencies** | WI-012 |
| **Blocks** | WI-019 |
| **Tasks** | 6.3, 6.4 |

**Statement:** Build `LocationBreakdown.jsx` component with two charts: remote status proportion (Remote/Hybrid/On-site) and listings grouped by city/region. Wire into `App.jsx`.

**Acceptance Criteria:**
- One chart shows Remote vs Hybrid vs On-site proportions
- One chart shows listings grouped by city/region
- Both render with live data

**Interface Contracts:**
- Input: `analyzeLocations(jobs)` from WI-012
- Output: `<LocationBreakdown data={locationStats} />` React component

**Files Touched:**
- `src/components/LocationBreakdown.jsx` (create)
- `src/App.jsx` (wire up component)

---

### WI-014: Jobs Table

| Field | Value |
|---|---|
| **Requirements** | REQ-025 |
| **Phase** | 2 |
| **Track** | C |
| **Agent** | frontend |
| **Priority** | P2 (medium value) |
| **Dependencies** | WI-005 |
| **Blocks** | WI-015 |
| **Tasks** | 7.1, 7.5 |

**Statement:** Build `JobsTable.jsx` component that renders all job listings in a table with columns: title, company, salary, keywords, location, remote status, and link to original posting. Wire into `App.jsx`.

**Acceptance Criteria:**
- Table displays ALL listings from the spreadsheet
- Columns: title, company, salary, keywords, location, remote status, link
- Link column opens the original posting URL
- Renders with live data

**Interface Contracts:**
- Input: `fetchJobs()` from WI-005 → raw job listing objects
- Output: `<JobsTable jobs={jobs} />` React component
- Component accepts optional filter props (added by WI-015)

**Files Touched:**
- `src/components/JobsTable.jsx` (create)
- `src/App.jsx` (wire up component)

---

### WI-015: Jobs Table Filters

| Field | Value |
|---|---|
| **Requirements** | REQ-026, REQ-027, REQ-028 |
| **Phase** | 2 |
| **Track** | C |
| **Agent** | frontend |
| **Priority** | P2 (medium value) |
| **Dependencies** | WI-014 (table), WI-010 (salary parser) |
| **Blocks** | WI-019 |
| **Tasks** | 7.2, 7.3, 7.4 |

**Statement:** Add keyword filtering, text search, and salary range filtering to the JobsTable component.

**Acceptance Criteria:**
- Keyword filter: select keyword(s) → table shows only matching listings
- Text search: type in search box → table shows listings where any field matches
- Salary filter: set min/max → table shows only listings within range
- Filters can be combined
- Salary filter uses `parseSalary()` from WI-010

**Interface Contracts:**
- Input:
  - Job listings from `fetchJobs()`
  - `parseSalary()` from `src/analysis/salary.js` (WI-010) for salary range filtering
  - `getKeywordFrequencies()` from `src/analysis/keywords.js` (WI-006) for keyword filter options
- Output: Enhanced `<JobsTable />` with filter UI controls

**Cross-Track Dependency:** This work item spans Track C but depends on Track B's `parseSalary()` (WI-010) and Track A's keyword list (WI-006). Schedule accordingly.

**Files Touched:**
- `src/components/JobsTable.jsx` (modify — add filter UI and logic)

---

## Phase 3: LLM Integration & Polish

---

### WI-016: Claude API Setup

| Field | Value |
|---|---|
| **Requirements** | REQ-029 |
| **Phase** | 3 |
| **Track** | — |
| **Agent** | backend |
| **Priority** | P3 (enabler for Phase 3) |
| **Dependencies** | WI-001 (project structure) |
| **Blocks** | WI-017 |
| **Tasks** | 8.1, 8.2, 8.6 |

**Statement:** Install `@anthropic-ai/sdk`, configure API key via environment variable, and implement the Claude API client in `server/llm.js`. Ensure missing API key disables LLM features without breaking Phase 2.

**Acceptance Criteria:**
- `@anthropic-ai/sdk` installed and importable
- `ANTHROPIC_API_KEY` read from environment / `.env`
- When API key is present: Claude client initialized and ready
- When API key is missing: server starts normally, LLM routes return `501 Not Available`

**Interface Contracts:**
- Output: Initialized Anthropic client available for WI-017
- Config: `ANTHROPIC_API_KEY` in `.env`

**Human Decision Required:**
- User must provide Anthropic API key

**Files Touched:**
- `package.json` (add `@anthropic-ai/sdk`)
- `server/llm.js` (implement client setup)
- `.env.example` (add `ANTHROPIC_API_KEY`)

---

### WI-017: Description Analysis & Caching

| Field | Value |
|---|---|
| **Requirements** | REQ-030, REQ-031 |
| **Phase** | 3 |
| **Track** | — |
| **Agent** | backend |
| **Priority** | P3 |
| **Dependencies** | WI-016 |
| **Blocks** | WI-018 |
| **Tasks** | 8.3, 8.4, 8.5, 9.1 |

**Statement:** Implement `POST /api/analyze` endpoint that sends job descriptions to the Claude API, receives structured analysis, and caches results in `.llm-cache.json` keyed by description content hash.

**Acceptance Criteria:**
- `POST /api/analyze` accepts `{descriptions: [{id, text}]}` and returns structured analysis
- Analysis includes: extractedSkills, seniorityLevel, skillClassification (hard/soft), roleCategory
- Results cached in `.llm-cache.json` — second call for same description returns cached result without API call
- Changed description triggers re-analysis
- Cache file is git-ignored

**Interface Contracts:**
- Input: Job descriptions from frontend
- Output — `POST /api/analyze`:
  ```json
  [
    {
      "id": "job-123",
      "cached": false,
      "analysis": {
        "extractedSkills": ["React", "TypeScript", "GraphQL"],
        "seniorityLevel": "Senior",
        "skillClassification": {
          "hard": ["React", "TypeScript", "GraphQL"],
          "soft": ["leadership", "communication"]
        },
        "roleCategory": "Frontend Engineering",
        "signals": ["IC role", "startup environment"]
      }
    }
  ]
  ```

**Human Decision Required:**
- LLM prompt design must be reviewed/approved before production use

**Files Touched:**
- `server/llm.js` (implement analysis + caching)
- `server/index.js` (add `/api/analyze` route)
- `.gitignore` (add `.llm-cache.json`)

---

### WI-018: LLM Insights Display

| Field | Value |
|---|---|
| **Requirements** | REQ-032 |
| **Phase** | 3 |
| **Track** | — |
| **Agent** | frontend |
| **Priority** | P3 |
| **Dependencies** | WI-017 |
| **Blocks** | WI-019 |
| **Tasks** | 9.2, 9.3, 9.4 |

**Statement:** Build frontend function to trigger analysis for all listings, collect results, and display an LLM insights panel with aggregated extracted skills, role clusters, and trend summaries. Integrate LLM-extracted skills into existing keyword and skill gap views.

**Acceptance Criteria:**
- Dashboard triggers analysis for all listings on demand
- Uses cached results when available
- Insights panel shows: aggregated extracted skills, role clusters, trend summaries
- LLM-extracted skills appear as complementary data in keyword and skill gap views

**Interface Contracts:**
- Input: `POST /api/analyze` from WI-017, via `analyzeDescriptions()` from `src/api/client.js`
- Output: LLM insights panel component + enhanced keyword/skill gap views
- `src/api/client.js` addition:
  ```js
  /**
   * @param {Array<{id: string, text: string}>} descriptions
   * @returns {Promise<Array<Object>>} LLM analysis results
   */
  export async function analyzeDescriptions(descriptions) {}
  ```

**Files Touched:**
- `src/api/client.js` (add `analyzeDescriptions()`)
- `src/components/LlmInsights.jsx` (create)
- `src/components/KeywordChart.jsx` (modify — integrate LLM skills)
- `src/components/SkillGapHeatmap.jsx` (modify — integrate LLM skills)
- `src/App.jsx` (wire up LLM panel)

---

### WI-019: Dashboard Polish

| Field | Value |
|---|---|
| **Requirements** | (no specific REQ — quality/UX) |
| **Phase** | 3 |
| **Track** | — |
| **Agent** | frontend |
| **Priority** | P3 (quality of life) |
| **Dependencies** | WI-007, WI-009, WI-011, WI-013, WI-015, WI-018 |
| **Blocks** | none (final work item) |
| **Tasks** | 10.1, 10.2, 10.3, 10.4, 10.5 |

**Statement:** Design and implement the final dashboard layout. Arrange all panels in a coherent grid, add navigation or tabs if needed, apply visual consistency (colors, spacing, typography), and add loading states.

**Acceptance Criteria:**
- All panels arranged in a clean, navigable layout
- Consistent colors, spacing, and typography across all panels
- Loading states shown during data fetching and LLM analysis
- All panels render correctly together with live data
- Filters in jobs table work correctly
- LLM insights display properly

**Interface Contracts:**
- Input: All components from WI-007, WI-009, WI-011, WI-013, WI-014/015, WI-018
- Output: Final polished `<App />` layout

**Files Touched:**
- `src/App.jsx` (major layout overhaul)
- `src/App.css` or `src/index.css` (styling)
- All component files (minor styling adjustments)

---

## Agent Assignment Summary

| Agent Type | Work Items | Description |
|---|---|---|
| **scaffold** | WI-001 | Project initialization, tooling, config |
| **backend** | WI-003, WI-004, WI-016, WI-017 | Express server, Sheets API, Claude API, caching |
| **analysis** | WI-006, WI-008, WI-010, WI-012 | Pure JS data transformation modules |
| **frontend** | WI-002, WI-005, WI-007, WI-009, WI-011, WI-013, WI-014, WI-015, WI-018, WI-019 | React components, API client, dashboard |

```
  AGENT WORKLOAD
  ══════════════════════════════════════════

  scaffold ██ (1 item)
  backend  ████████ (4 items)
  analysis ████████ (4 items)
  frontend ████████████████████ (10 items)
```

Frontend-heavy by design — the backend is intentionally thin (just a proxy), and analysis modules are small pure functions. The frontend agent does the most work because it owns all visualization and wiring.
