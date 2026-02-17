# Job Lens v1 — Technical Roadmap

> Generated: 2026-02-17
> Status: Pre-implementation (all OpenSpec artifacts complete)
> Source of truth: `openspec/changes/joblensv1/`

---

## 1. Requirements Registry

Every requirement is numbered, traced to its spec, and assigned to a phase.

### Phase 1: Foundation

| ID | Requirement | Spec | Acceptance Criteria |
|---|---|---|---|
| REQ-001 | Vite React project initialization | project-structure | `npm run dev` starts Vite and serves React app in browser |
| REQ-002 | Core dependencies installed | project-structure | `recharts`, `googleapis`, `express` importable without error |
| REQ-003 | Source folder structure | project-structure | `src/analysis/`, `src/api/`, `src/components/`, `server/` exist with placeholder files |
| REQ-004 | OAuth credentials excluded from VCS | project-structure | `credentials.json`, `token.json`, `node_modules/`, `.DS_Store` in `.gitignore`; `git status` ignores them |
| REQ-005 | Vite proxy configuration | project-structure | Frontend fetch to `/api/jobs` is proxied to Express server |
| REQ-006 | Dashboard shell layout | app-shell | Browser shows page with "Job Lens" title and labeled placeholder panels |
| REQ-007 | App entry point structure | app-shell | `src/main.jsx` renders `src/App.jsx` into DOM |
| REQ-008 | Google Sheets OAuth authentication | sheets-connection | First run: browser auth flow, stores `token.json`. Subsequent: silent auth |
| REQ-009 | Read job listings tab | sheets-connection | `GET /api/jobs` returns JSON array with title, company, salary, keywords, location, remote status, description, URL |
| REQ-010 | Read skills tab | sheets-connection | `GET /api/skills` returns JSON array with `category`, `skill`, `proficiency` |
| REQ-011 | Spreadsheet configuration | sheets-connection | Server reads spreadsheet ID + tab names from env/config; logs clear error if missing |

### Phase 2: Core Analysis & Filtering

| ID | Requirement | Spec | Acceptance Criteria |
|---|---|---|---|
| REQ-012 | Keyword extraction from structured field | keyword-analysis | Keywords split by comma, trimmed, lowercased from each listing |
| REQ-013 | Keyword normalization | keyword-analysis | Known variants collapsed (React/ReactJS/React.js → "react") |
| REQ-014 | Keyword frequency counting | keyword-analysis | Each unique keyword has an accurate count across all listings, sorted descending |
| REQ-015 | Keyword frequency horizontal bar chart | keyword-analysis | Recharts horizontal bar chart renders with keywords on Y-axis, count on X-axis |
| REQ-016 | Skill gap comparison | skill-gap-analysis | Each market keyword matched/unmatched against user skills; gaps and strengths identified |
| REQ-017 | Skill gap heatmap visualization | skill-gap-analysis | Heatmap renders: green (strength), red (gap), neutral (low demand) |
| REQ-018 | Proficiency levels recognized | skill-gap-analysis | User proficiency (Beginner/Intermediate/Advanced) weights heatmap position |
| REQ-019 | Salary field parsing | salary-analysis | EUR ranges ("€80k-€100k"), singles ("€90,000"), and unparseable values ("Competitive", blank) all handled |
| REQ-020 | Salary statistics | salary-analysis | Min, max, average, median calculated across parseable listings |
| REQ-021 | Salary visualization | salary-analysis | Chart shows salary distribution with min/max/average indicators |
| REQ-022 | Remote status categorization | location-analysis | Each listing categorized as Remote/Hybrid/On-site from dedicated column |
| REQ-023 | Location grouping | location-analysis | Listings grouped by city/region with normalization (NYC = New York) |
| REQ-024 | Location and remote visualization | location-analysis | Two charts: remote status proportion + listings by city/region |
| REQ-025 | Jobs table display | jobs-table | Table renders all listings with columns: title, company, salary, keywords, location, remote, link |
| REQ-026 | Keyword filtering | jobs-table | Filter table to show only listings matching selected keyword(s) |
| REQ-027 | Text search | jobs-table | Search across all visible fields via text input |
| REQ-028 | Salary range filtering | jobs-table | Filter by min/max salary value |

### Phase 3: LLM Integration & Polish

