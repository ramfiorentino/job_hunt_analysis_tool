# Job Lens v1 — Agent Execution Timeline

> Generated: 2026-02-17
> Purpose: Coordination plan for parallel agent execution
>
> **Depends on:** `WORKITEMS.md` for work item details, `ROADMAP.md` for dependency graph

---

## Agent Types

| Agent | Scope | Work Items |
|---|---|---|
| **scaffold** | Project init, tooling, config | WI-001 |
| **backend** | Express, Sheets API, Claude API, caching | WI-003, WI-004, WI-016, WI-017 |
| **analysis** | Pure JS data transforms in `src/analysis/` | WI-006, WI-008, WI-010, WI-012 |
| **frontend** | React components, API client, dashboard | WI-002, WI-005, WI-007, WI-009, WI-011, WI-013, WI-014, WI-015, WI-018, WI-019 |

---

## Phase 1: Foundation (Sequential on `main`)

No parallelism. Each work item depends on the previous one. All work happens on the `main` branch.

```
main branch
═══════════

  scaffold ▓▓▓▓▓▓▓▓  WI-001  Project scaffold
                      │
  frontend            ├── ▓▓▓▓  WI-002  App shell
                      │
  backend             └── ▓▓▓▓▓▓▓▓  WI-003  Sheets OAuth
                                      │
  backend                             └── ▓▓▓▓▓▓  WI-004  Data endpoints
                                                    │
  frontend                                          └── ▓▓▓▓  WI-005  API client
```

**Note:** WI-002 and WI-003 *could* run in parallel (different files, no conflict), but the benefit is small. Run sequentially to establish a clean baseline.

**Execution order:**

| Step | Agent | Work Item | Branch |
|---|---|---|---|
| 1 | scaffold | WI-001 | main |
| 2 | frontend | WI-002 | main |
| 3 | backend | WI-003 | main |
| 4 | backend | WI-004 | main |
| 5 | frontend | WI-005 | main |

**Gate 1 checkpoint:** Verify `/api/jobs` and `/api/skills` return data. See `ROADMAP.md` → Phase 1 → Phase 2 Gate.

**Human decisions required before starting Phase 1:**
- Google Spreadsheet URL + tab names
- Google Cloud OAuth credentials (`credentials.json`)

---

## Phase 2: Core Analysis (3 Parallel Branches)

This is where real parallelism happens. Three tracks run simultaneously on separate branches.

### Branch setup

```bash
git checkout main
git checkout -b track-a    # Keywords + Skill Gap
git checkout main
git checkout -b track-b    # Salary + Location
git checkout main
git checkout -b track-c    # Jobs Table
```

### Parallel execution

```
TERMINAL 1 (track-a)            TERMINAL 2 (track-b)           TERMINAL 3 (track-c)
═══════════════════════          ═══════════════════════         ═══════════════════════

analysis ▓▓▓▓▓▓  WI-006         analysis ▓▓▓▓▓▓  WI-010       frontend ▓▓▓▓▓▓  WI-014
  keywords.js                     salary.js                      JobsTable.jsx
         │                               │                              │
frontend ▓▓▓▓  WI-007            frontend ▓▓▓▓  WI-011                  │ (idle, waiting
  KeywordChart.jsx                 SalaryChart.jsx                      │  for WI-010)
  + App.jsx                        + App.jsx                            │
         │                               │                              │
analysis ▓▓▓▓▓▓  WI-008         analysis ▓▓▓▓▓▓  WI-012       ┌────────┤
  skillGap.js                     location.js                  │ CHERRY │
         │                               │                    │  PICK  │
frontend ▓▓▓▓  WI-009           frontend ▓▓▓▓  WI-013         │ WI-010 │
  SkillGapHeatmap.jsx              LocationBreakdown.jsx       └────┬───┘
  + App.jsx                        + App.jsx                        │
         │                               │                 frontend ▓▓▓▓▓▓  WI-015
         ▼                               ▼                   JobsTable.jsx filters
    track-a done                    track-b done                    │
                                                                    ▼
                                                               track-c done
```

### Cross-track dependency: WI-015 ← WI-010

Track C's WI-015 (salary range filter) imports `parseSalary()` from `src/analysis/salary.js`, which is created by Track B's WI-010.

**Resolution: cherry-pick**

```bash
# After Track B completes WI-010 and commits salary.js:
git checkout track-c
git cherry-pick <WI-010-commit-hash>
# Track C now has salary.js → can proceed with WI-015
```

### Agent activity during Phase 2

