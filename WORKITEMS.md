# Job Lens v1 — Work Items

> Generated: 2026-02-17
> Purpose: Assignable units of work for autonomous AI agents
>
> **This file is an orchestration layer, not a source of truth.**
> For full details, read the referenced OpenSpec artifacts.

---

## How to Read This File

Each work item tells an agent:
- **What** to build → follow the spec file link
- **How** it connects → follow the design doc for architecture and interfaces
- **What files** to create or modify
- **What must be done first** → check dependencies

For requirements, scenarios, and acceptance criteria: read the spec.
For interface contracts and function signatures: read `design.md` Sections "Architecture" and "Project structure".
For the full task checklist: read `tasks.md`.

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

### WI-001: Project Scaffold

| Field | Value |
|---|---|
| **Requirements** | REQ-001 to REQ-005 → `specs/project-structure/spec.md` |
| **Architecture** | `design.md` → "Project structure", "Concurrent dev server setup" |
| **Phase** | 1 | **Agent** | scaffold |
| **Priority** | P0 (enabler — blocks everything) |
| **Dependencies** | none |
| **Blocks** | WI-002, WI-003, WI-005, WI-016 |
| **Tasks** | `tasks.md` → 1.1 through 1.8, 1.10 |

**Statement:** Initialize Vite + React project with all dependencies, folder structure, .gitignore, Vite proxy, and concurrent dev server setup.

**Files:**
- `package.json` (create)
- `vite.config.js` (create)
- `.gitignore` (create)
- `server/index.js`, `server/sheets.js`, `server/llm.js` (create — placeholders)
- `src/api/client.js` (create — placeholder)
- `src/analysis/keywords.js`, `skillGap.js`, `salary.js`, `location.js` (create — placeholders)

---

### WI-002: App Shell

| Field | Value |
|---|---|
| **Requirements** | REQ-006, REQ-007 → `specs/app-shell/spec.md` |
| **Phase** | 1 | **Agent** | frontend |
| **Priority** | P0 |
| **Dependencies** | WI-001 |
| **Blocks** | WI-007, WI-009, WI-011, WI-013, WI-014 |
| **Tasks** | `tasks.md` → 1.9 |

**Statement:** Replace Vite's default App.jsx with "Job Lens" dashboard shell with labeled placeholder panels.

**Files:**
- `src/App.jsx` (modify)

---

### WI-003: Sheets OAuth & Configuration

| Field | Value |
|---|---|
| **Requirements** | REQ-008, REQ-011 → `specs/sheets-connection/spec.md` |
| **Architecture** | `design.md` → "Express backend as API proxy" |
| **Phase** | 1 | **Agent** | backend |
| **Priority** | P0 |
| **Dependencies** | WI-001 |
| **Blocks** | WI-004 |
| **Tasks** | `tasks.md` → 2.1, 2.2, 2.5, 2.6 |

**Statement:** Implement Google Sheets OAuth 2.0 authentication and spreadsheet configuration via environment variables.

**Human decision required:** User must provide spreadsheet URL, tab names, and `credentials.json`.

**Files:**
- `server/sheets.js` (implement)
- `.env.example` (create)
- `.gitignore` (add `.env`)

---

### WI-004: Sheets Data Endpoints

| Field | Value |
|---|---|
| **Requirements** | REQ-009, REQ-010 → `specs/sheets-connection/spec.md` |
| **Architecture** | `design.md` → "Architecture" diagram, API routes |
| **Phase** | 1 | **Agent** | backend |
| **Priority** | P0 |
| **Dependencies** | WI-003 |
| **Blocks** | WI-005 |
| **Tasks** | `tasks.md` → 2.3, 2.4, 2.8 |

**Statement:** Implement `GET /api/jobs` and `GET /api/skills` Express endpoints.

**Files:**
- `server/index.js` (add routes)
- `server/sheets.js` (add data reading functions)

---

### WI-005: Frontend API Client

| Field | Value |
|---|---|
| **Requirements** | Supports REQ-009, REQ-010 |
| **Architecture** | `design.md` → "Project structure" (`src/api/client.js`) |
| **Phase** | 1 | **Agent** | frontend |
| **Priority** | P0 |
| **Dependencies** | WI-004 |
| **Blocks** | WI-006, WI-008, WI-010, WI-012, WI-014 |
| **Tasks** | `tasks.md` → 2.7 |

**Statement:** Implement `fetchJobs()` and `fetchSkills()` in `src/api/client.js`.

**Files:**
- `src/api/client.js` (implement)

---

## Phase 2: Core Analysis & Filtering

### WI-006: Keyword Extraction Logic

| Field | Value |
|---|---|
| **Requirements** | REQ-012, REQ-013, REQ-014 → `specs/keyword-analysis/spec.md` |
| **Architecture** | `design.md` → "Flat analysis module structure" |
| **Phase** | 2 | **Track** | A | **Agent** | analysis |
| **Priority** | P1 (high value) |
| **Dependencies** | WI-005 |
| **Blocks** | WI-007, WI-008 |
| **Tasks** | `tasks.md` → 3.1, 3.2, 3.3 |