| ID | Requirement | Spec | Acceptance Criteria |
|---|---|---|---|
| REQ-029 | Claude API integration | llm-analysis | Server connects to Claude API via `@anthropic-ai/sdk`; disabled gracefully if key missing |
| REQ-030 | Job description analysis | llm-analysis | Full descriptions sent to Claude; structured response with skills, seniority, classifications, role category |
| REQ-031 | LLM result caching | llm-analysis | Results cached in `.llm-cache.json` keyed by description hash; reused on reload; re-analyzed if content changes |
| REQ-032 | LLM-enhanced insights display | llm-analysis | Dashboard panel shows aggregated LLM insights: extracted skills, role clusters, trend summaries |

**Total: 32 requirements across 3 phases**

---

## 2. Dependency Graph

```
                        REQ-001 Vite init
                        REQ-002 Dependencies
                        REQ-003 Folder structure
                        REQ-004 .gitignore
                        REQ-005 Vite proxy
                        REQ-006 App shell
                        REQ-007 Entry point
                            │
                            │  ALL of Phase 1 Foundation
                            │  must be complete
                            ▼
                    ┌───────────────────┐
                    │   REQ-008 OAuth   │
                    │   REQ-009 /jobs   │
                    │   REQ-010 /skills │
                    │   REQ-011 Config  │
                    └───────┬───────────┘
                            │
              ┌─────────────┼─────────────────────────┐
              │             │                         │
              ▼             ▼                         ▼
    ┌─────────────┐  ┌─────────────┐          ┌─────────────┐
    │  TRACK A    │  │  TRACK B    │          │  TRACK C    │
    │  Keywords   │  │  Salary +   │          │  Jobs Table │
    │  + Skill Gap│  │  Location   │          │             │
    └──────┬──────┘  └─────────────┘          └─────────────┘
           │
           │  REQ-012 → REQ-013 → REQ-014 → REQ-015
           │  (extraction → normalize → count → chart)
           │         │
           │         ▼
           │  REQ-016 → REQ-017, REQ-018
           │  (gap comparison → heatmap + proficiency)
           │  NOTE: REQ-016 also needs REQ-010 (/skills)
           │
           │
     ┌─────┴─────────────────────────────────────────┐
     │         ALL Phase 2 requirements              │
     │         must be complete                      │
     └─────┬─────────────────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │  PHASE 3    │
    │  REQ-029 → REQ-030 → REQ-031 → REQ-032        │
    │  (API setup → analysis → cache → display)      │
    └─────────────┘
```

### Explicit dependency chains

| Requirement | Depends on | Reason |
|---|---|---|
| REQ-005 (proxy) | REQ-001 (Vite init) | Can't configure proxy without Vite project |
| REQ-008 (OAuth) | REQ-003 (folders), REQ-004 (.gitignore) | Server directory must exist; credentials must be git-ignored |
| REQ-009, 010 (endpoints) | REQ-008 (OAuth) | Can't read sheets without authentication |
| REQ-012-015 (keywords) | REQ-009 (/api/jobs) | Need job data to extract keywords from |
| REQ-016-018 (skill gap) | REQ-014 (keyword counts) + REQ-010 (/api/skills) | Compares keyword frequency against user skills |
| REQ-019-021 (salary) | REQ-009 (/api/jobs) | Need job data with salary fields |
| REQ-022-024 (location) | REQ-009 (/api/jobs) | Need job data with location/remote fields |
| REQ-025-028 (jobs table) | REQ-009 (/api/jobs) | Need job data to display and filter |
| REQ-028 (salary filter) | REQ-019 (salary parsing) | Reuses the salary parser logic |
| REQ-029 (Claude API) | REQ-002 (deps), REQ-003 (folders) | Needs `server/llm.js` and SDK installed |
| REQ-030 (description analysis) | REQ-029 (API setup) | Needs working Claude client |
| REQ-031 (caching) | REQ-030 (analysis) | Can't cache what doesn't exist yet |
| REQ-032 (insights display) | REQ-031 (caching) | Displays cached analysis results |

---

## 3. Interface Contracts

### 3.1 Server → Frontend API

#### `GET /api/jobs`

```
Response: 200 OK
Content-Type: application/json

[
  {
    "title": "Senior Frontend Engineer",
    "company": "Acme Corp",
    "salary": "€80k-€100k",
    "keywords": "React, Node.js, AWS",
    "location": "Berlin",
    "remoteStatus": "Hybrid",
    "description": "We are looking for a senior frontend...",
    "url": "https://example.com/job/123"
  }
]

Response: 200 OK (empty sheet)
[]

Response: 500 Internal Server Error (config missing, auth failed)
{ "error": "Missing SPREADSHEET_ID configuration" }
```

