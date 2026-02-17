## ADDED Requirements

### Requirement: Keyword extraction from structured field
The system SHALL extract keywords from the Keywords column of each job listing by splitting on commas and trimming whitespace.

#### Scenario: Keywords extracted from listing
- **WHEN** a job listing has Keywords value "React, Node.js, AWS"
- **THEN** the system extracts three keywords: "react", "node.js", "aws"

### Requirement: Keyword normalization
The system SHALL normalize keywords to handle common variations: lowercase, trim whitespace, and collapse known variants (e.g., "React", "ReactJS", "React.js" all become "react").

#### Scenario: Variants collapsed
- **WHEN** three listings contain "React", "ReactJS", and "React.js" respectively
- **THEN** the frequency count shows "react" with a count of 3

### Requirement: Keyword frequency counting
The system SHALL count the occurrence of each normalized keyword across all job listings and sort by frequency (highest first).

#### Scenario: Frequency calculated across listings
- **WHEN** 30 job listings are loaded and keywords extracted
- **THEN** each unique keyword has a count representing how many listings mention it

### Requirement: Keyword frequency horizontal bar chart
The system SHALL display keyword frequencies as a horizontal bar chart using Recharts, sorted with the most common keyword at the top.

#### Scenario: Chart renders with data
- **WHEN** the dashboard loads and job data is available
- **THEN** a horizontal bar chart displays keywords on the Y-axis and frequency counts on the X-axis, sorted descending
