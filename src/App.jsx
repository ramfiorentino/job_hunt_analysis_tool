import { useState, useEffect } from 'react'
import './App.css'
import { fetchJobs, fetchSkills } from './api/client.js'
import { getKeywordFrequencies } from './analysis/keywords.js'
import { KeywordChart } from './components/KeywordChart.jsx'

function App() {
  const [jobs, setJobs] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, skillsData] = await Promise.all([fetchJobs(), fetchSkills()])
        setJobs(jobsData)
        setSkills(skillsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const keywordFrequencies = getKeywordFrequencies(jobs)

  return (
    <div className="app">
      <header className="header">
        <h1>Job Lens</h1>
        <p className="header__subtitle">Your personal job market dashboard</p>
      </header>

      <main className="dashboard">
        <section className="panel">
          <h2 className="panel__title">Keyword Frequency</h2>
          {loading ? (
            <p className="panel__placeholder">Loading…</p>
          ) : error ? (
            <p className="panel__error">{error}</p>
          ) : (
            <KeywordChart frequencies={keywordFrequencies} />
          )}
        </section>

        <section className="panel">
          <h2 className="panel__title">Skill Gap</h2>
          <p className="panel__placeholder">Heatmap — coming next</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Salary Distribution</h2>
          <p className="panel__placeholder">Chart — coming in Phase 2</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Location & Remote</h2>
          <p className="panel__placeholder">Charts — coming in Phase 2</p>
        </section>

        <section className="panel panel--wide">
          <h2 className="panel__title">Job Listings</h2>
          <p className="panel__placeholder">Table with filters — coming in Phase 2</p>
        </section>
      </main>
    </div>
  )
}

export default App