#### `GET /api/skills`

```
Response: 200 OK
Content-Type: application/json

[
  {
    "category": "Frontend",
    "skill": "React",
    "proficiency": "Advanced"
  },
  {
    "category": "DevOps",
    "skill": "Docker",
    "proficiency": "Beginner"
  }
]
```

#### `POST /api/analyze` (Phase 3)

```
Request:
Content-Type: application/json

{
  "descriptions": [
    {
      "id": "job-123",
      "text": "We are looking for a senior frontend..."
    }
  ]
}

Response: 200 OK
Content-Type: application/json

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
      "signals": ["IC role", "startup environment", "growth stage"]
    }
  }
]
```

### 3.2 Analysis Module Interfaces

All analysis modules are pure JavaScript functions in `src/analysis/`. They take data from the API client and return structured results for components.

#### `src/analysis/keywords.js`

```js
/**
 * @param {Array<{keywords: string}>} jobs - Job listings from /api/jobs
 * @returns {Array<{keyword: string, count: number}>} - Sorted descending by count
 */
export function getKeywordFrequencies(jobs) {}

/**
 * @param {string} keyword - Raw keyword string
 * @returns {string} - Normalized keyword
 */
export function normalizeKeyword(keyword) {}
```

#### `src/analysis/skillGap.js`

```js
/**
 * @param {Array<{keyword: string, count: number}>} frequencies - From getKeywordFrequencies()
 * @param {Array<{category: string, skill: string, proficiency: string}>} skills - From /api/skills
 * @returns {Array<{
 *   skill: string,
 *   demand: number,
 *   userHas: boolean,
 *   proficiency: string|null,  // null if user doesn't have the skill
 *   category: string|null,
 *   status: 'strength'|'gap'|'low-demand'
 * }>}
 */
export function analyzeSkillGaps(frequencies, skills) {}
```

#### `src/analysis/salary.js`

```js
/**
 * @param {string} salaryString - Raw salary value (e.g., "€80k-€100k")
 * @returns {{min: number, max: number}|null} - null if unparseable
 */
export function parseSalary(salaryString) {}

/**
 * @param {Array<{salary: string}>} jobs - Job listings from /api/jobs
 * @returns {{
 *   min: number,
 *   max: number,
 *   average: number,
 *   median: number,
 *   parsed: Array<{title: string, min: number, max: number}>,
 *   unparseable: number
 * }}
 */
export function analyzeSalaries(jobs) {}
```

#### `src/analysis/location.js`

```js
/**
 * @param {Array<{location: string, remoteStatus: string}>} jobs - Job listings from /api/jobs
 * @returns {{
 *   remoteBreakdown: {remote: number, hybrid: number, onsite: number},
 *   locationGroups: Array<{location: string, count: number}>  // sorted descending
 * }}
 */
export function analyzeLocations(jobs) {}
```

#### `src/api/client.js`

```js
/**
 * @returns {Promise<Array<Object>>} - Job listings from /api/jobs
 */
export async function fetchJobs() {}

/**
 * @returns {Promise<Array<Object>>} - Skills from /api/skills
 */
export async function fetchSkills() {}

/**
 * Phase 3 only
 * @param {Array<{id: string, text: string}>} descriptions
 * @returns {Promise<Array<Object>>} - LLM analysis results
 */
export async function analyzeDescriptions(descriptions) {}
```

### 3.3 Component → Analysis Module Data Flow

```
  Component                  Analysis Module          API Client
  ─────────────────────      ──────────────────       ──────────────
  <KeywordChart />      ←──  getKeywordFrequencies()  ←── fetchJobs()
  <SkillGapHeatmap />   ←──  analyzeSkillGaps()       ←── fetchJobs() + fetchSkills()
  <SalaryChart />       ←──  analyzeSalaries()        ←── fetchJobs()
  <LocationBreakdown /> ←──  analyzeLocations()       ←── fetchJobs()
  <JobsTable />         ←──  (direct data + parseSalary for filtering)  ←── fetchJobs()
```

---

## 4. Parallelization Plan

### Phase 1: Foundation (Sequential)

Phase 1 is inherently sequential — each step depends on the previous.

