import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

// Colours for the remote-status pie
const REMOTE_COLORS = {
  Remote: '#4f46e5',   // indigo
  Hybrid: '#f59e0b',   // amber
  'On-site': '#10b981', // emerald
}
const FALLBACK_COLORS = ['#6366f1', '#fb923c', '#34d399', '#818cf8', '#fcd34d']

function remoteColor(name, index) {
  return REMOTE_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      padding: '6px 12px',
      borderRadius: 6,
      fontSize: 13,
    }}>
      <strong>{name}</strong>: {value}
    </div>
  )
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function LocationBreakdown({ locationData }) {
  if (!locationData) {
    return <p className="panel__placeholder">Loading…</p>
  }

  const { remoteBreakdown, cityBreakdown } = locationData

  const hasRemote = remoteBreakdown.length > 0
  const hasCities = cityBreakdown.length > 0

  if (!hasRemote && !hasCities) {
    return <p className="panel__placeholder">No location data found.</p>
  }

  return (
    <div className="location-breakdown">
      {/* ── Remote status pie chart ── */}
      {hasRemote && (
        <div className="location-section">
          <h3 className="location-section__title">Remote Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={remoteBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={88}
                labelLine={false}
                label={renderCustomLabel}
                isAnimationActive={false}
              >
                {remoteBreakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={remoteColor(entry.name, i)} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                formatter={(value, entry) => (
                  <span style={{ fontSize: 12, color: '#374151' }}>
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── City / region bar chart ── */}
      {hasCities && (
        <div className="location-section">
          <h3 className="location-section__title">By Location</h3>
          <ResponsiveContainer width="100%" height={Math.max(cityBreakdown.length * 36, 100)}>
            <BarChart
              data={cityBreakdown}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 11, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={value => [`${value} listing${value !== 1 ? 's' : ''}`, 'Count']}
                contentStyle={{ fontSize: 13, borderRadius: 6 }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
