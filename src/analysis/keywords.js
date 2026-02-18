// Keyword extraction and frequency analysis
// WI-006 (Phase 2, Track A)

// Maps lowercase variants to their canonical normalized form
const VARIANT_MAP = {
  'reactjs': 'react',
  'react.js': 'react',
  'nodejs': 'node.js',
  'node': 'node.js',
  'ts': 'typescript',
  'js': 'javascript',
  'es6': 'javascript',
  'postgres': 'postgresql',
  'mongo': 'mongodb',
  'k8s': 'kubernetes',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'nextjs': 'next.js',
  'expressjs': 'express',
  'express.js': 'express',
  'graphql': 'graphql',
  'css3': 'css',
  'html5': 'html',
  'ci/cd': 'ci/cd',
  'cicd': 'ci/cd',
}

export function normalizeKeyword(keyword) {
  const lower = keyword.trim().toLowerCase()
  return VARIANT_MAP[lower] ?? lower
}

export function getKeywordFrequencies(jobs) {
  const counts = {}

  for (const job of jobs) {
    const raw = job['Keywords'] || ''
    if (!raw.trim()) continue

    for (const kw of raw.split(',')) {
      const normalized = normalizeKeyword(kw)
      if (normalized) {
        counts[normalized] = (counts[normalized] || 0) + 1
      }
    }
  }

  return Object.entries(counts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
}
