import { useState, useEffect } from 'react'
import './App.css'
import { fetchJobs, fetchSkills } from './api/client.js'
import { getKeywordFrequencies } from './analysis/keywords.js'
import { analyzeSkillGaps } from './analysis/skillGap.js'
import { analyzeSalaries } from './analysis/salary.js'
import { analyzeLocations } from './analysis/location.js'
import { KeywordChart } from './components/KeywordChart.jsx'
import { SkillGapHeatmap } from './components/SkillGapHeatmap.jsx'
import SalaryChart from './components/SalaryChart.jsx'
import LocationBreakdown from './components/LocationBreakdown.jsx'
import JobsTable from './components/JobsTable.jsx'

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
  const skillGapData = analyzeSkillGaps(keywordFrequencies, skills)
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
          {loading ? (
            <p className="panel__placeholder">Loading…</p>
          ) : error ? (
            <p className="panel__error">{error}</p>
          ) : (
            <SkillGapHeatmap skillGapData={skillGapData} />
          )}
        </section>

        <section className="panel">
          <h2 className="panel__title">Salary Distribution</h2>
          {loading ? (
            <p className="panel__placeholder">Loading…</p>
          ) : error ? (
            <p className="panel__error">{error}</p>
          ) : (
            <SalaryChart stats={salaryStats} />
          )}
        </section>

        <section className="panel">
          <h2 className="panel__title">Location & Remote</h2>
          {loading ? (
            <p className="panel__placeholder">Loading…</p>
          ) : error ? (
            <p className="panel__error">{error}</p>
          ) : (
            <LocationBreakdown locationData={locationData} />
          )}
        </section>

        <section className="panel panel--wide">
          <h2 className="panel__title">Job Listings</h2>
          <JobsTable />
        </section>
      </main>
    </div>
  )
}

export default App
