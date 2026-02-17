## ADDED Requirements

### Requirement: Dashboard shell layout
The application SHALL render a dashboard shell with the title "Job Lens" and placeholder sections for each analysis panel (keyword chart, skill gap heatmap, salary chart, location breakdown, jobs table).

#### Scenario: App renders with panel placeholders
- **WHEN** the developer opens the local dev server URL
- **THEN** a page is displayed with the title "Job Lens" and labeled placeholder areas for each future panel

### Requirement: App entry point structure
The application SHALL use `src/main.jsx` as the Vite entry point and `src/App.jsx` as the root React component.

#### Scenario: Standard React entry point
- **WHEN** Vite builds or serves the application
- **THEN** it loads `src/main.jsx` which renders `src/App.jsx` into the DOM
