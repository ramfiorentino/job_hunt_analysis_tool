// Salary parsing and statistics (all values EUR)
// parseSalary() is a standalone export — reused by Track C (WI-015) for the salary filter.

/**
 * Parse a single amount token (e.g. "80k", "100,000", "90000").
 * Returns the numeric value in EUR, or null if unparseable.
 */
function parseAmount(raw) {
  const s = raw
    .replace(/[€$£]/g, '')       // strip currency symbols
    .replace(/\s/g, '')           // strip whitespace
    .replace(/\/(yr|year|annum)/gi, '') // strip /yr /year /annum
    .replace(/,/g, '')            // remove thousand separators
    .trim()

  // "80k" / "80K" / "80.5k"
  const kMatch = s.match(/^(\d+(?:\.\d+)?)k$/i)
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000)

  // plain integer or decimal
  if (/^\d+(?:\.\d+)?$/.test(s)) return Math.round(parseFloat(s))

  return null
}

/**
 * Parse a raw salary string from a job listing.
 * All values are assumed to be in EUR.
 *
 * Handles:
 *   "€80k-€100k"       → { min: 80000, max: 100000 }
 *   "80,000-100,000"   → { min: 80000, max: 100000 }
 *   "€90,000"          → { min: 90000, max: 90000 }
 *   "90K/yr"           → { min: 90000, max: 90000 }
 *   "Competitive" / "" → null
 *
 * @param {string} salaryString
 * @returns {{ min: number, max: number } | null}
 */
export function parseSalary(salaryString) {
  if (!salaryString || typeof salaryString !== 'string') return null
  const trimmed = salaryString.trim()
  if (!trimmed) return null

  // Replace currency symbols with a space so dashes aren't obscured
  const stripped = trimmed.replace(/[€$£]/g, ' ').trim()

  // Attempt range parse: look for a dash separating two value-like tokens.
  // Non-greedy first group ensures we split at the FIRST valid dash.
  const rangeMatch = stripped.match(/^(.+?)\s*-\s*(.+)$/)
  if (rangeMatch) {
    const min = parseAmount(rangeMatch[1])
    const max = parseAmount(rangeMatch[2])
    if (min !== null && max !== null && min <= max) {
      return { min, max }
    }
  }

  // Single value
  const single = parseAmount(stripped)
  if (single !== null) return { min: single, max: single }

  return null
}

/**
 * Analyse salary data across all job listings.
 *
 * @param {object[]} jobs — array of job objects from /api/jobs
 * @returns {{
 *   min: number|null,
 *   max: number|null,
 *   average: number|null,
 *   median: number|null,
 *   data: Array<{ title: string, min: number, max: number, midpoint: number }>
 * }}
 */
export function analyzeSalaries(jobs) {
  const parsed = []

  for (const job of jobs) {
    const result = parseSalary(job['Salary'])
    if (result) {
      parsed.push({
        title: job['Job Title'] || 'Unknown',
        min: result.min,
        max: result.max,
        midpoint: Math.round((result.min + result.max) / 2),
      })
    }
  }

  if (parsed.length === 0) {
    return { min: null, max: null, average: null, median: null, data: [] }
  }

  // Sort by midpoint ascending for the chart
  parsed.sort((a, b) => a.midpoint - b.midpoint)

  const midpoints = parsed.map(p => p.midpoint)
  const sum = midpoints.reduce((acc, v) => acc + v, 0)
  const average = Math.round(sum / midpoints.length)

  const sorted = [...midpoints].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 0
      ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
      : sorted[mid]

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    average,
    median,
    data: parsed,
  }
}
