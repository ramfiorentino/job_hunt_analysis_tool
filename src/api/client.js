// Frontend API client for communicating with the Express server
// Vite proxies /api/* to http://localhost:3001

export async function fetchJobs() {
  const res = await fetch('/api/jobs')
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchSkills() {
  const res = await fetch('/api/skills')
  if (!res.ok) throw new Error(`Failed to fetch skills: ${res.status} ${res.statusText}`)
  return res.json()
}
