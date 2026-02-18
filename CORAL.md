# Coral — Agent Report
> Track C | WI-014 + WI-015 | Date: 2026-02-18

---

## Mission

Build the Jobs Table component and its filters for the Job Lens dashboard.

| Work Item | Description | Status |
|---|---|---|
| WI-014 | Jobs table component displaying all listings, wired into App.jsx | ✅ Done |
| WI-015 | Keyword filter, text search, and salary range filter | ✅ Done |

---

## What Was Built

### WI-014 — Jobs Table (`src/components/JobsTable.jsx`)

A self-contained React component that:

- Fetches all job listings from `/api/jobs` via `fetchJobs()` (self-fetching — does not rely on a prop from App.jsx)
- Handles loading, error, and empty states with appropriate UI messages
- Renders all listings in a horizontally scrollable table with these columns:

  | Column | Notes |
  |---|---|
  | Job Title | Linked to URL if URL field is present |
  | Company | — |
  | Salary | Displayed raw from spreadsheet |
  | Keywords | Truncated if long |
  | Location | — |
  | Remote Status | — |
  | Industry | — |
  | Company Size | — |
  | Priority | — |
  | Lead Source | — |

- Wired into the "Job Listings" panel in `src/App.jsx` via `<JobsTable />` (no props needed)

### WI-015 — Filters (added to same component)

Three filter controls rendered above the table:

**Text search**
- A single text input
- Filters rows where any field value contains the typed string (case-insensitive)
- Searches all columns, including Description

**Keyword chips**
- All unique keywords extracted from the `Keywords` column across all listings (split on comma, trimmed, sorted alphabetically)
- Rendered as toggle buttons (chips)
- Selecting multiple chips uses AND logic — a listing must contain all selected keywords to be shown
- Chips turn indigo when active

**Salary range**
- Min and Max number inputs (EUR)
- Uses `parseSalary()` from `src/analysis/salary.js` (WI-010, Track B) to parse raw salary strings
- Filters by salary midpoint: `(parsed.min + parsed.max) / 2`
- Listings with unparseable salaries (e.g. "Competitive", blank) are excluded when a range is active

**Clear button**
- Appears when any filter is active
- Resets all filter state in one click

**Count line**
- Shows "N listings" when unfiltered
- Shows "N of M listings" when a filter is active

### Styles (`src/App.css`)

Added two CSS sections:
- **Jobs Table** — wrapper, scroll container, `<table>` layout, header/cell padding, hover row highlight, link colour, salary/keyword column constraints, empty-state cell
- **Jobs Table Filters** — search input, salary inputs, Clear button, keyword chip section and chip toggle states

---

## Cross-Track Dependency Resolution

WI-015 requires `parseSalary()` from `src/analysis/salary.js`, which was Track B's WI-010 responsibility.

**Outcome:** WI-010 was already committed to `track-c` (commit `5b08c90`) before Coral began WI-015. No cherry-pick was necessary.

---

## Commits on `track-c`

```
21acc94  WI-015: Add keyword filter, text search, and salary range filter
27be629  Revert "WI-006: ..." (pre-existing — not Coral's commit)
5b08c90  WI-010: Implement salary parser and statistics (EUR) (pre-existing — Bolt's commit, includes initial JobsTable.jsx stub)
```

WI-015 (`21acc94`) is the only commit Coral authored on `track-c`.

WI-014 content was partially present in `track-c` already (Bolt's WI-010 included a basic `JobsTable.jsx`). Coral's WI-015 commit replaced that stub with the full implementation including all three filters.

---

## ⚠️ Note on `track-b` — Accidental WI-014 Commit

**What happened:**
The working directory is shared across all parallel agents. During early implementation attempts, Coral was unknowingly operating on `track-b` instead of `track-c` (the `git checkout track-c` command ran but a concurrent write from another agent temporarily reset the file state, causing confusion about which branch was active).

As a result, an early WI-014 draft commit landed on `track-b`:

```
b944a8f  WI-014: Jobs table component wired into App.jsx  ← Coral's accidental commit
```

This commit appears between Bolt's own commits:

```
297490e  WI-013: Location breakdown charts wired into App.jsx  (Bolt)
b944a8f  WI-014: Jobs table component wired into App.jsx       (Coral — accidental)
0bd5684  WI-012: Implement location analysis                   (Bolt)
```

**Why it was not removed:**
Bolt's WI-013 commit (`297490e`) was already stacked on top of Coral's accidental commit by the time it was discovered. Reverting `b944a8f` from `track-b` would have required rebasing or reverting WI-013 as well, which would disrupt Bolt's work.

**Impact at merge time:**
The content of the accidental commit is fully additive:
- `src/components/JobsTable.jsx` (prop-based stub, will be superseded by track-c's version)
- `src/App.jsx` changes (imports JobsTable — additive)
- `src/App.css` additions (table styles — additive)

When merging `track-b` and `track-c` into `main`, the person handling the merge should:
1. Keep `track-c`'s final `JobsTable.jsx` (the self-fetching version with all filters) — it supersedes the prop-based stub from the accidental commit
2. Keep all CSS additions from both tracks (they are additive, no conflicts expected on individual rules)
3. Keep all `App.jsx` imports from all tracks (the standard Phase 2 merge strategy)

---

## Concurrent Editing Environment — Observations

The three parallel agents (Atlas, Bolt, Coral) share a single working directory on the same machine. This caused several complications during Coral's session:

1. **Branch state confusion** — `git checkout track-c` succeeded, but concurrent file writes by other agents temporarily made it appear the working tree was on a different branch's file state. Always verify the active branch with `git branch` immediately before staging and committing.

2. **File content flicker** — Files read with the Read tool sometimes showed different content than what `cat` via Bash showed moments later, because another agent wrote the file between the two reads.

3. **"Nothing to commit" on staged files** — On the first commit attempt for WI-014, staged files showed as having no changes when the commit ran. This was because another agent had written an identical (or newer) version of the same file to disk between `git add` and `git commit`, making the working tree match HEAD again. The fix was to write files and stage+commit in rapid succession, minimising the window for concurrent writes.

4. **WI-010 already on track-c** — Contrary to the instructions (which said to check `track-b` for WI-010 and cherry-pick if available), WI-010 was already committed directly on `track-c` by Bolt. The cross-track cherry-pick step was therefore unnecessary.

**Recommendation for future parallel runs:** Consider giving each agent its own working directory clone (via `git worktree add`) to eliminate shared-filesystem race conditions entirely.

---

## Files Modified by Coral

| File | Action |
|---|---|
| `src/components/JobsTable.jsx` | Created (WI-014) then extended with filters (WI-015) |
| `src/App.css` | Added Jobs Table and Jobs Filter CSS sections |

`src/App.jsx` was **not** modified by Coral's final committed work — the existing `<JobsTable />` call in track-c's App.jsx is compatible with the self-fetching component.

---

## Ready for Merge

`track-c` is complete. The branch can be merged into `main` after `track-a` and `track-b` are also ready.

Expected `App.jsx` merge conflict at Phase 2 integration is normal and additive — keep all component imports from all three tracks as documented in `EXECUTION.md`.
