# Job Lens v1 — Technical Roadmap

> Generated: 2026-02-17
> Status: Pre-implementation (all OpenSpec artifacts complete)
> Source of truth for requirements: `openspec/changes/joblensv1/specs/`
> Source of truth for architecture: `openspec/changes/joblensv1/design.md`
> Source of truth for task checklist: `openspec/changes/joblensv1/tasks.md`

---

## 1. Requirements Index

Requirements are defined in `openspec/changes/joblensv1/specs/`. This table maps REQ IDs to their spec files — **read the spec for full details and scenarios.**

### Phase 1: Foundation

| ID | Requirement | Spec |
|---|---|---|
| REQ-001 | Vite React project initialization | `specs/project-structure/spec.md` |
| REQ-002 | Core dependencies installed | `specs/project-structure/spec.md` |
| REQ-003 | Source folder structure | `specs/project-structure/spec.md` |
| REQ-004 | OAuth credentials excluded from VCS | `specs/project-structure/spec.md` |
| REQ-005 | Vite proxy configuration | `specs/project-structure/spec.md` |
| REQ-006 | Dashboard shell layout | `specs/app-shell/spec.md` |
| REQ-007 | App entry point structure | `specs/app-shell/spec.md` |
| REQ-008 | Google Sheets OAuth authentication | `specs/sheets-connection/spec.md` |
| REQ-009 | Read job listings tab | `specs/sheets-connection/spec.md` |
| REQ-010 | Read skills tab | `specs/sheets-connection/spec.md` |
| REQ-011 | Spreadsheet configuration | `specs/sheets-connection/spec.md` |

### Phase 2: Core Analysis & Filtering

| ID | Requirement | Spec |
|---|---|---|
| REQ-012 | Keyword extraction from structured field | `specs/keyword-analysis/spec.md` |
| REQ-013 | Keyword normalization | `specs/keyword-analysis/spec.md` |
| REQ-014 | Keyword frequency counting | `specs/keyword-analysis/spec.md` |
| REQ-015 | Keyword frequency horizontal bar chart | `specs/keyword-analysis/spec.md` |
| REQ-016 | Skill gap comparison | `specs/skill-gap-analysis/spec.md` |
| REQ-017 | Skill gap heatmap visualization | `specs/skill-gap-analysis/spec.md` |
| REQ-018 | Proficiency levels recognized | `specs/skill-gap-analysis/spec.md` |
| REQ-019 | Salary field parsing (EUR) | `specs/salary-analysis/spec.md` |
| REQ-020 | Salary statistics | `specs/salary-analysis/spec.md` |
| REQ-021 | Salary visualization | `specs/salary-analysis/spec.md` |
| REQ-022 | Remote status categorization | `specs/location-analysis/spec.md` |
| REQ-023 | Location grouping | `specs/location-analysis/spec.md` |
| REQ-024 | Location and remote visualization | `specs/location-analysis/spec.md` |
| REQ-025 | Jobs table display | `specs/jobs-table/spec.md` |
| REQ-026 | Keyword filtering | `specs/jobs-table/spec.md` |
| REQ-027 | Text search | `specs/jobs-table/spec.md` |
| REQ-028 | Salary range filtering | `specs/jobs-table/spec.md` |

### Phase 3: LLM Integration & Polish

| ID | Requirement | Spec |
|---|---|---|
| REQ-029 | Claude API integration | `specs/llm-analysis/spec.md` |
| REQ-030 | Job description analysis | `specs/llm-analysis/spec.md` |
| REQ-031 | LLM result caching | `specs/llm-analysis/spec.md` |
| REQ-032 | LLM-enhanced insights display | `specs/llm-analysis/spec.md` |

**Total: 32 requirements, 44 scenarios, 9 spec files**

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

## 3. Parallelization Plan

### Phase 1: Foundation (Sequential)

No parallelization possible. Single track: scaffold → sheets connection → verify.

### Phase 2: Core Analysis & Filtering (3 parallel tracks)

Once Phase 1 delivers working `/api/jobs` and `/api/skills`, three tracks run **simultaneously**:

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
```

**Cross-track dependency:** REQ-028 (salary range filtering in jobs table) reuses `parseSalary()` from REQ-019. Track C can build REQ-025, 026, 027 in parallel, but must wait for Track B's REQ-019 before implementing REQ-028.

**Track A is the longest** because skill gap depends on keyword frequency being complete first (serial within the track).

### Phase 3: LLM Integration (Sequential then parallel)

```
  Claude API setup (sequential: REQ-029 → REQ-030 → REQ-031)
       │
       ▼
  ┌─────────────────┬──────────────────┐
  │  LLM Insights   │  Dashboard Polish│
  │  REQ-032        │  (no REQ — UX)   │
  └─────────────────┴──────────────────┘
  These CAN run in parallel