```
  1.1 Vite init → 1.2 Deps → 1.3 .gitignore → 1.4 Server dir
  → 1.5 API client → 1.6 Analysis placeholders → 1.7 Proxy
  → 1.8 Concurrently → 1.9 App shell → 1.10 Verify
  → 2.1 Google Cloud setup → 2.2 OAuth → 2.3-2.4 Endpoints
  → 2.5 Config → 2.6 Error handling → 2.7 Client functions → 2.8 Verify

  No parallelization possible. Single track.
```

### Phase 2: Core Analysis & Filtering (3 parallel tracks)

Once Phase 1 delivers working `/api/jobs` and `/api/skills`, three tracks can run **simultaneously**:

```
  ┌─────────────────────────────────────────────────────────┐
  │                  PHASE 1 COMPLETE                       │
  │              /api/jobs ✓   /api/skills ✓                │
  └────────┬──────────────┬───────────────┬─────────────────┘
           │              │               │
           ▼              ▼               ▼
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │  TRACK A    │  │  TRACK B    │  │  TRACK C    │
  │             │  │             │  │             │
  │  Keywords   │  │  Salary     │  │  Jobs Table │
  │  REQ-012    │  │  REQ-019    │  │  REQ-025    │
  │  REQ-013    │  │  REQ-020    │  │  REQ-026    │
  │  REQ-014    │  │  REQ-021    │  │  REQ-027    │
  │  REQ-015    │  │             │  │  REQ-028*   │
  │      │      │  │  Location   │  │             │
  │      ▼      │  │  REQ-022    │  │  *REQ-028   │
  │  Skill Gap  │  │  REQ-023    │  │  depends on │
  │  REQ-016    │  │  REQ-024    │  │  REQ-019    │
  │  REQ-017    │  │             │  │  (salary    │
  │  REQ-018    │  │             │  │   parser)   │
  │             │  │             │  │             │
  └─────────────┘  └─────────────┘  └─────────────┘

  Track A: ~5-6 days    Track B: ~4-5 days    Track C: ~4-5 days
```

**Cross-track dependency:** REQ-028 (salary range filtering in jobs table) reuses the salary parser from REQ-019. Track C can build REQ-025, 026, 027 in parallel, but must wait for Track B's REQ-019 before implementing REQ-028.

**Track A is the longest** because skill gap depends on keyword frequency being complete first (serial within the track).

### Phase 3: LLM Integration (Sequential then parallel)

```
  8.1-8.6 Claude API setup (sequential)
       │
       ▼
  ┌─────────────────┬──────────────────┐
  │  9.1-9.4        │  10.1-10.5       │
  │  LLM Insights   │  Dashboard Polish│
  │  (needs API)    │  (independent)   │
  └─────────────────┴──────────────────┘
  These CAN run in parallel
```

---

## 5. Phase Boundaries

### Phase 1 → Phase 2 Gate

**Demo sentence:** "I can open a local dashboard that reads my live Google Spreadsheet and shows my job listings and skills data."

**Must be complete before Phase 2 starts:**
- [ ] REQ-001 through REQ-011 (all 11 requirements)
- [ ] `npm run dev` starts both Vite and Express
- [ ] `GET /api/jobs` returns real data from the spreadsheet
- [ ] `GET /api/skills` returns real data from the spreadsheet
- [ ] App shell renders in browser with "Job Lens" title

**Verification checklist:**
1. Run `npm run dev` — both servers start without error
2. Open browser — "Job Lens" dashboard appears
3. Visit `/api/jobs` — JSON array of job listings returned
4. Visit `/api/skills` — JSON array of skills returned
5. Modify a row in the spreadsheet, refresh — new data appears

**Human decision required before Phase 2:**
- Provide the Google Spreadsheet URL (spreadsheet ID)
- Provide exact tab names for job listings and skills tabs
- Have Google Cloud Console OAuth credentials ready (`credentials.json`)

---

### Phase 2 → Phase 3 Gate

**Demo sentence:** "I can see which skills the market demands most, where my gaps are, what salaries look like, and filter jobs by keyword, salary, or search terms."

**Must be complete before Phase 3 starts:**
- [ ] REQ-012 through REQ-028 (all 17 requirements)
- [ ] Keyword frequency bar chart renders with live data
- [ ] Skill gap heatmap renders with color coding (green/red/neutral)
- [ ] Salary chart shows distribution with min/max/average in EUR
- [ ] Location charts show remote breakdown + city grouping
- [ ] Jobs table displays all listings with working filters (keyword, search, salary range)

