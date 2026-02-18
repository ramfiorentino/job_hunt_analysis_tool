## ADDED Requirements

### Requirement: Jobs table display
The system SHALL render all job listings in a table with columns for Job Title (linked to URL), Company, Salary, Keywords, Location, Remote Status, and additional columns: Industry, Company Size, Priority, Lead Source.

#### Scenario: Table renders all listings
- **WHEN** the dashboard loads with job data
- **THEN** a table displays all listings with their structured fields visible

### Requirement: Keyword filtering
The system SHALL allow the user to filter the jobs table by keyword — showing only listings that contain the selected keyword(s).

#### Scenario: Filter by single keyword
- **WHEN** the user selects "React" as a filter
- **THEN** the table shows only listings whose keywords include "React"

### Requirement: Text search
The system SHALL allow the user to search across all visible fields in the jobs table using a text input.

#### Scenario: Search matches title
- **WHEN** the user types "Senior" in the search box
- **THEN** the table shows only listings where any field contains "Senior"

### Requirement: Salary range filtering
The system SHALL allow the user to filter listings by a minimum and/or maximum salary value.

#### Scenario: Filter by minimum salary
- **WHEN** the user sets a minimum salary filter of $80,000
- **THEN** the table shows only listings with a parsed salary of $80,000 or higher