```

---

## 4. Phase Boundaries

### Phase 1 → Phase 2 Gate

**Demo:** "I can open a local dashboard that reads my live Google Spreadsheet and shows my job listings and skills data."

**Verification checklist:**
1. Run `npm run dev` — both Vite and Express start without error
2. Open browser — "Job Lens" dashboard appears
3. Visit `/api/jobs` — JSON array of job listings returned
4. Visit `/api/skills` — JSON array of skills returned
5. Modify a row in the spreadsheet, refresh — new data appears

**Human decisions required before Phase 2:**
- Google Spreadsheet URL (spreadsheet ID)
- Exact tab names for job listings and skills tabs
- Google Cloud Console OAuth credentials (`credentials.json`)

---

### Phase 2 → Phase 3 Gate

**Demo:** "I can see which skills the market demands most, where my gaps are, what salaries look like, and filter jobs by keyword, salary, or search terms."

**Verification checklist:**
1. Dashboard shows 5 working panels (keywords, skill gap, salary, location, jobs table)
2. Add a new job listing to spreadsheet, refresh — all panels update
3. Add a new skill to skills tab, refresh — skill gap heatmap updates
4. Filter jobs table by keyword — correct results
5. Filter jobs table by salary range — correct results
6. Search jobs table by text — correct results

**No human decisions required** — Phase 3 can start immediately.

---

### Phase 3 → Done Gate

**Demo:** "The dashboard shows AI-powered insights from my job descriptions — extracted skills, role clustering, and trend summaries — alongside all the structured analysis from Phase 2."

**Verification checklist:**
1. Start dashboard without API key — Phase 2 features work, no errors
2. Add API key, refresh — LLM analysis runs on descriptions
3. Refresh again — cached results used (no API calls)
4. Add a new job listing, refresh — only the new listing is analyzed
5. All panels fit in a coherent layout with consistent styling

**Human decisions required before Phase 3:**
- Anthropic API key
- LLM prompt design approval (task 9.1)

---

## 5. Risks & Human Decisions

### Requirements to watch

| ID | Risk | Recommendation |
|---|---|---|
| REQ-013 | Keyword normalization is a rabbit hole | Start with 10-15 common aliases. Expand based on real data. |
| REQ-019 | Salary parsing is fragile with inconsistent formats | Best-effort parser. Log unparseable values. |
| REQ-023 | City normalization is hard to perfect | Exact match + small alias map. LLM improves this in Phase 3. |
| REQ-030 | LLM prompt design is underspecified | Spike with 3-5 real descriptions first. |

### Human decisions that block agent work

| Phase | Decision | Blocks |
|---|---|---|
| 1 | Google Spreadsheet URL + tab names | REQ-009, REQ-010, REQ-011 |
| 1 | Google Cloud OAuth credentials file | REQ-008 |
| 3 | Anthropic API key | REQ-029 |
| 3 | LLM prompt approval | REQ-030 |

### Underspecified requirements

| ID | What's missing | Impact |
|---|---|---|
| REQ-017 | Heatmap dimensions and color scale thresholds | Low — iterate visually |
| REQ-021 | Chart type for salary (histogram? box plot?) | Low — pick during implementation |
| REQ-032 | LLM insights panel layout | Low — design during implementation |

---

## 6. Quick Reference

```
TOTAL: 32 requirements, 44 scenarios, 48 tasks, 19 work items

Phase 1: 11 requirements  │  Foundation        │  Week 1
Phase 2: 17 requirements  │  Core Analysis     │  Week 2-3
Phase 3:  4 requirements  │  LLM + Polish      │  Week 3-4

Parallel tracks in Phase 2:
  Track A: Keywords → Skill Gap (serial)
  Track B: Salary + Location (serial)
  Track C: Jobs Table (independent, except REQ-028)

Human decisions needed:
  Before Phase 1 implementation: Spreadsheet URL, tab names, OAuth credentials
  Before Phase 3 implementation: Anthropic API key, LLM prompt approval

Source of truth:
  Requirements & scenarios  → openspec/changes/joblensv1/specs/
  Architecture & interfaces → openspec/changes/joblensv1/design.md
  Task checklist            → openspec/changes/joblensv1/tasks.md
  Work item assignments     → WORKITEMS.md
```