**Verification checklist:**
1. Dashboard shows 5 working panels (keywords, skill gap, salary, location, jobs table)
2. Add a new job listing to spreadsheet, refresh — all panels update
3. Add a new skill to skills tab, refresh — skill gap heatmap updates
4. Filter jobs table by keyword — correct results
5. Filter jobs table by salary range — correct results
6. Search jobs table by text — correct results

**No human decisions required** — Phase 3 can start immediately after Phase 2 verification passes.

---

### Phase 3 → Done Gate

**Demo sentence:** "The dashboard now shows AI-powered insights from my job descriptions — extracted skills I missed tagging, role clustering, and market trend summaries — alongside all the structured analysis from Phase 2."

**Must be complete for v1 release:**
- [ ] REQ-029 through REQ-032 (all 4 requirements)
- [ ] Claude API connected and analyzing descriptions
- [ ] Results cached — second load doesn't re-call API
- [ ] LLM insights panel shows aggregated analysis
- [ ] Dashboard layout polished and navigable
- [ ] All panels render correctly together
- [ ] Missing API key disables LLM features without breaking Phase 2

**Verification checklist:**
1. Start dashboard without API key — Phase 2 features work normally, no errors
2. Add API key, refresh — LLM analysis runs on descriptions
3. Refresh again — cached results used (no API calls)
4. Add a new job listing, refresh — only the new listing is analyzed
5. All panels fit in a coherent layout with consistent styling

**Human decision required before Phase 3:**
- Provide Anthropic API key
- Review/approve the LLM prompt design for description analysis (task 9.1)

---

## 6. Risk Assessment & Recommendations

### Requirements to watch

| ID | Risk | Recommendation |
|---|---|---|
| REQ-013 | Keyword normalization is a rabbit hole — how many variants to map? | Start with a small map (10-15 common aliases). Expand based on real data. Don't over-engineer. |
| REQ-019 | Salary parsing is fragile with inconsistent formats | Build a "best effort" parser. Log unparseable values so user can fix their spreadsheet format. |
| REQ-023 | City normalization (NYC vs New York vs NY) is hard to get perfect | Start with exact match + a small alias map. LLM can improve this in Phase 3. |
| REQ-030 | LLM prompt design is underspecified | Defer detailed prompt engineering to Phase 3 task 9.1. Spike with 3-5 real descriptions first. |

### Requirements that need human decision before agents proceed

| Phase | Decision | Blocking |
|---|---|---|
| Phase 1 | Google Spreadsheet URL + tab names | REQ-009, REQ-010, REQ-011 |
| Phase 1 | Google Cloud OAuth credentials file | REQ-008 |
| Phase 3 | Anthropic API key | REQ-029 |
| Phase 3 | LLM prompt approval | REQ-030 |

### Underspecified requirements

| ID | What's missing | Impact |
|---|---|---|
| REQ-017 | Exact heatmap dimensions and color scale thresholds | Low — can be iterated visually |
| REQ-021 | Which chart type for salary (histogram? box plot? range bars?) | Low — pick during implementation |
| REQ-032 | Exact layout of LLM insights panel | Low — Phase 3, design during implementation |

### Cut candidates (low value / high complexity)

None recommended for cutting. All 32 requirements deliver user value and are reasonably scoped. The closest candidate would be REQ-023 (location grouping with normalization) since city name normalization is surprisingly hard — but even a basic version is useful.

---

## 7. Quick Reference

```
TOTAL: 32 requirements, 44 scenarios, 48 tasks

Phase 1: 11 requirements  │  Foundation        │  Week 1
Phase 2: 17 requirements  │  Core Analysis     │  Week 2-3
Phase 3:  4 requirements  │  LLM + Polish      │  Week 3-4

Parallel tracks in Phase 2:
  Track A: Keywords → Skill Gap (serial)
  Track B: Salary + Location (serial)
  Track C: Jobs Table (independent, except REQ-028)

Human decisions needed:
  Before Phase 1 tasks 2.1-2.8: Spreadsheet URL, tab names, OAuth credentials
  Before Phase 3 tasks 8.1-8.6: Anthropic API key
  Before Phase 3 task 9.1: LLM prompt approval
```
