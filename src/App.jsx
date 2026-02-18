import { useState, useEffect } from 'react'
import './App.css'
import { fetchJobs } from './api/client'
import { analyzeSalaries } from './analysis/salary'
import { analyzeLocations } from './analysis/location'
import SalaryChart from './components/SalaryChart'
import LocationBreakdown from './components/LocationBreakdown'
import JobsTable from './components/JobsTable'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchJobs()
        setJobs(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const salaryStats = analyzeSalaries(jobs)
  const locationData = analyzeLocations(jobs)

  return (
    <div className="app">
      <header className="header">
        <h1>Job Lens</h1>
        <p className="header__subtitle">Your personal job market dashboard</p>
      </header>

      <main className="dashboard">
        <section className="panel">
          <h2 className="panel__title">Keyword Frequency</h2>
          <p className="panel__placeholder">Chart — coming in Phase 2 (Track A)</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Skill Gap</h2>
          <p className="panel__placeholder">Heatmap — coming in Phase 2 (Track A)</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Salary Distribution</h2>
          {loading && <p className="panel__placeholder">Loading…</p>}
          {error && <p className="panel__error">Error: {error}</p>}
          {!loading && !error && <SalaryChart stats={salaryStats} />}
        </section>

        <section className="panel">
          <h2 className="panel__title">Location &amp; Remote</h2>
          {loading && <p className="panel__placeholder">Loading…</p>}
          {error && <p className="panel__error">Error: {error}</p>}
          {!loading && !error && <LocationBreakdown locationData={locationData} />}
        </section>

        <section className="panel panel--wide">
          <h2 className="panel__title">Job Listings</h2>
          {loading && <p className="panel__placeholder">Loading…</p>}
          {error && <p className="panel__error">Error: {error}</p>}
          {!loading && !error && <JobsTable jobs={jobs} />}
        </section>
      </main>
    </div>
  )
}

export default App
