## ADDED Requirements

### Requirement: Salary field parsing
The system SHALL parse salary values from job listings, assuming all values are in euros (EUR). It SHALL handle common formats including ranges ("€80k-€100k", "80,000-100,000"), single values ("€90k", "90000"), and values with currency symbols or suffixes.

#### Scenario: Range parsed correctly
- **WHEN** a listing has salary "€80k-€100k"
- **THEN** the system extracts min=80000 and max=100000

#### Scenario: Single value parsed
- **WHEN** a listing has salary "€90,000"
- **THEN** the system extracts min=90000 and max=90000

#### Scenario: Unparseable salary excluded
- **WHEN** a listing has salary "Competitive" or is blank
- **THEN** the system excludes it from salary analysis without error

### Requirement: Salary statistics
The system SHALL calculate minimum, maximum, average, and median salary values across all parseable listings.

#### Scenario: Statistics calculated
- **WHEN** 20 out of 30 listings have parseable salary values
- **THEN** the system computes min, max, average, and median across those 20 listings

### Requirement: Salary visualization
The system SHALL display salary data as a chart showing the distribution of salary ranges across listings.

#### Scenario: Chart renders with salary data
- **WHEN** the dashboard loads and parseable salary data exists
- **THEN** a chart displays the salary distribution with visible min/max/average indicators
