# exploration.md
## Project Handoff Document — Job Offerings Analyzer
> Generated via OpenSpec Exploration Phase  
> Date: 2026-02-17  
> Intended reader: AI Agent (Claude Code) continuing this project on another device

---

## 1. What This Document Is

This file is the output of a structured exploration session conducted in Claude.ai using the OpenSpec Spec-Driven Development (SDD) methodology. It captures the full project context, goals, decisions, and next steps so that a new AI agent — specifically Claude Code — can read this file and immediately continue working on the project without needing to re-ask any foundational questions.

The human collaborator on this project is a **frontend developer transitioning to full stack**, working solo on a personal tool. They are comfortable with code and will work alongside Claude Code on a MacBook.

---

## 2. OpenSpec Context

### What is OpenSpec?
OpenSpec is a lightweight Spec-Driven Development (SDD) framework for AI coding assistants. Its core principle is: **agree on what to build before any code is written**. Instead of relying on chat history (which resets and loses context), OpenSpec externalizes all planning into versioned Markdown files that live inside the repository — making context persistent, auditable, and shareable across sessions and devices.

### The OpenSpec Workflow (for this project)
The standard OpenSpec lifecycle is:
1. **Propose** — define a change in `openspec/changes/<change-name>/proposal.md`
2. **Align** — review and refine with the AI until the proposal is agreed upon
3. **Implement** — AI executes the tasks described in `tasks.md`
4. **Archive** — completed change is merged into `openspec/specs/` as the source of truth

### Relevant Commands (Claude Code)
```
/opsx:onboard       — initialize OpenSpec in the project
/opsx:new <name>    — create a new change folder
/opsx:ff            — fast-forward: generate proposal.md, specs/, design.md, tasks.md
/opsx:apply         — begin implementation
/opsx:archive       — archive completed change into specs source of truth
```

### Installation
```bash
npm install -g @fission-ai/openspec
# then inside the project folder:
opsx init
```
> Requires Node.js 20.19.0 or higher.

### Philosophy Reminders
- Fluid, not rigid — no strict phase gates
- Iterative, not waterfall
- Brownfield-friendly (works on existing projects)
- Specs live in the repo, not in chat history
- Use high-reasoning models (Claude Opus 4.5 recommended for planning)

---

## 3. Project Overview

### Name (working title)
**Job Lens** *(placeholder — can be renamed)*

### One-Line Description
A personal local web dashboard that connects to a Google Spreadsheet of job listings and surfaces patterns: keyword frequency, salary trends, skill gaps, and more.

### Problem Being Solved
The user manually pastes job listings into a Google Spreadsheet and currently has no way to systematically analyze patterns across those listings — most common required skills, salary ranges, location/remote trends, or how their own skillset compares to market demand.

### Who Uses It
**Only the owner/developer** — this is a personal productivity tool. No authentication, no multi-user features, no deployment needed. It runs locally on a MacBook.

> Future consideration: the user acknowledged it could evolve into something shareable, but that is explicitly out of scope for now.

---

## 4. Data Sources

### Primary Data Source — Google Spreadsheet
- One Google Spreadsheet with **multiple tabs**
- **Tab 1: Job Listings** — contains manually pasted job offerings with the following columns (at minimum):
  - Job Title
  - Link / URL to the offering
  - Salary (range or number)
  - Location
  - Keywords / required skills
  - Additional columns may exist (user noted "and more")
- **Tab 2: My Skills** — a manually maintained list of the user's own skills, used as the baseline for skill gap analysis

### Language
All job listings are in **English only**.

### Data Entry Method
Jobs are **pasted manually** by the user into the spreadsheet. The tool does **not** need to scrape or capture job listings from external sources — that is out of scope.

---

## 5. Google Sheets Integration

### Chosen Approach: Google Sheets API (OAuth)
After evaluating options, the Google Sheets API was selected over CSV export because:
- The tool can always read **live, up-to-date data** without manual exports
- The user is developer-comfortable and can set up OAuth credentials once
- It fits naturally with the Node.js stack

### Setup Requirements
- Google Cloud Console project
- Google Sheets API enabled
- OAuth 2.0 credentials (`credentials.json`)
- Scopes needed: `https://www.googleapis.com/auth/spreadsheets.readonly`
- Auth token stored locally (`token.json`) — generated on first run via browser OAuth flow

### Recommended Library
```bash
npm install googleapis
```

### Key Data to Read
- Spreadsheet ID (extracted from the Google Sheets URL)
- Sheet name / tab for job listings
- Sheet name / tab for user skills

> **Action for the user before Claude Code starts implementation:** Have the Google Spreadsheet URL and tab names ready. Claude Code will walk through OAuth credential setup step by step.

---

## 6. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Backend / Data layer | Node.js + JavaScript | User's preference, comfortable with JS |
| Google Sheets integration | `googleapis` npm package | Official Google client library |
| Frontend / Dashboard | React (local, via Vite) | Best fit for interactive charts and component-based views |
| Charting | Recharts or Chart.js | Lightweight, React-compatible |
| Local server | Vite dev server | Simple local-only setup, no deployment needed |
| Package manager | npm | Default, no special requirements |

> Note: No database is needed. The Google Spreadsheet IS the database. The tool reads from it on demand.

---

## 7. Core Features & Analysis Modules

### Priority 1 — Keyword Frequency Chart
- Extract all keywords/skills from the Keywords column across all job listings
- Normalize and count occurrences (e.g. "React", "ReactJS", "React.js" should ideally collapse)
- Display as a **horizontal bar chart** sorted by frequency (most common at top)
- Goal: quickly see what the market is asking for most

