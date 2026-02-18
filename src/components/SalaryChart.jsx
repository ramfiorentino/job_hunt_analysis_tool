import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

function formatEur(value) {
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`
  return `€${value}`
}

function SalaryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      padding: '8px 12px',
      borderRadius: 6,
      fontSize: 13,
      lineHeight: 1.6,
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4, color: '#111827' }}>{d.name}</p>
      <p style={{ color: '#6b7280' }}>Min: <strong style={{ color: '#374151' }}>{formatEur(d.rawMin)}</strong></p>
      {d.rawMax !== d.rawMin && (
        <p style={{ color: '#6b7280' }}>Max: <strong style={{ color: '#374151' }}>{formatEur(d.rawMax)}</strong></p>
      )}
      <p style={{ color: '#6b7280' }}>Midpoint: <strong style={{ color: '#4f46e5' }}>{formatEur(d.midpoint)}</strong></p>
    </div>
  )
}

export default function SalaryChart({ stats }) {
  if (!stats || stats.data.length === 0) {
    return <p className="panel__placeholder">No parseable salary data found.</p>
  }

  const chartData = stats.data.map(d => ({
    name: d.title.length > 28 ? d.title.slice(0, 28) + '…' : d.title,
    base: d.min,
    range: d.max - d.min || 1, // guard: zero-width bar still renders
    rawMin: d.min,
    rawMax: d.max,
    midpoint: d.midpoint,
  }))

  const chartHeight = Math.max(chartData.length * 40, 120)

  return (
    <div>
      {/* Summary stats row */}
      <div className="salary-stats">
        {[
          { label: 'Min',    value: stats.min    },
          { label: 'Avg',    value: stats.average },
          { label: 'Median', value: stats.median  },
          { label: 'Max',    value: stats.max    },
        ].map(({ label, value }) => (
          <div key={label} className="salary-stat">
            <span className="salary-stat__label">{label}</span>
            <span className="salary-stat__value">{formatEur(value)}</span>
          </div>
        ))}
        <div className="salary-stat salary-stat--muted">
          <span className="salary-stat__label">Listings</span>
          <span className="salary-stat__value">{stats.data.length}</span>
        </div>
      </div>

      {/* Range bar chart: stacked invisible base + colored range */}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 48, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
          <XAxis
            type="number"
            tickFormatter={formatEur}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={175}
            tick={{ fontSize: 11, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<SalaryTooltip />} cursor={{ fill: '#f9fafb' }} />

          {/* Invisible spacer bar so the visible bar starts at min, not 0 */}
          <Bar dataKey="base" stackId="sal" fill="transparent" stroke="none" isAnimationActive={false} />
          {/* Visible range bar from min to max */}
          <Bar dataKey="range" stackId="sal" fill="#4f46e5" radius={[0, 4, 4, 0]} isAnimationActive={false} />

          <ReferenceLine
            x={stats.average}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 3"
            label={{ value: 'Avg', position: 'insideTopRight', fontSize: 10, fill: '#f59e0b' }}
          />
          {stats.median !== stats.average && (
            <ReferenceLine
              x={stats.median}
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 3"
              label={{ value: 'Median', position: 'insideBottomRight', fontSize: 10, fill: '#8b5cf6' }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