**Statement:** Implement `getKeywordFrequencies()` and `normalizeKeyword()` in `src/analysis/keywords.js`.

**Files:**
- `src/analysis/keywords.js` (implement)

---

### WI-007: Keyword Frequency Chart

| Field | Value |
|---|---|
| **Requirements** | REQ-015 → `specs/keyword-analysis/spec.md` |
| **Phase** | 2 | **Track** | A | **Agent** | frontend |
| **Priority** | P1 |
| **Dependencies** | WI-006 |
| **Blocks** | WI-019 |
| **Tasks** | `tasks.md` → 3.4, 3.5 |

**Statement:** Build `KeywordChart.jsx` (Recharts horizontal bar chart) and wire into `App.jsx`.

**Files:**
- `src/components/KeywordChart.jsx` (create)
- `src/App.jsx` (wire up)

---

### WI-008: Skill Gap Analysis Logic

| Field | Value |
|---|---|
| **Requirements** | REQ-016, REQ-018 → `specs/skill-gap-analysis/spec.md` |
| **Phase** | 2 | **Track** | A | **Agent** | analysis |
| **Priority** | P1 (highest user value) |
| **Dependencies** | WI-006 |
| **Blocks** | WI-009 |
| **Tasks** | `tasks.md` → 4.1, 4.2, 4.3 |

**Statement:** Implement `analyzeSkillGaps()` in `src/analysis/skillGap.js`. Needs both keyword frequencies (WI-006) and skills data (via `fetchSkills()`).

**Files:**
- `src/analysis/skillGap.js` (implement)

---

### WI-009: Skill Gap Heatmap

| Field | Value |
|---|---|
| **Requirements** | REQ-017 → `specs/skill-gap-analysis/spec.md` |
| **Phase** | 2 | **Track** | A | **Agent** | frontend |
| **Priority** | P1 |
| **Dependencies** | WI-008 |
| **Blocks** | WI-019 |
| **Tasks** | `tasks.md` → 4.4, 4.5 |

**Statement:** Build `SkillGapHeatmap.jsx` (2D heatmap, demand vs proficiency, color-coded) and wire into `App.jsx`.

**Files:**
- `src/components/SkillGapHeatmap.jsx` (create)
- `src/App.jsx` (wire up)

---

### WI-010: Salary Parsing & Statistics

| Field | Value |
|---|---|
| **Requirements** | REQ-019, REQ-020 → `specs/salary-analysis/spec.md` |
| **Phase** | 2 | **Track** | B | **Agent** | analysis |
| **Priority** | P2 |
| **Dependencies** | WI-005 |
| **Blocks** | WI-011, WI-015 |
| **Tasks** | `tasks.md` → 5.1, 5.2, 5.3 |

**Statement:** Implement `parseSalary()` and `analyzeSalaries()` in `src/analysis/salary.js`. All values EUR.

**Cross-track note:** `parseSalary()` is reused by WI-015 (jobs table salary filter on Track C).

**Files:**
- `src/analysis/salary.js` (implement)

---

### WI-011: Salary Chart

| Field | Value |
|---|---|
| **Requirements** | REQ-021 → `specs/salary-analysis/spec.md` |
| **Phase** | 2 | **Track** | B | **Agent** | frontend |
| **Priority** | P2 |
| **Dependencies** | WI-010 |
| **Blocks** | WI-019 |
| **Tasks** | `tasks.md` → 5.4, 5.5 |

**Statement:** Build `SalaryChart.jsx` (salary distribution with min/max/avg in EUR) and wire into `App.jsx`.

**Files:**
- `src/components/SalaryChart.jsx` (create)
- `src/App.jsx` (wire up)

---

### WI-012: Location Analysis Logic

| Field | Value |
|---|---|
| **Requirements** | REQ-022, REQ-023 → `specs/location-analysis/spec.md` |
| **Phase** | 2 | **Track** | B | **Agent** | analysis |
| **Priority** | P2 |
| **Dependencies** | WI-005 |
| **Blocks** | WI-013 |
| **Tasks** | `tasks.md` → 6.1, 6.2 |

**Statement:** Implement `analyzeLocations()` in `src/analysis/location.js`. Remote status from dedicated column, location grouping with basic normalization.

**Files:**
- `src/analysis/location.js` (implement)

---

### WI-013: Location Charts

| Field | Value |
|---|---|
| **Requirements** | REQ-024 → `specs/location-analysis/spec.md` |
| **Phase** | 2 | **Track** | B | **Agent** | frontend |
| **Priority** | P2 |
| **Dependencies** | WI-012 |
| **Blocks** | WI-019 |
| **Tasks** | `tasks.md` → 6.3, 6.4 |

**Statement:** Build `LocationBreakdown.jsx` (remote breakdown chart + city grouping chart) and wire into `App.jsx`.

**Files:**
- `src/components/LocationBreakdown.jsx` (create)
- `src/App.jsx` (wire up)

---

### WI-014: Jobs Table

