## 1. Project Scaffold (Phase 1)

- [ ] 1.1 Initialize Vite + React project with JavaScript template
- [ ] 1.2 Install dependencies: `recharts`, `googleapis`, `express`
- [ ] 1.3 Configure `.gitignore` to exclude `node_modules/`, `credentials.json`, `token.json`, `.DS_Store`
- [ ] 1.4 Create `server/` directory with placeholder files (`index.js`, `sheets.js`, `llm.js`)
- [ ] 1.5 Create `src/api/client.js` with placeholder fetch wrapper
- [ ] 1.6 Create `src/analysis/` placeholder modules (`keywords.js`, `skillGap.js`, `salary.js`, `location.js`)
- [ ] 1.7 Configure Vite proxy in `vite.config.js` to forward `/api/*` to Express server
- [ ] 1.8 Install `concurrently` and configure `npm run dev` to start both Vite and Express with a single command
- [ ] 1.9 Update `src/App.jsx` with "Job Lens" title and placeholder dashboard panel sections
- [ ] 1.10 Verify `npm run dev` starts both servers and renders the app shell in the browser

## 2. Google Sheets Connection (Phase 1)

- [ ] 2.1 Set up Google Cloud Console project with Sheets API enabled and create OAuth credentials
- [ ] 2.2 Implement Google Sheets OAuth flow in `server/sheets.js` (first-run browser auth, token persistence)
- [ ] 2.3 Implement `GET /api/jobs` endpoint — reads job listings tab and returns JSON array
- [ ] 2.4 Implement `GET /api/skills` endpoint — reads skills tab and returns JSON array with category, skill, proficiency
- [ ] 2.5 Add spreadsheet configuration (spreadsheet ID, tab names) via environment variables or config file
- [ ] 2.6 Add error handling for missing configuration and empty spreadsheet
- [ ] 2.7 Implement `src/api/client.js` fetch functions for `/api/jobs` and `/api/skills`
- [ ] 2.8 Verify both endpoints return correct data from the live spreadsheet

## 3. Keyword Frequency Chart (Phase 2)

- [ ] 3.1 Implement keyword extraction in `src/analysis/keywords.js` — split on commas, trim, lowercase
- [ ] 3.2 Add keyword normalization — collapse known variants (React/ReactJS/React.js → react)
- [ ] 3.3 Implement frequency counting and sort by count descending
- [ ] 3.4 Build `KeywordChart.jsx` — horizontal bar chart with Recharts (keywords on Y-axis, count on X-axis)
- [ ] 3.5 Wire up KeywordChart to live data in `App.jsx`

## 4. Skill Gap Heatmap (Phase 2)

- [ ] 4.1 Implement skill gap comparison in `src/analysis/skillGap.js` — match market keywords against user skills by normalized name
- [ ] 4.2 Categorize each skill: strength (user has + high demand), gap (user lacks + high demand), low-demand (user has + low demand)
- [ ] 4.3 Incorporate proficiency levels from skills tab into the comparison
- [ ] 4.4 Build `SkillGapHeatmap.jsx` — 2D heatmap with Recharts (demand vs proficiency, color-coded)
- [ ] 4.5 Wire up SkillGapHeatmap to live data in `App.jsx`

## 5. Salary Visualization (Phase 2)

- [ ] 5.1 Implement salary parser in `src/analysis/salary.js` — handle ranges, single values, currency symbols, "k" suffix
- [ ] 5.2 Handle unparseable values gracefully (exclude from analysis, don't crash)
- [ ] 5.3 Calculate min, max, average, and median across parseable listings
- [ ] 5.4 Build `SalaryChart.jsx` — chart showing salary distribution with min/max/average indicators
- [ ] 5.5 Wire up SalaryChart to live data in `App.jsx`

## 6. Location & Remote Breakdown (Phase 2)

- [ ] 6.1 Implement remote status categorization in `src/analysis/location.js` — classify as Remote, Hybrid, or On-site
- [ ] 6.2 Implement location grouping — extract and normalize city/region names
- [ ] 6.3 Build `LocationBreakdown.jsx` — chart for remote status distribution + chart for location groupings
- [ ] 6.4 Wire up LocationBreakdown to live data in `App.jsx`

## 7. Jobs Table with Filters (Phase 2)

- [ ] 7.1 Build `JobsTable.jsx` — table displaying all listings with columns: title, company, salary, keywords, location, remote status, link
- [ ] 7.2 Add keyword filter — dropdown or multi-select to show only listings with selected keywords
- [ ] 7.3 Add text search — filter rows where any field contains the search string
- [ ] 7.4 Add salary range filter — min/max inputs to filter by parsed salary
- [ ] 7.5 Wire up JobsTable to live data in `App.jsx`

## 8. Claude API Integration (Phase 3)

- [ ] 8.1 Install `@anthropic-ai/sdk` dependency
- [ ] 8.2 Add Anthropic API key to server configuration
- [ ] 8.3 Implement Claude API client in `server/llm.js` with description analysis prompt
- [ ] 8.4 Implement `POST /api/analyze` endpoint — accepts job descriptions, returns structured analysis
- [ ] 8.5 Implement caching layer — store LLM results keyed by description content hash, reuse on subsequent calls
- [ ] 8.6 Handle missing API key gracefully — disable LLM features without breaking Phase 2 functionality

## 9. LLM-Enhanced Insights (Phase 3)

- [ ] 9.1 Design LLM prompt for description analysis (extract skills, seniority signals, soft/hard classification, role category)
- [ ] 9.2 Build frontend function to trigger analysis for all listings and collect cached/new results
- [ ] 9.3 Build LLM insights panel — display aggregated extracted skills, role clusters, and trend summaries
- [ ] 9.4 Integrate LLM-extracted skills into the existing keyword and skill gap views as a complementary data source

## 10. Dashboard Polish (Phase 3)

- [ ] 10.1 Design and implement dashboard layout — arrange all panels in a coherent, navigable grid
- [ ] 10.2 Add navigation or tab system if panels don't fit on one screen
- [ ] 10.3 Apply visual consistency — colors, spacing, typography across all panels
- [ ] 10.4 Add loading states for data fetching and LLM analysis
- [ ] 10.5 Final verification — all panels render correctly with live data, filters work, LLM insights display
