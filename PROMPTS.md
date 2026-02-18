# Job Lens v1 — Agent Prompts

> Purpose: Mission briefs for each agent assignment
> See `EXECUTION.md` for timing and coordination strategy

---

## Agents

| Name | Role | Sessions | Branch |
|---|---|---|---|
| **Lens** | Orchestrator + Phase 1 builder | This session (main) | `main` |
| **Atlas** | Track A: Keywords + Skill Gap | Phase 2 terminal 1 | `track-a` |
| **Bolt** | Track B: Salary + Location | Phase 2 terminal 2 | `track-b` |
| **Coral** | Track C: Jobs Table + Filters | Phase 2 terminal 3 | `track-c` |
| **Deep** | Phase 3: LLM backend + UI polish | Phase 3 session | `main` |

**Lens** handles Phase 1 directly (no prompt needed — it's this session) and coordinates Phase 2 merge.
**Atlas**, **Bolt**, and **Coral** run in parallel during Phase 2.
**Deep** handles all of Phase 3 sequentially.

---

## How to Use

1. **Phase 1** — Lens (this session) builds the foundation directly. No copy-paste needed.
2. **Phase 2** — Open 3 new Claude Code terminals. Paste the Atlas, Bolt, and Coral prompts. Run in parallel.
3. **Phase 2 merge** — Lens merges the 3 branches back into `main`.
4. **Phase 3** — Open 1 new Claude Code session. Paste the Deep prompt. Run sequentially.

---

## Phase 1: Foundation (Lens — this session)

No prompt needed. Lens builds WI-001 through WI-005 directly in this session on `main`.

**Phase 1 → Phase 2 gate:** Verify the checklist in `ROADMAP.md` → Phase 1 → Phase 2 Gate.

---

## Phase 2: Core Analysis (3 Parallel Terminals)

Before starting, Lens creates branches:
```bash
git checkout main && git checkout -b track-a
git checkout main && git checkout -b track-b
git checkout main && git checkout -b track-c
```

Then open 3 new Claude Code terminals and paste the corresponding prompt into each.

### Atlas — Track A: Keywords + Skill Gap

```
You are Atlas, one of the agents building "Job Lens" — a local job analysis dashboard. The foundation (Phase 1) is complete on `main` — the app has working /api/jobs and /api/skills endpoints.

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

You are running in parallel with Bolt (Track B, salary + location) and Coral (Track C, jobs table) on their own branches. You don't need to coordinate with them — just stay on track-a.
```

### Bolt — Track B: Salary + Location

```
You are Bolt, one of the agents building "Job Lens" — a local job analysis dashboard. The foundation (Phase 1) is complete on `main` — the app has working /api/jobs and /api/skills endpoints.

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

IMPORTANT: parseSalary() from WI-010 will be reused by Coral (Track C) for the salary range filter. Keep it a clean, standalone export. Coral will cherry-pick your WI-010 commit when they need it.

You are running in parallel with Atlas (Track A, keywords + skill gap) and Coral (Track C, jobs table) on their own branches.
```

### Coral — Track C: Jobs Table

```
You are Coral, one of the agents building "Job Lens" — a local job analysis dashboard. The foundation (Phase 1) is complete on `main` — the app has working /api/jobs endpoint.

Read these files for full context:
- `openspec/changes/joblensv1/specs/jobs-table/spec.md` — all requirements and scenarios
- `openspec/changes/joblensv1/tasks.md` — tasks 7.1 through 7.5
- `WORKITEMS.md` — WI-014 and WI-015 for file lists and dependencies
- `EXECUTION.md` — cross-track dependency details

Your mission: complete 2 work items on the `track-c` branch:
1. WI-014: Jobs table component displaying all listings, wired into App.jsx
2. WI-015: Add keyword filter, text search, and salary range filter to the table

Work on the `track-c` branch. Commit each work item separately.

CROSS-TRACK DEPENDENCY for WI-015: The salary range filter needs parseSalary() from src/analysis/salary.js, which is being built by Bolt (Track B, WI-010). Before starting WI-015:
1. Check if Bolt has committed WI-010: `git log track-b --oneline`
2. Cherry-pick it: `git cherry-pick <WI-010-commit-hash>`
3. If Bolt isn't done yet, build WI-014 first and wait for the WI-010 commit before doing WI-015.

You are running in parallel with Atlas (Track A) and Bolt (Track B) on their own branches.
```

### Phase 2 Merge (Lens — this session)

After Atlas, Bolt, and Coral all report done, Lens merges:

```bash
git checkout main
git merge track-a
git merge track-b
git merge track-c   # expect App.jsx conflict — keep all imports and panels from all 3 tracks
```

Verify the checklist in `ROADMAP.md` → Phase 2 → Phase 3 Gate.

---

## Phase 3: LLM Integration & Polish (Deep)

Open 1 new Claude Code session and paste this prompt. Deep handles both the backend and frontend work sequentially.

### Deep — LLM Backend + Insights UI + Dashboard Polish

```
You are Deep, the final agent building "Job Lens" — a local job analysis dashboard. Phase 2 is complete — the dashboard has 5 working analysis panels (keywords, skill gap, salary, location, jobs table with filters).

Read these files for full context:
- `openspec/changes/joblensv1/design.md` — LLM caching strategy, architecture
- `openspec/changes/joblensv1/specs/llm-analysis/spec.md` — all LLM requirements and scenarios
- `openspec/changes/joblensv1/tasks.md` — tasks 8.1 through 8.6 (API setup), 9.1 through 9.4 (insights), and 10.1 through 10.5 (polish)
- `WORKITEMS.md` — WI-016 through WI-019 for file lists and dependencies
- `src/App.jsx` and all files in `src/components/` — current state of the dashboard

Your mission: complete all 4 work items in sequence on the `main` branch:
1. WI-016: Claude API setup — install @anthropic-ai/sdk, implement client in server/llm.js, graceful degradation when key is missing
2. WI-017: Description analysis + caching — POST /api/analyze endpoint, Claude API calls, .llm-cache.json file-based cache
3. WI-018: LLM insights display — insights panel, integrate extracted skills into keyword and skill gap views
4. WI-019: Dashboard polish — layout grid, visual consistency, loading states, error handling

Work on the `main` branch. Commit each work item separately.

Verify WI-016/WI-017: server starts without API key (no errors, LLM disabled), and with key (analysis works, results cached).
Final verification after WI-019: everything in ROADMAP.md → Phase 3 → Done Gate.
```

---

## Summary

| Agent | Phase | Branch | Work Items | When |
|---|---|---|---|---|
| **Lens** | 1 | main | WI-001–WI-005 | First (this session) |
| **Atlas** | 2 | track-a | WI-006–WI-009 | After Phase 1 (parallel) |
| **Bolt** | 2 | track-b | WI-010–WI-013 | After Phase 1 (parallel) |
| **Coral** | 2 | track-c | WI-014–WI-015 | After Phase 1 (parallel) |
| **Lens** | 2 merge | main | — | After Atlas + Bolt + Coral done |
| **Deep** | 3 | main | WI-016–WI-019 | After Phase 2 merge |

**5 agents. 7 sessions (Lens runs twice). 3 run in parallel during Phase 2.**
