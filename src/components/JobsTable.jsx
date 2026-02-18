// WI-014: Jobs table — all listings, all columns
// WI-015: Keyword filter, text search, and salary range filter
import { useState, useEffect, useMemo } from 'react'
import { fetchJobs } from '../api/client'
import { parseSalary } from '../analysis/salary'

/** Sorted unique keyword list extracted from all jobs */
function extractAllKeywords(jobs) {
  const set = new Set()
  for (const job of jobs) {
    if (job.Keywords) {
      job.Keywords.split(',').forEach(k => {
        const t = k.trim()
        if (t) set.add(t)
      })
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

/** True if job's parsed salary midpoint is within [min, max] */
function matchesSalary(job, minVal, maxVal) {
  if (!minVal && !maxVal) return true
  const parsed = parseSalary(job.Salary)
  if (!parsed) return false
  const mid = (parsed.min + parsed.max) / 2
  if (minVal && mid < minVal) return false
  if (maxVal && mid > maxVal) return false
  return true
}

/** True if any field contains the search string (case-insensitive) */
function matchesSearch(job, search) {
  if (!search) return true
  const lower = search.toLowerCase()
  return Object.values(job).some(v => v && String(v).toLowerCase().includes(lower))
}

/** True if the job's Keywords column contains ALL selected keywords */
function matchesKeywords(job, selected) {
  if (selected.length === 0) return true
  if (!job.Keywords) return false
  const jobKws = new Set(job.Keywords.split(',').map(k => k.trim()))
  return selected.every(kw => jobKws.has(kw))
}

export default function JobsTable() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter state — WI-015
  const [search, setSearch] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')

  useEffect(() => {
    fetchJobs()
      .then(data => { setJobs(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const allKeywords = useMemo(() => extractAllKeywords(jobs), [jobs])

  const minVal = minSalary ? Number(minSalary) : null
  const maxVal = maxSalary ? Number(maxSalary) : null

  const filtered = useMemo(() =>
    jobs.filter(job =>
      matchesSearch(job, search) &&
      matchesKeywords(job, selectedKeywords) &&
      matchesSalary(job, minVal, maxVal)
    ),
    [jobs, search, selectedKeywords, minVal, maxVal]
  )

  function toggleKeyword(kw) {
    setSelectedKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    )
  }

  if (loading) return <p className="panel__placeholder">Loading…</p>
  if (error) return <p className="panel__error">Error: {error}</p>
  if (jobs.length === 0) {
    return <p className="panel__placeholder">No job listings found. Add rows to your spreadsheet.</p>
  }

  const hasActiveFilters = search || selectedKeywords.length > 0 || minSalary || maxSalary

  return (
    <div className="jobs-table-wrapper">
      {/* Filter bar — WI-015 */}
      <div className="jobs-filters">
        <input
          className="jobs-filter__search"
          type="text"
          placeholder="Search all fields…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="jobs-filter__salary">
          <input
            className="jobs-filter__salary-input"
            type="number"
            placeholder="Min (€)"
            value={minSalary}
            min="0"
            onChange={e => setMinSalary(e.target.value)}
          />
          <span className="jobs-filter__salary-sep">–</span>
          <input
            className="jobs-filter__salary-input"
            type="number"
            placeholder="Max (€)"
            value={maxSalary}
            min="0"
            onChange={e => setMaxSalary(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <button
            className="jobs-filter__clear"
            onClick={() => {
              setSearch('')
              setSelectedKeywords([])
              setMinSalary('')
              setMaxSalary('')
            }}
          >
            Clear
          </button>
        )}
      </div>

      {allKeywords.length > 0 && (
        <div className="jobs-filter__kw-section">
          <span className="jobs-filter__kw-label">Keywords:</span>
          <div className="jobs-filter__kw-list">
            {allKeywords.map(kw => (
              <button
                key={kw}
                className={`jobs-filter__kw-chip${selectedKeywords.includes(kw) ? ' jobs-filter__kw-chip--active' : ''}`}
                onClick={() => toggleKeyword(kw)}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="jobs-table__count">
        {filtered.length === jobs.length
          ? `${jobs.length} listing${jobs.length !== 1 ? 's' : ''}`
          : `${filtered.length} of ${jobs.length} listings`}
      </p>

      <div className="jobs-table-scroll">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Salary</th>
              <th>Keywords</th>
              <th>Location</th>
              <th>Remote</th>
              <th>Industry</th>
              <th>Size</th>
              <th>Priority</th>
              <th>Lead Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job, i) => (
              <tr key={i}>
                <td>
                  {job.URL ? (
                    <a href={job.URL} target="_blank" rel="noreferrer" className="jobs-table__link">
                      {job['Job Title'] || '—'}
                    </a>
                  ) : (
                    job['Job Title'] || '—'
                  )}
                </td>
                <td>{job.Company || '—'}</td>
                <td className="jobs-table__salary">{job.Salary || '—'}</td>
                <td className="jobs-table__keywords">{job.Keywords || '—'}</td>
                <td>{job.Location || '—'}</td>
                <td>{job['Remote Status'] || '—'}</td>
                <td>{job.Industry || '—'}</td>
                <td>{job['Company Size'] || '—'}</td>
                <td>{job.Priority || '—'}</td>
                <td>{job['Lead Source'] || '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="10" className="jobs-table__empty">
                  No listings match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
