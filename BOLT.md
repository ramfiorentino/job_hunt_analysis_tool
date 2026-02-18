# Bolt — Track B Handoff Report

> Agent: Bolt | Branch: `track-b` | Date: 2026-02-18
> Work Items: WI-010 · WI-011 · WI-012 · WI-013

---

## What was built

### WI-010 — Salary parser & statistics (`30f5fde`)
**File:** `src/analysis/salary.js`

Two exported functions:

**`parseSalary(salaryString)`** — clean standalone export, intentionally
dependency-free so Coral (Track C) can cherry-pick this commit for WI-015.

Handles all formats seen in the wild:
| Input | Output |
|---|---|
| `"€80k-€100k"` | `{ min: 80000, max: 100000 }` |
| `"80,000-100,000"` | `{ min: 80000, max: 100000 }` |
| `"€90,000"` | `{ min: 90000, max: 90000 }` |
| `"90K/yr"` | `{ min: 90000, max: 90000 }` |
| `"Competitive"` | `null` |
| `""` / blank | `null` |

Strips: `€`, `$`, `£`, commas (thousand separators), `/yr`, `/year`, `/annum`.
Understands: `k`/`K` suffix, ranges (dash-separated), single values.
Never throws — unparseable values return `null` and are silently excluded.

**`analyzeSalaries(jobs)`** — aggregates across all listings:
- Returns `{ min, max, average, median, data[] }`
- `data[]` sorted by midpoint ascending (ready for chart consumption)
- All values EUR; statistics computed over midpoints

---

### WI-011 — Salary distribution chart (`c031db4`)
**Files:** `src/components/SalaryChart.jsx`, `src/App.jsx`, `src/App.css`

Recharts `BarChart` with `layout="vertical"`:
- **Range bar technique:** stacked invisible base bar + indigo range bar —
  each job shows a bar spanning exactly from its `min` to its `max` salary
- **Reference lines:** amber dashed line for average, purple for median
  (median line hidden when it equals average)
- **Summary stat chips** above the chart: Min / Avg / Median / Max / Listings
- **Custom tooltip:** shows job title, min, max, and midpoint on hover
- Height scales dynamically with listing count (`40px × n`, min 120px)
- `isAnimationActive={false}` on both bars for snappy rendering

`App.jsx` changes:
- `fetchJobs()` via `useEffect` → `setJobs(data)`
- `analyzeSalaries(jobs)` derived synchronously from state
- Loading / error / empty states in the Salary Distribution panel

---

### WI-012 — Location analysis (`0bd5684`)
**File:** `src/analysis/location.js`

**`analyzeLocations(jobs)`** — reads two spreadsheet columns:

**`"Remote Status"` column** → normalised to three canonical values:
| Raw value | Canonical |
|---|---|
| `remote` (any case) | `Remote` |
| `hybrid` (any case) | `Hybrid` |
| `on-site` / `onsite` / `on site` / `office` | `On-site` |
| anything else | passed through as-is (trimmed) |

**`"Location"` column** → city/region extraction:
1. Takes the first comma-separated segment (`"Berlin, Germany"` → `"Berlin"`)
2. Applies alias table for common abbreviations and alternate spellings
3. Falls back to title-case of the raw segment for unknowns

Alias table (in `CITY_ALIASES`):
`nyc` → New York, `sf` → San Francisco, `la` → Los Angeles,
`münchen` → Munich, `zürich` → Zurich, and more.
Add new entries to `CITY_ALIASES` as needed — no logic changes required.

Returns:
```js
{
  remoteBreakdown: [{ name, value }],  // sorted by count desc
  cityBreakdown:   [{ name, count }],  // sorted by count desc
}
```

---

### WI-013 — Location charts (`297490e`)
**Files:** `src/components/LocationBreakdown.jsx`, `src/App.jsx`, `src/App.css`

Two charts in a stacked layout:

**Remote status — Pie chart:**
- Fixed colour mapping: Remote = indigo `#4f46e5`, Hybrid = amber `#f59e0b`,
  On-site = emerald `#10b981`
- Inline percentage labels inside each slice (hidden if slice < 5%)
- Legend shows name + raw count
- Graceful: hidden entirely if no remote data

**Location — Horizontal bar chart:**
- Emerald bars, sorted by count descending
- Height scales with city count (`36px × n`, min 100px)
- Tooltip: `"3 listings"` (with correct singular/plural)
- Graceful: hidden entirely if no location data

Both charts use `ResponsiveContainer` and `isAnimationActive={false}`.

`App.jsx` additions:
- `analyzeLocations(jobs)` derived from state alongside `analyzeSalaries`
- `<LocationBreakdown locationData={locationData} />` in the Location & Remote panel
- Identical loading / error guard pattern to SalaryChart

---

## Track B commit log on `track-b`

```
297490e  WI-013: Location breakdown charts wired into App.jsx
b944a8f  WI-014: Jobs table component wired into App.jsx   ← Coral landed here
0bd5684  WI-012: Implement location analysis (remote status + city grouping)
c031db4  WI-011: Salary distribution chart wired into App.jsx
30f5fde  WI-010: Implement salary parser and statistics (EUR)
25bc38f  (Phase 1 base — Filter blank data rows from Sheets API response)
```

---

## Notes & things to watch for

### 1. `parseSalary` cherry-pick for Track C
Coral (WI-015) should cherry-pick commit **`30f5fde`** to get `parseSalary`.
That commit touches only `src/analysis/salary.js` — no merge conflicts expected.
```bash
git cherry-pick 30f5fde
```

### 2. WI-014 landed on `track-b` during the session
Coral's WI-014 (Jobs Table) committed onto `track-b` mid-session
(commit `b944a8f`). As a result, `track-b`'s `App.jsx` already renders
`<JobsTable>` and imports from `src/components/JobsTable.jsx`.
WI-013 was committed on top of that, so the final `App.jsx` on `track-b`
includes SalaryChart, LocationBreakdown, and JobsTable all wired up.

### 3. App.jsx merge strategy at integration time
When merging tracks into `main`, `App.jsx` will have three-way conflicts
(Track A adds KeywordChart + SkillGapHeatmap, Track B adds SalaryChart +
LocationBreakdown, Track C already mixed in). The cleanest resolution is
to manually combine all imports and panel renders into one file — the
structure is uniform enough that this should be straightforward.

### 4. City alias table is easy to extend
To add more city normalisation, edit only the `CITY_ALIASES` object at the
top of `src/analysis/location.js`. No function changes needed.

### 5. Shell environment note (for future agents on this project)
Each Bash tool invocation starts a fresh shell — `git checkout` does not
persist between calls. Always chain branch checkout with git operations
in a single command:
```bash
git checkout track-b && git add <file> && git commit -m "..."
```

### 6. Recharts range-bar technique (reusable pattern)
The "invisible base + visible range" stacking trick used in `SalaryChart`
is the standard Recharts approach for range/waterfall bars:
```jsx
<Bar dataKey="base"  stackId="x" fill="transparent" />  {/* offset */}
<Bar dataKey="range" stackId="x" fill="#4f46e5" />       {/* visible */}
```
`base = min`, `range = max - min`.

---

## Files delivered by Track B

| File | Status |
|---|---|
| `src/analysis/salary.js` | ✅ Implemented |
| `src/analysis/location.js` | ✅ Implemented |
| `src/components/SalaryChart.jsx` | ✅ Created |
| `src/components/LocationBreakdown.jsx` | ✅ Created |
| `src/App.jsx` | ✅ Updated (salary + location panels live) |
| `src/App.css` | ✅ Updated (salary stat chips, location layout, error state) |
