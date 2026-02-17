## ADDED Requirements

### Requirement: Claude API integration
The system SHALL integrate with the Claude API via the `@anthropic-ai/sdk` package to analyze full job description text.

#### Scenario: API key configured
- **WHEN** the server starts with a valid Anthropic API key in configuration
- **THEN** the Claude API client is available for description analysis

#### Scenario: API key missing
- **WHEN** the server starts without an Anthropic API key
- **THEN** LLM analysis features are disabled and the dashboard shows Phase 2 features only, without error

### Requirement: Job description analysis
The system SHALL send full job description text to the Claude API and receive structured analysis including: extracted skills/requirements, seniority signals, soft vs hard skill classification, and role categorization.

#### Scenario: Description analyzed successfully
- **WHEN** the system sends a job description to the Claude API
- **THEN** it receives a structured response with extracted skills, seniority level, skill classifications, and role category

### Requirement: LLM result caching
The system SHALL cache LLM analysis results locally, keyed by a hash of the job description content. Cached results SHALL be reused on subsequent dashboard loads without re-calling the API.

#### Scenario: Cached result reused
- **WHEN** a job description has been previously analyzed and its content has not changed
- **THEN** the system uses the cached result instead of calling the Claude API

#### Scenario: New or changed description analyzed
- **WHEN** a job description is new or its content has changed since the last analysis
- **THEN** the system calls the Claude API and caches the new result

### Requirement: LLM-enhanced insights display
The system SHALL display LLM-derived insights in the dashboard, including auto-extracted skills that complement the manual keyword data, role clustering, and pattern summaries.

#### Scenario: LLM insights panel renders
- **WHEN** the dashboard loads and cached LLM analysis exists for at least some listings
- **THEN** a panel displays aggregated LLM insights (common extracted skills, role clusters, trend summaries)
