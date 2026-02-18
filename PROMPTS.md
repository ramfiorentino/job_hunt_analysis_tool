# Job Lens v1 — Agent Prompts

> Purpose: Mission briefs for each agent assignment
> See `EXECUTION.md` for timing and coordination strategy

---

## How to Use

Each prompt is a **mission brief** — paste it into a new Claude Code session and let the agent figure out the implementation details from the project docs.

- **Phase 1**: Run one prompt at a time, sequentially, all on `main`
- **Phase 2**: Run 3 prompts simultaneously in 3 separate terminals
- **Phase 3**: Run one prompt at a time, sequentially, on `main`

---

## Phase 1: Foundation

Run these two prompts sequentially on the `main` branch. The first sets up the project, the second connects it to Google Sheets.

### Prompt 1 — Scaffold + App Shell

```
You are setting up the foundation for "Job Lens", a local web dashboard built with Vite + React + Express.

This is a greenfield project. Read these files for full context:
- `openspec/changes/joblensv1/design.md` — architecture, project structure, tech decisions
- `openspec/changes/joblensv1/specs/project-structure/spec.md` — scaffold requirements
- `openspec/changes/joblensv1/specs/app-shell/spec.md` — dashboard shell requirements
- `openspec/changes/joblensv1/tasks.md` — tasks 1.1 through 1.10
- `WORKITEMS.md` — WI-001 and WI-002 for file lists

Your mission: complete WI-001 (project scaffold) and WI-002 (app shell). This means:
- Initialize the Vite + React + JS project
- Install all Phase 1-2 dependencies (see design.md)
- Create the full folder structure with placeholder files
- Configure Vite proxy, concurrent dev server, .gitignore
- Build the "Job Lens" dashboard shell with 5 placeholder panels

Work on the `main` branch. Verify `npm run dev` starts both servers and renders the dashboard. Commit each work item separately.
```

### Prompt 2 — Google Sheets Connection

```
You are connecting "Job Lens" to Google Sheets. The project scaffold is already set up on the `main` branch.

Read these files for full context:
- `openspec/changes/joblensv1/design.md` — architecture (Express as API proxy)
- `openspec/changes/joblensv1/specs/sheets-connection/spec.md` — all requirements and scenarios
- `openspec/changes/joblensv1/tasks.md` — tasks 2.1 through 2.8
- `WORKITEMS.md` — WI-003, WI-004, and WI-005 for file lists

Your mission: complete WI-003 (OAuth + config), WI-004 (data endpoints), and WI-005 (frontend API client). This means:
- Implement Google Sheets OAuth 2.0 in server/sheets.js
- Add spreadsheet configuration via .env
- Build GET /api/jobs and GET /api/skills endpoints
- Implement fetchJobs() and fetchSkills() in the frontend client
- Wire a basic data fetch in App.jsx to verify the full pipeline

Work on the `main` branch. Verify both endpoints return data from a live spreadsheet. Commit each work item separately.

Note: The user will provide credentials.json and .env with their spreadsheet ID before you start.
```

**Phase 1 → Phase 2 gate:** Before moving on, verify the checklist in `ROADMAP.md` → Phase 1 → Phase 2 Gate.

---

## Phase 2: Core Analysis (3 Parallel Terminals)

Before starting, create branches:
```bash
git checkout main && git checkout -b track-a
git checkout main && git checkout -b track-b
git checkout main && git checkout -b track-c
```

Run these 3 prompts simultaneously, each in its own terminal.

### Terminal 1 — Track A: Keywords + Skill Gap

```
You are building the keyword analysis and skill gap features for "Job Lens". The foundation (Phase 1) is complete on `main` — the app has working /api/jobs and /api/skills endpoints.

Read these files for full context:
- `openspec/changes/joblensv1/design.md` — architecture, analysis-in-frontend approach
- `openspec/changes/joblensv1/specs/keyword-analysis/spec.md` — keyword requirements and scenarios
- `openspec/changes/joblensv1/specs/skill-gap-analysis/spec.md` — skill gap requirements and scenarios
- `openspec/changes/joblensv1/tasks.md` — tasks 3.1 through 3.5 (keywords) and 4.1 through 4.5 (skill gap)
- `WORKITEMS.md` — WI-006 through WI-009 for file lists and dependencies

Your mission: complete all 4 work items in sequence on the `track-a` branch:
1. WI-006: Keyword extraction, normalization, and frequency counting in src/analysis/keywords.js
2. WI-007: Keyword frequency horizontal bar chart (Recharts) wired into App.jsx
3. WI-008: Skill gap analysis logic in src/analysis/skillGap.js
4. WI-009: Skill gap heatmap visualization wired into App.jsx

Work on the `track-a` branch. Commit each work item separately. After WI-009, verify both charts render with live data from the spreadsheet.

Note: You are running in parallel with Track B (salary + location) and Track C (jobs table) on their own branches. You don't need to coordinate with them — just stay on track-a.
```

### Terminal 2 — Track B: Salary + Location

