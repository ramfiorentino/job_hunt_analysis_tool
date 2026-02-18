# ATLAS — Track A Agent Report

> **Agent:** Atlas
> **Branch:** `track-a`
> **Session date:** 2026-02-18
> **Scope:** Phase 2, Track A — Keyword analysis and skill gap analysis

---

## What Was Built

Track A delivers two fully wired dashboard panels: the Keyword Frequency chart and the Skill Gap heatmap. Both read live data from the spreadsheet on every page load.

### WI-006 — Keyword Extraction, Normalization, Frequency Counting
**Commit:** `fa97965` | **File:** `src/analysis/keywords.js`

Two exported functions:

- **`normalizeKeyword(keyword)`** — trims, lowercases, then applies a variant map to collapse common alias forms into a single canonical key. Examples: `ReactJS` → `react`, `NodeJS` → `node.js`, `TS` → `typescript`, `k8s` → `kubernetes`, `cicd` → `ci/cd`.

- **`getKeywordFrequencies(jobs)`** — iterates over all job objects, reads the `Keywords` column (comma-separated), normalizes each token, counts occurrences in a plain object, and returns a `{ keyword, count }` array sorted descending by count.

Current variant map covers: React/ReactJS/React.js, Node/NodeJS/Node.js, TS, JS/ES6, Postgres/PostgreSQL, Mongo/MongoDB, k8s/Kubernetes, Vue/VueJS/Vue.js, NextJS/Next.js, Express/ExpressJS/Express.js, CSS3/CSS, HTML5/HTML, CICD/CI/CD.

---

### WI-007 — Keyword Frequency Horizontal Bar Chart
**Commit:** `a5db582` | **Files:** `src/components/KeywordChart.jsx`, `src/App.jsx`, `src/App.css`

- **`KeywordChart`** — Recharts `BarChart` in `layout="vertical"`. Keywords on the Y-axis (`type="category"`), frequency count on the X-axis (`type="number"`, integer-only). Capped at top 20 keywords. Chart height scales with the number of rows (`max(300, n * 28)px`) so bars stay readable regardless of how many keywords there are. Uses the project's indigo (`#4f46e5`) as bar fill.

- **`App.jsx`** — added `useState`/`useEffect` to fetch `/api/jobs` and `/api/skills` in parallel via `Promise.all`. Computes `keywordFrequencies` from the jobs array and passes it into `KeywordChart`. Loading and error states are rendered as text inside the panel so the layout never breaks.

- **`App.css`** — added `.panel__error` (red, 0.875rem) for fetch error display.

---

### WI-008 — Skill Gap Analysis Logic
**Commit:** `59c6c32` | **File:** `src/analysis/skillGap.js`

One exported function and one exported constant:

- **`PROFICIENCY_LEVELS`** — `['Beginner', 'Intermediate', 'Advanced']` in ascending order. Exported so the heatmap component can reference the same source of truth for its column headers.

- **`analyzeSkillGaps(keywordFrequencies, userSkills)`** — takes the output of `getKeywordFrequencies` and the raw skills array from the API.
  1. Builds a `userSkillMap`: `normalizedSkillName → proficiency` from the `Skill` and `Proficiency` columns.
  2. Computes a high-demand threshold: **33% of the highest keyword count** in the dataset (i.e. the top third by count). This is relative to the actual data so it adapts to any dataset size.
  3. Categorises each market keyword:
     - **Strength** — user has the skill AND count ≥ threshold
     - **Gap** — user lacks the skill AND count ≥ threshold
     - **Low-demand** — user has the skill AND count < threshold
     - _(Low-demand + user lacks skill → silently omitted; not actionable)_
  4. Also adds any user skill that doesn't appear in any job keyword to `lowDemand` with `count: 0`.
  5. Returns `{ strengths, gaps, lowDemand }`, each an array of `{ keyword, count, proficiency }`.

---

### WI-009 — Skill Gap Heatmap
**Commit:** `4f9e1f9` | **Files:** `src/components/SkillGapHeatmap.jsx`, `src/App.jsx`

- **`SkillGapHeatmap`** — a 2D grid rendered as an HTML `<table>` (no Recharts; Recharts has no native heatmap primitive and a CSS grid is more readable for this use case).

  **Grid layout:**

  |  | Not Listed | Beginner | Intermediate | Advanced |
  |--|--|--|--|--|
  | **High Demand** | gaps (red) | strengths (green) | strengths (green) | strengths (green) |
  | **Low / No Demand** | — | low-demand (gray) | low-demand (gray) | low-demand (gray) |

  Each skill appears as an inline chip showing the skill name and listing count (`×N`). Empty cells show a neutral background. A color legend sits above the table.

  Three color themes defined in `CELL_COLORS`:
  - `strength` → green (`#dcfce7` / `#16a34a`)
  - `gap` → red (`#fee2e2` / `#dc2626`)
  - `lowDemand` → gray (`#f3f4f6` / `#d1d5db`)

