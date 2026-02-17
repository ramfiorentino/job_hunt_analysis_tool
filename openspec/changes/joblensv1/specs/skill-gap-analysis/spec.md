## ADDED Requirements

### Requirement: Skill gap comparison
The system SHALL compare the keyword frequency data (market demand) against the user's skills list, matching by normalized skill name.

#### Scenario: Skill matched to market demand
- **WHEN** the keyword "react" appears in 25 listings and the user lists "React" as a skill with "Advanced" proficiency
- **THEN** the system identifies this as a matched skill with demand=25 and proficiency="Advanced"

#### Scenario: Market demand with no matching user skill
- **WHEN** the keyword "docker" appears in 20 listings and the user does not list Docker in their skills
- **THEN** the system identifies this as a skill gap

#### Scenario: User skill with low market demand
- **WHEN** the user lists "jQuery" as a skill but it appears in only 1 listing
- **THEN** the system identifies this as a low-demand skill the user has

### Requirement: Skill gap heatmap visualization
The system SHALL display the skill gap analysis as a heatmap with market demand on one axis and user proficiency on the other, color-coded to highlight gaps and strengths.

#### Scenario: Heatmap renders with color coding
- **WHEN** the dashboard loads with both job data and skills data
- **THEN** a heatmap displays where:
  - Skills the user HAS with HIGH demand appear as strengths (green)
  - Skills in HIGH demand that the user LACKS appear as gaps (red)
  - Skills the user has with LOW demand appear as neutral

### Requirement: Proficiency levels recognized
The system SHALL recognize the proficiency levels from the user's skills tab and use them to weight the heatmap visualization.

#### Scenario: Proficiency affects heatmap position
- **WHEN** the user rates "Node.js" as "Intermediate" and "React" as "Advanced"
- **THEN** the heatmap positions them at different proficiency levels even if their market demand is similar