### Priority 2 — Skill Gap Heatmap
- Compare the keyword frequency data (market demand) against the user's personal skills list (Tab 2)
- Display as a **heatmap or visual matrix**:
  - Skills the user HAS that are in high demand → green (strength)
  - Skills in high demand that the user LACKS → red (gap / learning opportunity)
  - Skills the user has that rarely appear → neutral (low market value currently)
- Goal: give the user a clear, visual picture of where to focus learning

### Secondary Features (in scope but lower priority)
- **Salary Range Visualization** — parse salary fields and display min/max/average ranges across listings
- **Location / Remote Breakdown** — categorize listings by on-site, hybrid, remote, and geography
- **Searchable / Filterable Jobs Table** — a clean table view of all listings with filter controls by keyword, location, salary range

### Out of Scope (for now)
- Job scraping / automatic capture from job boards
- Email or notification features
- Mobile app
- Multi-user / sharing features
- Authentication / login system
- Cloud deployment

---

## 8. Recommended Project Structure

```
job-lens/
├── openspec/
│   ├── specs/              # Source of truth specs (post-archive)
│   └── changes/            # Active and archived change proposals
├── src/
│   ├── api/
│   │   └── sheets.js       # Google Sheets API client and data fetching
│   ├── analysis/
│   │   ├── keywords.js     # Keyword extraction and frequency logic
│   │   ├── skillGap.js     # Skill gap comparison logic
│   │   ├── salary.js       # Salary parsing and stats
│   │   └── location.js     # Location/remote categorization
│   ├── components/
│   │   ├── KeywordChart.jsx
│   │   ├── SkillGapHeatmap.jsx
│   │   ├── SalaryChart.jsx
│   │   ├── LocationBreakdown.jsx
│   │   └── JobsTable.jsx
│   ├── App.jsx
│   └── main.jsx
├── credentials.json        # Google OAuth credentials (git-ignored)
├── token.json              # Local OAuth token (git-ignored)
├── .gitignore
├── package.json
├── vite.config.js
└── exploration.md          # This file
```

---

## 9. OpenSpec Change Plan (Suggested Sequence)

These are the recommended OpenSpec changes to create in order. Each becomes its own `opsx:new` change with proposal → implement → archive cycle.

### Change 1: `project-scaffold`
Set up Vite + React project, install dependencies, configure `.gitignore`, establish folder structure.

### Change 2: `google-sheets-connection`
Implement Google Sheets API OAuth flow, create `sheets.js` module that reads both the jobs tab and skills tab, verify data is accessible.

### Change 3: `keyword-frequency-chart`
Build keyword extraction logic + normalize skill names + render horizontal bar chart in dashboard.

### Change 4: `skill-gap-heatmap`
Compare keyword frequency against user's skills tab, build heatmap component with color-coded visual output.

### Change 5: `salary-visualization`
Parse salary column (handle ranges, nulls, currency symbols), display min/max/avg chart.

### Change 6: `location-breakdown`
Categorize location field into remote / hybrid / on-site / city groups, display as pie or bar chart.

### Change 7: `jobs-table`
Render all job listings in a filterable, searchable table view.

### Change 8: `dashboard-layout`
Polish the overall dashboard layout, navigation between views, visual consistency.

---

## 10. Key Decisions Log

| Decision | Choice Made | Reason |
|---|---|---|
| Who uses the tool | Solo / owner only | Personal productivity tool |
| Data entry | Manual paste into Sheets | No scraping needed |
| Sheets connection | Google Sheets API + OAuth | Live data, no CSV friction |
| Backend language | Node.js / JavaScript | User preference |
| Frontend | React + Vite (local) | Interactive charts, comfortable for frontend dev |
| Where to see results | Local web dashboard | Visual, flexible, no deployment needed |
| Top priority features | Keyword chart + Skill gap heatmap | Chosen by user |
| Skills list location | Tab in same Google Spreadsheet | Already exists there |
| Language of listings | English only | No multilingual handling needed |
| Deployment | None — local only | Personal tool, runs on MacBook |

---

## 11. What the Next AI Agent Should Do First

When Claude Code reads this file on the new device, the recommended first steps are:

1. **Read this entire document** before writing any code or creating any files.
2. **Confirm with the user** that the Google Spreadsheet is accessible and ask for:
   - The Spreadsheet URL (to extract the Spreadsheet ID)
   - The exact tab names for job listings and skills
3. **Run OpenSpec onboarding** inside the project folder:
   ```bash
   npx @fission-ai/openspec opsx:onboard
   ```
4. **Create the first OpenSpec change:**
   ```
   /opsx:new project-scaffold
   /opsx:ff
   ```
5. Review the generated proposal with the user before implementing.
6. Proceed through the Change Plan in Section 9, one change at a time.

---

## 12. User Profile (for context)

- **Role:** Frontend developer transitioning to full stack
- **Devices:** MacBook (primary dev environment), iPhone
- **AI coding tool:** Claude Code
- **Comfort level:** Can read and work with code; not purely non-technical
- **Working style:** Collaborative — wants to understand what's being built, not just receive output
- **Project motivation:** Personal job search tooling — analyzing the market to guide skill development and job targeting

---

*End of exploration.md — This document was generated as the output of the OpenSpec Exploration Phase. The project has not been scaffolded or coded yet. All decisions above were made collaboratively during the exploration conversation.*
