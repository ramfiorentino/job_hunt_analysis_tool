// WI-009: Skill gap heatmap — demand tier vs proficiency level, color-coded
import { PROFICIENCY_LEVELS } from '../analysis/skillGap.js'

// Grid columns: proficiency levels + a "Not in my skills" column for gaps
const COLUMNS = ['Not Listed', ...PROFICIENCY_LEVELS]

// Demand row definitions — populated from analyzeSkillGaps output
const ROW_LABELS = {
  high: 'High Demand',
  low: 'Low / No Demand',
}

const CELL_COLORS = {
  strength: { bg: '#dcfce7', border: '#16a34a', label: '#15803d' },   // green
  gap:      { bg: '#fee2e2', border: '#dc2626', label: '#b91c1c' },   // red
  lowDemand: { bg: '#f3f4f6', border: '#d1d5db', label: '#6b7280' },  // gray
}

function Chip({ skill, category }) {
  const colors = CELL_COLORS[category]
  return (
    <span
      style={{
        display: 'inline-block',
        background: colors.bg,
        color: colors.label,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        padding: '2px 6px',
        margin: '2px',
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {skill.keyword}
      {skill.count > 0 && (
        <span style={{ opacity: 0.7, marginLeft: 4 }}>×{skill.count}</span>
      )}
    </span>
  )
}

function HeatmapCell({ skills, category }) {
  const colors = CELL_COLORS[category]
  return (
    <td
      style={{
        background: skills.length ? colors.bg : '#fafafa',
        border: `1px solid ${skills.length ? colors.border : '#e5e7eb'}`,
        padding: '8px',
        verticalAlign: 'top',
        minWidth: 120,
        minHeight: 60,
      }}
    >
      {skills.map((s, i) => (
        <Chip key={i} skill={s} category={category} />
      ))}
    </td>
  )
}

export function SkillGapHeatmap({ skillGapData }) {
  if (!skillGapData) {
    return <p className="panel__placeholder">No data available.</p>
  }

  const { strengths, gaps, lowDemand } = skillGapData

  if (!strengths.length && !gaps.length && !lowDemand.length) {
    return (
      <p className="panel__placeholder">
        No skill gap data — ensure your spreadsheet has Keywords and Skills data.
      </p>
    )
  }

  // Index skills by (demandTier, proficiency) for O(1) cell lookup
  // demandTier: 'high' | 'low'
  // proficiency: one of COLUMNS

  function buildIndex(items, demandTier, category) {
    const index = {}
    for (const col of COLUMNS) index[col] = []

    for (const item of items) {
      const col = item.proficiency ?? 'Not Listed'
      if (index[col]) {
        index[col].push({ ...item, _demandTier: demandTier, _category: category })
      }
    }
    return index
  }

  const highIndex = {
    ...buildIndex(strengths, 'high', 'strength'),
    ...buildIndex(gaps, 'high', 'gap'),
  }
  // Rebuild properly: gaps have proficiency=null → 'Not Listed', strengths have proficiency
  const highByCol = {}
  for (const col of COLUMNS) highByCol[col] = []
  for (const item of strengths) {
    const col = item.proficiency ?? 'Not Listed'
    highByCol[col] = [...(highByCol[col] || []), { ...item, _category: 'strength' }]
  }
  for (const item of gaps) {
    highByCol['Not Listed'] = [...(highByCol['Not Listed'] || []), { ...item, _category: 'gap' }]
  }

  const lowByCol = {}
  for (const col of COLUMNS) lowByCol[col] = []
  for (const item of lowDemand) {
    const col = item.proficiency ?? 'Not Listed'
    lowByCol[col] = [...(lowByCol[col] || []), { ...item, _category: 'lowDemand' }]
  }

  const legend = [
    { color: CELL_COLORS.strength, label: 'Strength — you have it, market wants it' },
    { color: CELL_COLORS.gap, label: 'Gap — market wants it, you don\'t list it' },
    { color: CELL_COLORS.lowDemand, label: 'Low demand — you have it, low market need' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        {legend.map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span
              style={{
                width: 12,
                height: 12,
                background: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: 2,
                display: 'inline-block',
              }}
            />
            <span style={{ color: '#6b7280' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap table */}
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
        <thead>
          <tr>
            <th
              style={{
                padding: '6px 8px',
                textAlign: 'left',
                color: '#374151',
                fontWeight: 600,
                fontSize: 12,
                borderBottom: '2px solid #e5e7eb',
              }}
            >
              Demand ↓ &nbsp; Proficiency →
            </th>
            {COLUMNS.map(col => (
              <th
                key={col}
                style={{
                  padding: '6px 8px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: 12,
                  borderBottom: '2px solid #e5e7eb',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* High demand row */}
          <tr>
            <td
              style={{
                padding: '8px',
                fontWeight: 600,
                color: '#374151',
                fontSize: 12,
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
                borderRight: '2px solid #e5e7eb',
              }}
            >
              {ROW_LABELS.high}
            </td>
            {COLUMNS.map(col => {
              const items = highByCol[col] || []
              const category = items[0]?._category ?? 'gap'
              return (
                <HeatmapCell
                  key={col}
                  skills={items}
                  category={items.length ? category : 'lowDemand'}
                />
              )
            })}
          </tr>

          {/* Low / no demand row */}
          <tr>
            <td
              style={{
                padding: '8px',
                fontWeight: 600,
                color: '#374151',
                fontSize: 12,
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
                borderRight: '2px solid #e5e7eb',
              }}
            >
              {ROW_LABELS.low}
            </td>
            {COLUMNS.map(col => {
              const items = lowByCol[col] || []
              return <HeatmapCell key={col} skills={items} category="lowDemand" />
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
