// WI-007: Keyword frequency horizontal bar chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MAX_KEYWORDS = 20

export function KeywordChart({ frequencies }) {
  if (!frequencies || frequencies.length === 0) {
    return <p className="panel__placeholder">No keyword data — add Keywords to your job listings.</p>
  }

  const data = frequencies.slice(0, MAX_KEYWORDS)

  return (
    <ResponsiveContainer width="100%" height={Math.max(300, data.length * 28)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="keyword"
          width={110}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => [value, 'Listings']}
          cursor={{ fill: 'rgba(79, 70, 229, 0.08)' }}
        />
        <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
