export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Problem = {
  number: number
  title: string
  difficulty: Difficulty
  topics: string[]
  pattern: string
  url: string
  category?: string
  solved?: boolean
  source?: 'core' | 'imp'
}

export type CodeByLanguage = {
  python: string[]
  cpp: string[]
  java: string[]
  typescript: string[]
}

export type Approach = {
  title: string
  subtitle?: string
  timeComplexity: string
  timeComplexityDetail: string
  spaceComplexity: string
  spaceComplexityDetail: string
  status: 'optimal' | 'brute' | 'better'
  leetcodeStatus: string
  explanation: string
  keySteps: string[]
  code: CodeByLanguage
}

export type DetailedProblemData = {
  optimal: Approach
  bruteForce: Approach
  alternative?: Approach
  intuition: string
  bottleneck: string
  keyInvariant: string
  edgeCases: string[]
  interviewTips: string[]
  companies: string[]
  acceptanceRate: string
  frequency: string
  constraints: string[]
  examples: {
    input: string
    output: string
    explanation: string
  }[]
  dryRunTrace?: {
    headers: string[]
    rows: string[][]
  }
}

export type LeetCodeSolution = {
  optimizedCode: string[]
  bruteCode: string[]
  optimizedExplanation?: string
  bruteExplanation?: string
}
