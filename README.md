# Job Lens

A local web dashboard that reads your job hunt data from Google Sheets and turns it into visual analysis. Track market demand, spot skill gaps, compare salaries, and filter every listing — all from a single page that updates whenever you refresh.

## What it does

| Panel | What you see |
|---|---|
| **Keyword Frequency** | Which skills appear most in your tracked listings |
| **Skill Gap** | How your skills stack up against market demand |
| **Salary Distribution** | Range bars, average, and median across listings |
| **Location & Remote** | Remote/hybrid/on-site split and city breakdown |
| **Jobs Table** | All listings with keyword, text, and salary filters |

The analysis runs entirely in your browser — the app just reads your spreadsheet and crunches the numbers locally. Nothing leaves your machine except the Google Sheets API calls.

---

## Requirements

- [Node.js](https://nodejs.org/) v20.19 or higher
- A Google account
- A Google Spreadsheet with your job data (template below)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/ramfiorentino/job_hunt_analysis_tool.git
cd job_hunt_analysis_tool
npm install
```

### 2. Set up your Google Spreadsheet

Create a new Google Spreadsheet with **two tabs**.

**Tab 1 — rename it to `Job Listings`**

Add these headers in row 1 (exact spelling matters):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Job Title | URL | Company | Salary | Contract | Keywords | Location | Remote Status | Description | Open Questions | Benefits | Industry | Company Size | Company Vibe | Latest Funding Round | Lead Source | Priority |

**Tab 2 — rename it to `Skills`**

Add these headers in row 1:

| A | B | C |
|---|---|---|
| Category | Skill | Proficiency |

**Column guide — Job Listings**

| Column | What to enter | Example |
|---|---|---|
| Job Title | Role name | Senior Frontend Developer |
| URL | Link to the posting | https://... |
| Company | Company name | Spotify |
| Salary | Any format, ideally in one currency | €80k–€100k |
| Contract | Employment type | Full-time |
| Keywords | Comma-separated skills/tech from the listing | React, Node.js, TypeScript, AWS |
| Location | City or region | Berlin |
| Remote Status | Exactly one of: `Remote`, `Hybrid`, `On-site` | Remote |
| Description | Full job description text | (paste it in) |
| Remaining columns | Personal tracking notes | Fill as you like |

**Column guide — Skills**

| Column | What to enter | Example |
|---|---|---|
| Category | Skill grouping | Frontend |
| Skill | Skill name | React |
| Proficiency | Exactly one of: `Beginner`, `Intermediate`, `Advanced` | Advanced |

> **Tip:** The more consistently you fill in the Keywords column, the more useful the analysis. Use comma-separated tech names that match how employers write them.

---

### 3. Create Google Cloud credentials

This gives the app read-only access to your spreadsheet. You do this once.

#### 3.1 Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Sign in with the Google account that owns your spreadsheet
3. Click the project dropdown → **New Project**
4. Name it anything (e.g. `Job Lens`) → **Create**

#### 3.2 Enable the Google Sheets API

1. In the left sidebar: **APIs & Services** → **Library**
2. Search for **Google Sheets API** → click it → **Enable**

#### 3.3 Configure the OAuth consent screen

1. **APIs & Services** → **OAuth consent screen**
2. User type: **External** → **Create**
3. Fill in:
   - App name: `Job Lens`
   - User support email: your email
   - Developer contact email: your email
4. **Save and Continue**
5. On the Scopes page → **Add or Remove Scopes** → search `Google Sheets API` → check `.../auth/spreadsheets.readonly` → **Update** → **Save and Continue**
6. On the Test users page → **Add Users** → add your own email → **Save and Continue**
7. **Back to Dashboard**

#### 3.4 Create OAuth credentials

1. **APIs & Services** → **Credentials**
2. **+ Create Credentials** → **OAuth client ID**
3. Application type: **Desktop app**
4. Name: anything → **Create**
5. Click **Download JSON** in the dialog that appears
6. Rename the downloaded file to `credentials.json`
7. Move it to the project root:
   ```bash
   mv ~/Downloads/client_secret_*.json /path/to/job_hunt_analysis_tool/credentials.json
   ```

---

### 4. Find your Spreadsheet ID

Open your spreadsheet in the browser. The ID is in the URL:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_IS_HERE/edit
```

Copy that long string between `/d/` and `/edit`.

---

### 5. Create your `.env` file

In the project root, create a file called `.env`:

```
SPREADSHEET_ID=paste-your-spreadsheet-id-here
JOBS_TAB_NAME=Job Listings
SKILLS_TAB_NAME=Skills
```

Replace the spreadsheet ID. If you named your tabs differently, update those values too.

---

### 6. Run the app

```bash
npm run dev
```

**First run only:** a browser window will open asking you to authorize access to your spreadsheet. Click **Allow**. A `token.json` file is saved locally — you won't be prompted again.

Then open **http://localhost:5173** in your browser.

---

## Updating your data

The dashboard reads from your spreadsheet on every page load. To see changes, just refresh the browser — no restart needed.

---

## Tips for better analysis

- **Keywords are the core input.** The skill gap and keyword frequency panels are built entirely from what you put in the Keywords column. Copy tech names directly from job descriptions.
- **Remote Status must be exact.** Use `Remote`, `Hybrid`, or `On-site` — the location chart depends on consistent values.
- **Salary format is flexible.** The parser handles ranges (`€80k–€100k`), single values (`90000`), and `k` suffixes. Blank or text-only values (e.g. `Competitive`) are gracefully excluded.
- **Skills tab is your self-assessment.** The skill gap heatmap matches your skill names against job keywords, so use similar terminology to what employers use.

---

## Project structure

```
job_hunt_analysis_tool/
├── server/
│   ├── index.js        # Express server (port 3001)
│   └── sheets.js       # Google Sheets OAuth + data fetching
├── src/
│   ├── api/client.js   # Frontend fetch wrapper
│   ├── analysis/       # Keyword, skill gap, salary, location logic
│   └── components/     # React chart and table components
├── credentials.json    # Your Google OAuth credentials (git-ignored)
├── token.json          # Auth token, created on first run (git-ignored)
└── .env                # Your spreadsheet config (git-ignored)
```

---

## Privacy

- `credentials.json`, `token.json`, and `.env` are all git-ignored — they will never be committed or shared.
- The app makes no external requests except to the Google Sheets API to read your own spreadsheet.
- All analysis runs locally in your browser.

---

## Troubleshooting

**The browser didn't open for authorization**
Copy the URL printed in the terminal and open it manually.

**`/api/jobs` returns `[{}, {}]` (empty objects)**
Your Job Listings tab is missing the header row in row 1. Make sure column names are in the first row, not row 2.

**Keyword or skill gap panel is empty**
The Keywords column in your spreadsheet is blank. Add comma-separated skills to each listing row.

**Salary panel shows no data**
None of your salary values could be parsed. Make sure they follow a numeric format (e.g. `€80k`, `80000`, `€60k–€80k`). Text-only values like `Competitive` are excluded.
