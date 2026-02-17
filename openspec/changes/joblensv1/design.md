## Context

Job Lens is a greenfield personal project — no existing code. A software developer is job hunting and maintains a Google Spreadsheet with two tabs: job listings (structured fields + full descriptions) and their own skills (categorized and rated by proficiency). The tool needs to read this data live, run analysis, and display results in a local web dashboard.

The developer is comfortable with JavaScript and React. The tool runs locally on a MacBook — no deployment, no multi-user concerns.

## Goals / Non-Goals

**Goals:**
- A local web dashboard that reads live from Google Sheets and displays analysis panels
- Phase 1: Working project with live data connection
- Phase 2: Five analysis views (keywords, skill gap, salary, location, jobs table)
- Phase 3: LLM-powered description analysis via Claude API
- All analysis updates automatically when the spreadsheet changes (on refresh)

**Non-Goals:**
- No cloud deployment or hosting
- No user authentication or multi-tenancy
- No mobile-responsive design (desktop browser only)
- No automated job scraping
- No real-time sync (manual browser refresh is sufficient)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React App (Vite)                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────┐  │  │
│  │  │ Keyword    │ │ Skill Gap  │ │ Salary       │  │  │
│  │  │ Chart      │ │ Heatmap    │ │ Chart        │  │  │
│  │  └────────────┘ └────────────┘ └──────────────┘  │  │
│  │  ┌────────────┐ ┌────────────────────────────┐   │  │
│  │  │ Location   │ │ Jobs Table                 │   │  │
│  │  │ Charts     │ │ (filter + search)          │   │  │
│  │  └────────────┘ └────────────────────────────┘   │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │ fetch('/api/...')              │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│              EXPRESS SERVER (local)                      │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │              API Routes                           │  │
│  │  GET /api/jobs     → job listings from Sheet      │  │
│  │  GET /api/skills   → skills list from Sheet       │  │
│  │  POST /api/analyze → LLM analysis (Phase 3)      │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │           Google Sheets API (googleapis)          │  │
│  │           Claude API (Phase 3)                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
Google Sheets ──▶ Express API ──▶ React Frontend ──▶ Analysis Logic ──▶ Recharts
                  (reads data)    (fetches JSON)     (JS transforms)    (renders)