| Field | Value |
|---|---|
| **Requirements** | REQ-025 → `specs/jobs-table/spec.md` |
| **Phase** | 2 | **Track** | C | **Agent** | frontend |
| **Priority** | P2 |
| **Dependencies** | WI-005 |
| **Blocks** | WI-015 |
| **Tasks** | `tasks.md` → 7.1, 7.5 |

**Statement:** Build `JobsTable.jsx` (all listings, columns: Job Title linked to URL, Company, Salary, Keywords, Location, Remote Status, Industry, Company Size, Priority, Lead Source) and wire into `App.jsx`.

**Files:**
- `src/components/JobsTable.jsx` (create)
- `src/App.jsx` (wire up)

---

### WI-015: Jobs Table Filters

| Field | Value |
|---|---|
| **Requirements** | REQ-026, REQ-027, REQ-028 → `specs/jobs-table/spec.md` |
| **Phase** | 2 | **Track** | C | **Agent** | frontend |
| **Priority** | P2 |
| **Dependencies** | WI-014, WI-010 |
| **Blocks** | WI-019 |
| **Tasks** | `tasks.md` → 7.2, 7.3, 7.4 |

**Statement:** Add keyword filtering, text search, and salary range filtering to JobsTable.

**Cross-track dependency:** Uses `parseSalary()` from WI-010 (Track B) and keyword list from WI-006 (Track A).

**Files:**
- `src/components/JobsTable.jsx` (modify)

---

## Phase 3: LLM Integration & Polish

### WI-016: Claude API Setup

| Field | Value |
|---|---|
| **Requirements** | REQ-029 → `specs/llm-analysis/spec.md` |
| **Architecture** | `design.md` → "LLM caching strategy" |
| **Phase** | 3 | **Agent** | backend |
| **Priority** | P3 |
| **Dependencies** | WI-001 |
| **Blocks** | WI-017 |
| **Tasks** | `tasks.md` → 8.1, 8.2, 8.6 |

**Statement:** Install `@anthropic-ai/sdk`, configure API key, implement client in `server/llm.js`. Graceful degradation when key is missing.

**Human decision required:** User must provide Anthropic API key.

**Files:**
- `package.json` (add dependency)
- `server/llm.js` (implement client)
- `.env.example` (add `ANTHROPIC_API_KEY`)

---

### WI-017: Description Analysis & Caching

| Field | Value |
|---|---|
| **Requirements** | REQ-030, REQ-031 → `specs/llm-analysis/spec.md` |
| **Architecture** | `design.md` → "LLM caching strategy" |
| **Phase** | 3 | **Agent** | backend |
| **Priority** | P3 |
| **Dependencies** | WI-016 |
| **Blocks** | WI-018 |
| **Tasks** | `tasks.md` → 8.3, 8.4, 8.5, 9.1 |

**Statement:** Implement `POST /api/analyze` endpoint with Claude API calls and `.llm-cache.json` caching.

**Human decision required:** LLM prompt design must be reviewed/approved.

**Files:**
- `server/llm.js` (implement analysis + caching)
- `server/index.js` (add route)
- `.gitignore` (add `.llm-cache.json`)

---

### WI-018: LLM Insights Display

| Field | Value |
|---|---|
| **Requirements** | REQ-032 → `specs/llm-analysis/spec.md` |
| **Phase** | 3 | **Agent** | frontend |
| **Priority** | P3 |
| **Dependencies** | WI-017 |
| **Blocks** | WI-019 |
| **Tasks** | `tasks.md` → 9.2, 9.3, 9.4 |

**Statement:** Build LLM insights panel, add `analyzeDescriptions()` to API client, integrate LLM-extracted skills into keyword and skill gap views.

**Files:**
- `src/api/client.js` (add `analyzeDescriptions()`)
- `src/components/LlmInsights.jsx` (create)
- `src/components/KeywordChart.jsx` (modify)
- `src/components/SkillGapHeatmap.jsx` (modify)
- `src/App.jsx` (wire up)

---

### WI-019: Dashboard Polish

| Field | Value |
|---|---|
| **Requirements** | No specific REQ — quality/UX |
| **Phase** | 3 | **Agent** | frontend |
| **Priority** | P3 |
| **Dependencies** | WI-007, WI-009, WI-011, WI-013, WI-015, WI-018 |
| **Blocks** | none (final) |
| **Tasks** | `tasks.md` → 10.1, 10.2, 10.3, 10.4, 10.5 |

**Statement:** Final dashboard layout, navigation, visual consistency, loading states.

**Files:**
- `src/App.jsx` (layout overhaul)
- `src/App.css` or `src/index.css` (styling)
- All component files (minor adjustments)

---

## Agent Assignment Summary

| Agent | Work Items | Scope |
|---|---|---|
| **scaffold** | WI-001 | Project init, tooling, config |
| **backend** | WI-003, WI-004, WI-016, WI-017 | Express, Sheets API, Claude API, caching |
| **analysis** | WI-006, WI-008, WI-010, WI-012 | Pure JS data transforms in `src/analysis/` |
| **frontend** | WI-002, WI-005, WI-007, WI-009, WI-011, WI-013, WI-014, WI-015, WI-018, WI-019 | React components, API client, dashboard |