```
You are building the salary analysis and location breakdown features for "Job Lens". The foundation (Phase 1) is complete on `main` — the app has working /api/jobs and /api/skills endpoints.

Read these files for full context:
- `openspec/changes/joblensv1/design.md` — architecture, analysis-in-frontend approach
- `openspec/changes/joblensv1/specs/salary-analysis/spec.md` — salary requirements (all EUR)
- `openspec/changes/joblensv1/specs/location-analysis/spec.md` — location requirements (remote status from dedicated column)
- `openspec/changes/joblensv1/tasks.md` — tasks 5.1 through 5.5 (salary) and 6.1 through 6.4 (location)
- `WORKITEMS.md` — WI-010 through WI-013 for file lists and dependencies

Your mission: complete all 4 work items in sequence on the `track-b` branch:
1. WI-010: Salary parser and statistics in src/analysis/salary.js
2. WI-011: Salary distribution chart (Recharts) wired into App.jsx
3. WI-012: Location analysis (remote status + city grouping) in src/analysis/location.js
4. WI-013: Location charts (pie chart + bar chart) wired into App.jsx

Work on the `track-b` branch. Commit each work item separately. After WI-013, verify both panels render with live data.

IMPORTANT: parseSalary() from WI-010 will be reused by Track C for the salary range filter. Keep it a clean, standalone export. Track C will cherry-pick your WI-010 commit when they need it.

Note: You are running in parallel with Track A (keywords + skill gap) and Track C (jobs table) on their own branches.
```

### Terminal 3 — Track C: Jobs Table

```
You are building the jobs table with filters for "Job Lens". The foundation (Phase 1) is complete on `main` — the app has working /api/jobs endpoint.

Read these files for full context:
- `openspec/changes/joblensv1/specs/jobs-table/spec.md` — all requirements and scenarios
- `openspec/changes/joblensv1/tasks.md` — tasks 7.1 through 7.5
- `WORKITEMS.md` — WI-014 and WI-015 for file lists and dependencies
- `EXECUTION.md` — cross-track dependency details

Your mission: complete 2 work items on the `track-c` branch:
1. WI-014: Jobs table component displaying all listings, wired into App.jsx
2. WI-015: Add keyword filter, text search, and salary range filter to the table

Work on the `track-c` branch. Commit each work item separately.

CROSS-TRACK DEPENDENCY for WI-015: The salary range filter needs parseSalary() from src/analysis/salary.js, which is being built by Track B (WI-010). Before starting WI-015:
1. Check if Track B has committed WI-010: `git log track-b --oneline`
2. Cherry-pick it: `git cherry-pick <WI-010-commit-hash>`
3. If Track B isn't done yet, build WI-014 first and wait for the WI-010 commit before doing WI-015.

Note: You are running in parallel with Track A and Track B on their own branches.
```

### After All 3 Tracks Complete — Phase 2 Merge

This one you do yourself (not an agent):

```bash
git checkout main
git merge track-a
git merge track-b
git merge track-c   # expect App.jsx conflict — keep all imports and panels from all 3 tracks
```

Verify the checklist in `ROADMAP.md` → Phase 2 → Phase 3 Gate.

---

## Phase 3: LLM Integration & Polish

Run these two prompts sequentially on the `main` branch (after Phase 2 merge).

### Prompt 1 — Claude API Backend

```
You are adding Claude LLM integration to "Job Lens". Phase 2 is complete — the dashboard has 5 working analysis panels.

Read these files for full context:
- `openspec/changes/joblensv1/design.md` — LLM caching strategy, architecture
- `openspec/changes/joblensv1/specs/llm-analysis/spec.md` — all requirements and scenarios
- `openspec/changes/joblensv1/tasks.md` — tasks 8.1 through 8.6 and 9.1
- `WORKITEMS.md` — WI-016 and WI-017 for file lists

Your mission: complete WI-016 (Claude API setup) and WI-017 (description analysis + caching):
- Set up @anthropic-ai/sdk with graceful degradation when key is missing
- Implement description analysis via Claude API with structured JSON output
- Implement file-based caching (.llm-cache.json, keyed by description hash)
- Add POST /api/analyze endpoint and GET /api/llm-status endpoint

Work on the `main` branch. Commit each work item separately. Verify: server starts without API key (no errors, LLM disabled), and with API key (analysis works, results are cached).
```

### Prompt 2 — LLM Insights UI + Dashboard Polish

```
You are building the final layer of "Job Lens" — LLM insights and dashboard polish. The Claude API backend is working (Phase 3 backend is complete).

Read these files for full context:
- `openspec/changes/joblensv1/specs/llm-analysis/spec.md` — insights display requirements
- `openspec/changes/joblensv1/tasks.md` — tasks 9.2 through 9.4 (insights) and 10.1 through 10.5 (polish)
- `WORKITEMS.md` — WI-018 and WI-019 for file lists
- `src/App.jsx` and all files in `src/components/` — current state of the dashboard

Your mission: complete WI-018 (LLM insights display) and WI-019 (dashboard polish):
- Add LLM status check and description analysis to the frontend API client
- Build LLM insights panel (extracted skills, role clusters, seniority distribution)
- Integrate LLM-extracted skills into existing keyword and skill gap views
- Polish the full dashboard: layout grid, visual consistency, loading states, error handling

Work on the `main` branch. Commit each work item separately. Final verification: everything in ROADMAP.md → Phase 3 → Done Gate.
```

---

## Summary

| Prompt | Phase | Branch | Work Items | When |
|---|---|---|---|---|
| Scaffold + App Shell | 1 | main | WI-001, WI-002 | First |
| Sheets Connection | 1 | main | WI-003, WI-004, WI-005 | After Prompt 1 |
| Track A: Keywords + Skill Gap | 2 | track-a | WI-006–WI-009 | After Phase 1 (parallel) |
| Track B: Salary + Location | 2 | track-b | WI-010–WI-013 | After Phase 1 (parallel) |
| Track C: Jobs Table | 2 | track-c | WI-014–WI-015 | After Phase 1 (parallel) |
| Claude API Backend | 3 | main | WI-016, WI-017 | After Phase 2 merge |
| LLM Insights + Polish | 3 | main | WI-018, WI-019 | After Prompt 6 |

**7 prompts total. 3 run in parallel. Each agent reads the project docs to figure out implementation details.**