| Moment | scaffold | backend | analysis | frontend |
|---|---|---|---|---|
| Phase 2 start | done | idle | WI-006, WI-010, WI-012 | WI-014 |
| Mid Phase 2 | done | idle | WI-008 | WI-007, WI-011, WI-013 |
| Late Phase 2 | done | idle | idle | WI-009, WI-015 |

**Note:** The backend agent is idle during all of Phase 2. The analysis agent finishes mid-phase. The frontend agent is the busiest — it touches 7 work items across all 3 tracks.

### Merging Phase 2 branches

When all 3 tracks are complete:

```bash
git checkout main
git merge track-a      # clean — adds KeywordChart, SkillGapHeatmap, keywords.js, skillGap.js
git merge track-b      # clean — adds SalaryChart, LocationBreakdown, salary.js, location.js
git merge track-c      # App.jsx WILL conflict — resolve manually
```

**Expected conflict:** `App.jsx` will have 3 different versions of component imports and panel wiring. All three are additive — keep all imports and all panels.

```jsx
// Merged result should include ALL of:
import KeywordChart from './components/KeywordChart'       // track-a
import SkillGapHeatmap from './components/SkillGapHeatmap' // track-a
import SalaryChart from './components/SalaryChart'         // track-b
import LocationBreakdown from './components/LocationBreakdown' // track-b
import JobsTable from './components/JobsTable'             // track-c
```

**Gate 2 checkpoint:** Verify all 5 panels render with live data. See `ROADMAP.md` → Phase 2 → Phase 3 Gate.

---

## Phase 3: LLM Integration & Polish (Sequential on `main`)

Not enough independence between work items to justify branches.

```
main branch (after Phase 2 merge)
═════════════════════════════════

  backend  ▓▓▓▓▓▓  WI-016  Claude API setup
                    │
  backend           └── ▓▓▓▓▓▓▓▓  WI-017  Analysis + caching
                                    │
  frontend                          └── ▓▓▓▓▓▓  WI-018  LLM insights UI
                                                  │
  frontend                                        └── ▓▓▓▓▓▓  WI-019  Dashboard polish
```

**Execution order:**

| Step | Agent | Work Item | Branch |
|---|---|---|---|
| 1 | backend | WI-016 | main |
| 2 | backend | WI-017 | main |
| 3 | frontend | WI-018 | main |
| 4 | frontend | WI-019 | main |

**Human decisions required before starting Phase 3:**
- Anthropic API key
- LLM prompt design approval

**Gate 3 checkpoint:** See `ROADMAP.md` → Phase 3 → Done Gate.

---

## Full Timeline Summary

```
TIME ────────────────────────────────────────────────────────────────────────►

PHASE 1 (sequential, main)
┌─────────────────────────────────────────────────────────┐
│  WI-001 → WI-002 → WI-003 → WI-004 → WI-005           │
│  scaffold  frontend  backend  backend  frontend         │
└──────────────────────────────────────────────┬──────────┘
                                               │ GATE 1
PHASE 2 (parallel, 3 branches)                 │
┌──────────────────────────────────────────────┼──────────┐
│                                              │          │
│  track-a: WI-006 → WI-007 → WI-008 → WI-009 ◄┘         │
│                                                         │
│  track-b: WI-010 → WI-011 → WI-012 → WI-013 ◄┘         │
│                 │                                       │
│  track-c: WI-014 ──────────────────── → WI-015 ◄┘       │
│                 │         cherry-pick ──┘                │
│                 └─────────────────────┘                  │
│                                                         │
│  ► merge track-a, track-b, track-c → main               │
└──────────────────────────────────────────────┬──────────┘
                                               │ GATE 2
PHASE 3 (sequential, main)                    │
┌──────────────────────────────────────────────┼──────────┐
│  WI-016 → WI-017 → WI-018 → WI-019         ◄┘          │
│  backend   backend   frontend  frontend                 │
└─────────────────────────────────────────────────────────┘
                                                 GATE 3 ──► DONE
```

## Coordination Moments

There are exactly **2 coordination points** in the entire project:

| # | When | What | How |
|---|---|---|---|
| 1 | Phase 2, mid-execution | WI-015 needs `parseSalary()` from WI-010 | Cherry-pick WI-010 commit into `track-c` |
| 2 | Phase 2 end | Merge 3 branches into main | Resolve `App.jsx` merge conflict (additive, all imports kept) |

Everything else is either sequential (no coordination needed) or fully independent (no conflict possible).
