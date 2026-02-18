// Skill gap comparison between market demand and user skills
// WI-008 (Phase 2, Track A)

import { normalizeKeyword } from './keywords.js'

// Ordered from lowest to highest — index used as numeric proficiency score
export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

// Skills with demand count >= this fraction of the max are considered "high demand"
const HIGH_DEMAND_FRACTION = 0.33

function highDemandThreshold(keywordFrequencies) {
  if (!keywordFrequencies.length) return Infinity
  return keywordFrequencies[0].count * HIGH_DEMAND_FRACTION
}

export function analyzeSkillGaps(keywordFrequencies, userSkills) {
  if (!keywordFrequencies.length && !userSkills.length) {
    return { strengths: [], gaps: [], lowDemand: [] }
  }

  const threshold = highDemandThreshold(keywordFrequencies)

  // Build lookup: normalized skill name → proficiency string
  const userSkillMap = {}
  for (const skill of userSkills) {
    const name = skill['Skill'] || ''
    const normalized = normalizeKeyword(name)
    if (normalized) {
      userSkillMap[normalized] = skill['Proficiency'] || 'Beginner'
    }
  }

  const strengths = []
  const gaps = []
  const lowDemand = []
  const seenKeywords = new Set()

  for (const { keyword, count } of keywordFrequencies) {
    seenKeywords.add(keyword)
    const proficiency = userSkillMap[keyword] ?? null
    const isHighDemand = count >= threshold

    if (proficiency !== null) {
      if (isHighDemand) {
        strengths.push({ keyword, count, proficiency })
      } else {
        lowDemand.push({ keyword, count, proficiency })
      }
    } else if (isHighDemand) {
      gaps.push({ keyword, count, proficiency: null })
    }
    // Low-demand skills the user doesn't have → not surfaced (not actionable)
  }

  // User skills not appearing in any job keyword → bucket as low-demand
  for (const [normalized, proficiency] of Object.entries(userSkillMap)) {
    if (!seenKeywords.has(normalized)) {
      lowDemand.push({ keyword: normalized, count: 0, proficiency })
    }
  }

  return { strengths, gaps, lowDemand }
}
