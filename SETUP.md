# Job Lens — Setup Guide

## 1. Create Your Google Spreadsheet

Two CSV templates are in `templates/`. Import them into Google Sheets:

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet
2. Rename it to "Job Lens Data" (or whatever you like)
3. The first tab is your **Job Listings** tab:
   - Rename the default "Sheet1" tab to **Job Listings** (right-click the tab name at the bottom)
   - Add these column headers in row 1:

   | A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
   | Job Title | URL | Company | Salary | Contract | Keywords | Location | Remote Status | Description | Open Questions | Benefits | Industry | Company Size | Company Vibe | Latest Funding Round | Lead Source | Priority |

4. Create a second tab (click the **+** at the bottom) and name it **Skills**
   - Add these column headers in row 1:

   | A | B | C |
   |---|---|---|
   | Category | Skill | Proficiency |

### Column Guide — Job Listings

**Columns used by analysis:**

| Column | What to put | Example |
|---|---|---|
| **Job Title** | Job title | Senior Frontend Developer |
| **URL** | Link to the job posting | https://... |
| **Company** | Company name | Spotify |
| **Salary** | Salary in EUR (any format) | €80k-€100k |
| **Keywords** | Comma-separated skills/tech | React, Node.js, TypeScript, AWS |
| **Location** | City or region | Berlin |
| **Remote Status** | One of: Remote, Hybrid, On-site | Remote |
| **Description** | Full job description text | (paste the full description) |

**Personal tracking columns (stored and displayed, not used by analysis):**

| Column | What to put | Example |
|---|---|---|
| **Contract** | Contract type | Full-time, Part-time, Freelance |
| **Open Questions** | Notes/questions about the role | What's the team size? |
| **Benefits** | Notable benefits | Stock options, 30 days PTO |
| **Industry** | Company's industry | Fintech |
| **Company Size** | Number of employees | 200-500 |
| **Company Vibe** | Your impression | Fast-paced, startup culture |
| **Latest Funding Round** | Funding stage | Series B |
| **Lead Source** | Where you found the listing | LinkedIn |
| **Priority** | Your priority level | High |

### Column Guide — Skills

| Column | What to put | Example |
|---|---|---|
| **Category** | Skill grouping | Frontend, Backend, DevOps, Soft Skills |
| **Skill** | Skill name | React |
| **Proficiency** | One of: Beginner, Intermediate, Advanced | Advanced |

### Example Data (optional, for testing)

**Job Listings** — add 2-3 rows to test with:

| Job Title | URL | Company | Salary | Keywords | Location | Remote Status | Description |
|---|---|---|---|---|---|---|---|
| Frontend Developer | https://example.com/job1 | Acme Corp | €60k-€75k | React, JavaScript, CSS | Berlin | Remote | We are looking for a frontend developer... |
| Full Stack Engineer | https://example.com/job2 | TechStart | €80k-€100k | React, Node.js, PostgreSQL, AWS | Madrid | Hybrid | Join our engineering team... |

(The remaining columns — Open Questions, Benefits, Industry, etc. — fill in as you see fit)

**Skills** — add a few of your skills:

| Category | Skill | Proficiency |
|---|---|---|
| Frontend | React | Advanced |
| Frontend | CSS | Advanced |
| Backend | Node.js | Intermediate |
| DevOps | AWS | Beginner |

---

## 2. Find Your Spreadsheet ID

Once your spreadsheet is created, look at the URL in your browser:

```
https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit#gid=0
                                       └──────────────────────────┘
                                         THIS is your Spreadsheet ID
```

It's the long string between `/d/` and `/edit`. Copy it — you'll need it later for the `.env` file.

---

## 3. Set Up Google Cloud Project

This creates the OAuth credentials that let the app read your spreadsheet.

### 3.1 Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with the same Google account that owns the spreadsheet
3. Click the project dropdown at the top left (next to "Google Cloud")
4. Click **New Project**
5. Name it **Job Lens** (or anything you like)
6. Click **Create**
7. Make sure the new project is selected in the dropdown

### 3.2 Enable the Google Sheets API

1. In the left sidebar, go to **APIs & Services** → **Library**
   (or search "Sheets API" in the top search bar)
2. Search for **Google Sheets API**
3. Click on it, then click **Enable**

### 3.3 Configure the OAuth consent screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** as user type (unless you have a Workspace account)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Job Lens
   - **User support email**: your email
   - **Developer contact email**: your email
5. Click **Save and Continue**
6. On the **Scopes** page: click **Add or Remove Scopes**
   - Search for `Google Sheets API` and check `.../auth/spreadsheets.readonly`
   - Click **Update**, then **Save and Continue**
7. On the **Test users** page: click **Add Users**
   - Add your own email address
   - Click **Save and Continue**
8. Click **Back to Dashboard**

### 3.4 Create OAuth credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Desktop app**
4. Name: **Job Lens** (or anything)
5. Click **Create**
6. A dialog appears with your client ID and secret — click **Download JSON**
7. Rename the downloaded file to **`credentials.json`**
8. Move it to the project root:
   ```bash
   mv ~/Downloads/client_secret_*.json /path/to/job_hunt_analysis_tool/credentials.json
   ```

**This file is git-ignored** — it will not be committed.

---

## 4. Create the .env File

Create a new file called `.env` in the project root (`job_hunt_analysis_tool/`). You can do this in your code editor — just create a new file, name it `.env`, and paste this content:

```
SPREADSHEET_ID=paste-your-spreadsheet-id-here
JOBS_TAB_NAME=Job Listings
SKILLS_TAB_NAME=Skills
```

Then replace `paste-your-spreadsheet-id-here` with the actual Spreadsheet ID you copied in step 2.

If you named your tabs differently in the spreadsheet, update those values to match.

**This file is git-ignored** — it will not be committed to the repository.

---

## 5. Verify

After Phase 1 implementation is complete:

```bash
npm run dev
```

1. On first run, a browser window opens asking you to authorize access — click **Allow**
2. A `token.json` file is created (also git-ignored)
3. Visit `http://localhost:5173` — the dashboard should appear
4. Visit `http://localhost:3001/api/jobs` — should return your spreadsheet data as JSON
5. Visit `http://localhost:3001/api/skills` — should return your skills as JSON

---

## Checklist

- [ ] Google Spreadsheet created with two tabs (Job Listings, Skills)
- [ ] Column headers match the expected structure
- [ ] At least 2-3 test rows added to each tab
- [ ] Spreadsheet ID copied from URL
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] OAuth consent screen configured with your email as test user
- [ ] OAuth credentials (Desktop app) created and downloaded
- [ ] `credentials.json` placed in project root
- [ ] `.env` file created with spreadsheet ID and tab names