- **`App.jsx`** — added `analyzeSkillGaps` import and call (`skillGapData = analyzeSkillGaps(keywordFrequencies, skills)`), added `SkillGapHeatmap` import, replaced the Skill Gap placeholder with the heatmap panel (same loading/error pattern as the keyword panel).

---

## Commit Log

| Commit | Work Item | Description |
|--|--|--|
| `fa97965` | WI-006 | Keyword extraction, normalization, frequency counting |
| `a5db582` | WI-007 | KeywordChart (Recharts horizontal bar) + App.jsx wiring |
| `59c6c32` | WI-008 | Skill gap analysis logic (strengths / gaps / lowDemand) |
| `4f9e1f9` | WI-009 | SkillGapHeatmap (2D grid) + App.jsx wiring |

---

## Notes and Considerations for Future Work

### Branch hygiene incident
During this session, `git checkout -b track-a` silently landed on `track-c` (the branch already existed and the shell reported "Switched to branch 'track-a'" but `git branch` confirmed `track-c` was active). The WI-006 commit was made to `track-c` by mistake. It was recovered via `git cherry-pick` to `track-a` and reverted from `track-c`. **Before making any commit, always confirm the branch with `git branch` or `git status`.**

### Recharts and the heatmap
The task spec said "2D heatmap with Recharts". Recharts does not include a native heatmap component. Options considered:
- `ScatterChart` — shows individual skill dots but is hard to read as a grid.
- `BarChart` — cannot express two categorical axes simultaneously.
- CSS grid / HTML table — cleanest for a demand × proficiency matrix.

The HTML table approach was chosen. If Recharts-only is a hard requirement in the future, a `ScatterChart` with categorical tick labels (proficiency on X, demand tiers mapped to numeric Y) can be substituted.

### High-demand threshold is relative, not absolute
The 33%-of-max threshold in `analyzeSkillGaps` means results shift as more jobs are added. With few listings (< 5), nearly every keyword clears the threshold. With a large dataset (50+), the threshold becomes more selective. If the user wants a fixed threshold (e.g., "any skill appearing in 5+ listings"), the `HIGH_DEMAND_FRACTION` constant in `skillGap.js` can be replaced with an absolute value or made configurable.

### Keyword normalization is best-effort
The `VARIANT_MAP` in `keywords.js` handles the most common tech aliases, but it will miss less obvious synonyms (e.g., "ML" vs "Machine Learning", "infra" vs "infrastructure"). This is expected — the spec acknowledges it and defers semantic normalization to Phase 3's LLM integration. Do not try to expand `VARIANT_MAP` too aggressively; false collapses (e.g., treating `Go` and `Golang` as the same while also matching common English "go") can corrupt counts.

### The `skills` array is fetched but not yet used by any other panel
`App.jsx` fetches skills data alongside jobs from the start. Currently only `SkillGapHeatmap` consumes it. When Bolt (Track B) and Coral (Track C) panels are merged in, they should reuse the same `skills` state rather than triggering a second fetch.

### `normalizeKeyword` is shared across analysis modules
`skillGap.js` imports `normalizeKeyword` from `keywords.js`. This is intentional — the skill-to-market matching only works if both sides apply the same normalization. If `keywords.js` is ever refactored (e.g., the variant map is moved to a separate constants file), `skillGap.js` must be updated in tandem.

### Empty-state messages
Both `KeywordChart` and `SkillGapHeatmap` handle empty data gracefully with `.panel__placeholder` text rather than rendering broken chart elements. This makes the dashboard usable during initial spreadsheet setup when rows are sparse.

### Merge considerations for the orchestrator
When merging `track-a` into `main` alongside Track B and Track C:
- `src/App.jsx` will have conflicts — all three tracks modify it. Track A's version is the base (adds data fetching + two panels). Merge should preserve all panel sections and add Track B/C panels alongside.
- `src/App.css` may conflict if Track B/C add their own utility classes. The `.panel__error` addition from Track A is minimal and unlikely to clash.
- `src/analysis/keywords.js` and `src/analysis/skillGap.js` are Track A-only files; no merge conflict expected.
- `src/components/KeywordChart.jsx` and `src/components/SkillGapHeatmap.jsx` are new files; no merge conflict expected.
