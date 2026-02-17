## ADDED Requirements

### Requirement: Remote status categorization
The system SHALL categorize each job listing as "Remote", "Hybrid", or "On-site" based on the dedicated remote status column in the spreadsheet.

#### Scenario: Remote listing
- **WHEN** a listing has its remote status column set to "Remote"
- **THEN** it is categorized as "Remote"

#### Scenario: Hybrid listing
- **WHEN** a listing has its remote status column set to "Hybrid"
- **THEN** it is categorized as "Hybrid"

#### Scenario: On-site listing
- **WHEN** a listing has its remote status column set to "On-site" or equivalent
- **THEN** it is categorized as "On-site"

### Requirement: Location grouping
The system SHALL group listings by city or region, extracting location names from the location field.

#### Scenario: Listings grouped by city
- **WHEN** 5 listings mention "New York" or "NYC" and 3 mention "San Francisco" or "SF"
- **THEN** the system groups them as "New York": 5, "San Francisco": 3

### Requirement: Location and remote visualization
The system SHALL display remote status distribution and location groupings as charts.

#### Scenario: Remote breakdown chart renders
- **WHEN** the dashboard loads with job data
- **THEN** a chart shows the proportion of Remote vs. Hybrid vs. On-site listings

#### Scenario: Location chart renders
- **WHEN** the dashboard loads with job data containing location information
- **THEN** a chart shows listings grouped by city/region
