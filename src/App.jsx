import { useState, useEffect } from 'react'
import './App.css'
import { fetchJobs } from './api/client'
import { analyzeSalaries } from './analysis/salary'
import SalaryChart from './components/SalaryChart'

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
          <p className="panel__placeholder">Charts — coming in WI-013</p>
        </section>

        <section className="panel panel--wide">
          <h2 className="panel__title">Job Listings</h2>
          <p className="panel__placeholder">Table with filters — coming in Phase 2 (Track C)</p>
        </section>
      </main>
    </div>
  )
}

export default App
