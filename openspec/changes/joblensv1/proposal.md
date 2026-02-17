## Why

A software developer is actively job hunting and manually curating a growing list of job listings in a Google Spreadsheet (adding and pruning weekly). The spreadsheet captures structured data (title, company, salary, keywords, location, remote status) plus full job descriptions. All listings are in English only. A second tab lists the developer's own skills, categorized and rated by proficiency.

The problem is **data without insight**. The spreadsheet grows but offers no way to systematically spot patterns — which skills dominate the market, where salary ranges cluster, how the developer's skill set compares to demand, or what deeper patterns hide in job descriptions. Career decisions (what to learn, where to apply, what salary to target) are made on gut feel instead of evidence.

Job Lens (working title — to be renamed in Phase 2) is a personal local web dashboard that connects to this spreadsheet and surfaces actionable analysis across three phases: foundational data access, structured analysis with filtering, and deep LLM-powered description analysis via the Claude API.

## What Changes

### Phase 1: Foundation
- Initialize a Vite + React project with JavaScript, Recharts, and googleapis
- Establish folder structure for API, analysis modules, and dashboard components
- Connect to Google Sheets via OAuth and read both tabs (job listings + skills)
- Protect OAuth credentials via `.gitignore`

### Phase 2: Core Analysis & Filtering
- Extract and normalize keywords from the Keywords column, display as horizontal bar chart sorted by frequency
- Compare keyword frequency against user's categorized/rated skill list, display as a skill gap heatmap (market demand × proficiency level)
- Parse salary fields (handling ranges, currencies, inconsistent formats), display min/max/average visualization
- Categorize listings by remote/hybrid/on-site and group by location, display as charts
- Render all job listings in a filterable, searchable table

### Phase 3: LLM Integration & Polish
- Integrate the Claude API for deep job description analysis
- Auto-extract skills, requirements, and signals from full description text
- Cluster similar roles, detect soft vs hard skill patterns, surface trends the structured data misses
- Cache LLM results to avoid re-processing on every refresh
- Polish dashboard layout, navigation, and visual consistency across all panels

## Capabilities

### New Capabilities
- `project-structure`: Vite + React project scaffold, folder layout, dependency configuration, and credential protection
- `app-shell`: Minimal React dashboard shell serving as the entry point for all panels
- `sheets-connection`: Google Sheets API OAuth integration, reading job listings and skills tabs
- `keyword-analysis`: Keyword extraction, normalization, and frequency visualization
- `skill-gap-analysis`: Comparison of market demand against user's categorized/rated skills with heatmap visualization
- `salary-analysis`: Salary field parsing and range/trend visualization
- `location-analysis`: Location and remote status categorization and visualization
- `jobs-table`: Filterable and searchable table view of all job listings
- `llm-analysis`: Claude API integration for deep job description analysis with caching

### Modified Capabilities
<!-- None — this is a greenfield project -->

## Business Value Analysis

### Who Benefits and How

**Primary persona: Active job-seeking developer**
A software developer maintaining a curated, growing spreadsheet of job listings they've hand-picked as relevant to their search. They invest time each week adding and pruning listings but get diminishing returns from that effort because the spreadsheet can't answer aggregate questions.

How they benefit:
- **Skill investment decisions** — instead of guessing which skills to learn next, they see exactly which skills appear most across their curated listings and where gaps exist relative to their own proficiency levels
- **Salary positioning** — they enter negotiations knowing the real range across their specific target roles, not generic industry averages
- **Application strategy** — they can filter and prioritize listings where they're already a strong match vs. ones requiring upskilling
- **Weekly compounding value** — because the list is live and growing, the analysis gets more accurate and useful over time, not less

**Future persona (out of scope): Other job seekers**
Any developer maintaining a similar spreadsheet could benefit. Not a goal for this version, but the tool's design doesn't prevent it.

### What Problem It Solves

The user does the hard work of curating relevant job listings weekly, but gets stuck at the last mile: **turning collected data into career decisions**. A spreadsheet with 20, 40, 60 rows of titles, salaries, keywords, descriptions, and locations is too dense to analyze by eye. The patterns that matter — which skills appear in 80% of listings, what salary ranges cluster around for remote vs. on-site, whether the user's strongest skills align with market demand — hide in the aggregate.

Without this tool, the spreadsheet is a filing cabinet. With it, it's an intelligence system.

### Priority Based on Value Delivered

| Capability | Value to User | Priority |
|---|---|---|
| Skill gap heatmap | Directly answers "what should I learn next?" — the highest-stakes career question | **Highest** |
| Keyword frequency | Reveals what the market actually demands, not what the user assumes | **High** |
| Sheets connection | Unlocks everything — without live data, nothing works | **High** (enabler) |
| Salary visualization | Negotiation leverage with real data from curated, relevant roles | **Medium-High** |
| Jobs table with filters | Helps target applications strategically | **Medium** |
| Location/remote breakdown | Informs geographic flexibility decisions | **Medium** |
| LLM description analysis | Surfaces insights the structured data misses — patterns in language, hidden requirements, role clustering | **High (Phase 3)** |
| Project scaffold | Zero direct value, but blocks everything | **Enabler** |
| Dashboard polish | Makes the tool pleasant to use regularly | **Low (quality of life)** |

Note: The skill gap heatmap is the most valuable feature but depends on keyword frequency, which depends on sheets connection, which depends on the scaffold. The build order follows dependency chains, not value ranking.

### What Happens If We Don't Build This

**The spreadsheet stays a filing cabinet.** The user continues:
- Scrolling through rows trying to remember which skills keep appearing
- Estimating salary ranges from the last few listings they read, not the full picture
- Making "what should I learn?" decisions based on impressions from recent browsing, not systematic evidence
- Spending more time each week curating data they can't effectively use

**The cost compounds over time.** Each new listing added to the spreadsheet makes manual analysis harder. The user's most valuable asset — a curated, relevant dataset of their target market — goes underutilized.

### Success Metrics

| Metric | How to Measure | Target |
|---|---|---|
| **Time to insight** | From opening the dashboard to understanding current market patterns | Under 30 seconds |
| **Skill gap discovery** | Number of in-demand skills the user hadn't identified as gaps before using the tool | At least 3 new gaps surfaced |
| **Decision confidence** | User can articulate target salary range and top skills to learn, backed by their own data | Qualitative — user feels informed, not guessing |
| **Weekly utility** | User opens the dashboard after adding new listings each week | Regular weekly use |
| **Data coverage** | Percentage of curated listings included in analysis | 100% — every listing in the sheet is analyzed |
| **Analysis accuracy (Phase 3)** | LLM-extracted skills match what a human would identify from the same description | >90% agreement on a spot-check of 5 listings |

## Out of Scope

- Job scraping or automatic capture from job boards — data entry is manual
- Mobile app
- Multi-user features, authentication, or sharing
- Cloud deployment — runs locally only
- Email or notification features
- Multilingual support — English listings only
- The tool assumes a specific spreadsheet structure (column names and tab names); adapting to arbitrary formats is not a goal

## Impact

- New full project: `package.json`, `vite.config.js`, `src/` directory tree
- Dependencies: `recharts`, `googleapis`, `express` (minimal backend proxy), `@anthropic-ai/sdk` (Phase 3)
- Requires Node.js 20.19.0+
- Requires Google Cloud Console project with Sheets API enabled and OAuth credentials
- Requires Anthropic API key (Phase 3 only)
- Local only — no deployment, no authentication, no multi-user concerns