```

Analysis logic runs **in the browser** — the Express server is only a proxy for Google Sheets API calls (and Claude API in Phase 3). This keeps the analysis code in the React app where it's easy to tie directly to components.

## Decisions

### Vite + React with JavaScript (not TypeScript)
**Choice:** Plain JavaScript with `.jsx` files.
**Rationale:** Developer is comfortable with JS. TypeScript adds friction to a personal tool with no team. Can be migrated later if desired.
**Alternatives considered:** TypeScript (more robust but unnecessary overhead for solo project).

### Express backend as API proxy
**Choice:** A minimal Express server that handles Google Sheets API calls and serves JSON to the React frontend.
**Rationale:** The `googleapis` npm package is a Node.js server-side library — it requires filesystem access for credentials and uses Node HTTP clients that don't run in the browser. A thin proxy layer is the simplest way to bridge this.
**Alternatives considered:** Browser-side Google Sheets REST API with OAuth (possible but more complex token handling and CORS issues). The server-side approach is simpler since we already have a Node.js environment.

### Analysis logic in the frontend, not the backend
**Choice:** The Express server returns raw spreadsheet data as JSON. All analysis (keyword counting, skill gap comparison, salary parsing, location categorization) happens in React/JS in the browser.
**Rationale:** Keeps the server dead simple (just a data proxy). Analysis logic is tightly coupled to visualization — having it in the same codebase as the components makes iteration faster. For a single user with <100 rows, there's no performance concern.
**Alternatives considered:** Server-side analysis (unnecessary complexity, separates logic from its only consumer).

### Recharts for charting
**Choice:** Recharts over Chart.js.
**Rationale:** Developer preference. Recharts is React-native (component-based), fits naturally into JSX, no imperative canvas API needed.
**Alternatives considered:** Chart.js (requires ref-based imperative API, less idiomatic in React).

### Flat analysis module structure
**Choice:** One file per analysis type in `src/analysis/` (`keywords.js`, `skillGap.js`, `salary.js`, `location.js`).
**Rationale:** Each analysis is independent and maps 1:1 to a dashboard panel. Simple to find, simple to work on.
**Alternatives considered:** Single analysis file (would grow unwieldy), class-based modules (over-engineered).

### LLM caching strategy (Phase 3)
**Choice:** Cache Claude API responses locally in a JSON file (e.g., `.llm-cache.json`, git-ignored), keyed by a hash of the job description content. Re-analyze only when a description changes or is new.
**Rationale:** Avoids re-processing the same descriptions on every dashboard refresh. Keeps API costs minimal — once a listing is analyzed, it stays cached until the description changes. A JSON file persists across server restarts, unlike in-memory caching.
**Alternatives considered:** No caching (wasteful and slow), in-memory only (lost on restart), full database (over-engineered for local tool).

### Concurrent dev server setup
**Choice:** Use the `concurrently` npm package to run both Vite and Express with a single `npm run dev` command.
**Rationale:** The developer shouldn't need to manually start two processes in separate terminals. A single command keeps the workflow simple.
**Alternatives considered:** Vite middleware plugin to embed Express (tighter coupling, harder to debug), manual two-terminal setup (poor developer experience).

### Project structure

```
job_hunt_analysis_tool/
├── server/
│   ├── index.js              # Express server entry point
│   ├── sheets.js             # Google Sheets API client
│   └── llm.js                # Claude API client (Phase 3)
├── src/
│   ├── api/
│   │   └── client.js         # Frontend fetch wrapper for /api/* calls
│   ├── analysis/
│   │   ├── keywords.js       # Keyword extraction and frequency
│   │   ├── skillGap.js       # Skill gap comparison
│   │   ├── salary.js         # Salary parsing and stats
│   │   └── location.js       # Location/remote categorization
│   ├── components/
│   │   ├── KeywordChart.jsx
│   │   ├── SkillGapHeatmap.jsx
│   │   ├── SalaryChart.jsx
│   │   ├── LocationBreakdown.jsx
│   │   └── JobsTable.jsx
│   ├── App.jsx
│   └── main.jsx
├── credentials.json           # Google OAuth (git-ignored)
├── token.json                 # OAuth token (git-ignored)
├── .gitignore
├── package.json
└── vite.config.js             # Includes proxy config for /api → Express
```

## Risks / Trade-offs

- **[OAuth credentials on local machine]** → Acceptable for personal tool. `.gitignore` prevents accidental commits. If shared later, credentials handling moves server-side with proper secrets management.
- **[googleapis requires Node 20.19+]** → Developer must have a compatible Node version. Documented in proposal.
- **[Salary parsing is fragile]** → Job listings use inconsistent salary formats ("$80k", "80,000-100,000", "90K/yr", sometimes blank). The parser will handle common patterns but won't cover every edge case. Unparseable values will be excluded with a warning, not crash the tool.
- **[Keyword normalization is imperfect without LLM]** → Phase 2 uses simple string normalization (lowercase, trim, collapse variants like "React"/"ReactJS"/"React.js"). This won't catch semantic equivalents ("ML" vs "Machine Learning"). Phase 3's LLM integration addresses this.
- **[Claude API costs (Phase 3)]** → With caching and <100 listings, costs should be negligible (pennies per analysis run). But worth monitoring.
- **[No testing setup]** → Acceptable for early stages of a personal tool. Can be added later if the project grows.

## Open Questions

- Exact Google Spreadsheet column names and tab names — needed before implementing the sheets connection. User will provide these when Phase 1 implementation begins.
- LLM prompt design for description analysis — deferred to Phase 3 planning.
