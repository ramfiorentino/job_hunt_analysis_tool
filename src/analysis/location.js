// Location and remote status analysis

// Known city/region aliases → canonical name.
// Add more pairs here as the spreadsheet grows.
const CITY_ALIASES = {
  'nyc': 'New York',
  'new york city': 'New York',
  'sf': 'San Francisco',
  'san fran': 'San Francisco',
  'la': 'Los Angeles',
  'los angeles': 'Los Angeles',
  'london': 'London',
  'berlin': 'Berlin',
  'amsterdam': 'Amsterdam',
  'barcelona': 'Barcelona',
  'madrid': 'Madrid',
  'paris': 'Paris',
  'munich': 'Munich',
  'münchen': 'Munich',
  'zürich': 'Zurich',
  'zurich': 'Zurich',
}

/**
 * Normalise a remote-status string to one of three canonical values.
 * Falls back to the trimmed raw value if unrecognised.
 */
function normalizeRemoteStatus(raw) {
  const lower = raw.toLowerCase().trim()
  if (lower === 'remote') return 'Remote'
  if (lower === 'hybrid') return 'Hybrid'
  if (lower === 'on-site' || lower === 'onsite' || lower === 'on site' || lower === 'office') {
    return 'On-site'
  }
  // Unknown value — return capitalised as-is so it still appears in the chart
  return raw.trim()
}

/**
 * Extract a canonical city/region name from a raw location string.
 * Returns null if the field is blank.
 */
function extractCity(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return null

  // Take the first comma-separated segment (e.g. "Berlin, Germany" → "Berlin")
  const firstSegment = trimmed.split(',')[0].trim()
  const key = firstSegment.toLowerCase()

  return CITY_ALIASES[key] || toTitleCase(firstSegment)
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Analyse location and remote-status data across all job listings.
 *
 * @param {object[]} jobs — array of job objects from /api/jobs
 * @returns {{
 *   remoteBreakdown: Array<{ name: string, value: number }>,
 *   cityBreakdown:   Array<{ name: string, count: number }>
 * }}
 */
export function analyzeLocations(jobs) {
  const remoteCounts = {}
  const cityCounts = {}

  for (const job of jobs) {
    // Remote status — from dedicated "Remote Status" column
    const remoteRaw = (job['Remote Status'] || '').trim()
    if (remoteRaw) {
      const status = normalizeRemoteStatus(remoteRaw)
      remoteCounts[status] = (remoteCounts[status] || 0) + 1
    }

    // City/region — from "Location" column
    const locationRaw = (job['Location'] || '').trim()
    if (locationRaw) {
      const city = extractCity(locationRaw)
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1
      }
    }
  }

  const remoteBreakdown = Object.entries(remoteCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const cityBreakdown = Object.entries(cityCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return { remoteBreakdown, cityBreakdown }
}
