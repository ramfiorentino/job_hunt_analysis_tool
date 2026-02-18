import 'dotenv/config'
import express from 'express'
import { initAuth, getJobs, getSkills } from './sheets.js'

const app = express()
const PORT = 3001

app.use(express.json())

// Initialize Google Sheets auth before accepting requests
await initAuth()

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await getJobs()
    res.json(jobs)
  } catch (err) {
    console.error('/api/jobs error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await getSkills()
    res.json(skills)
  } catch (err) {
    console.error('/api/skills error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Job Lens server running on http://localhost:${PORT}`)
})
