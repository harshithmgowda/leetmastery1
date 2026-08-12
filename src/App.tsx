import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Command,
  Copy,
  ExternalLink,
  Filter,
  FlaskConical,
  Hash,
  Lightbulb,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  TerminalSquare,
  X,
  Zap,
} from 'lucide-react'
import { getLeetCodeSolution, solutionsByTitle } from './leetcodeSolutions'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

type Problem = {
  number: number
  title: string
  difficulty: Difficulty
  topics: string[]
  pattern: string
  url: string
  category?: string
  solved?: boolean
}

type VisualKind = 'two-sum' | 'contains-duplicate' | 'valid-anagram' | 'group-anagrams' | 'top-k' | 'product' | 'longest-consecutive' | 'sudoku'
type VisualRow = { label: string; items: string[] }
type VisualGroup = { label: string; value: string; tone?: string }

type AnimationStep = {
  label: string
  description: string
  detail?: string
  activeIndex: number | null
  currentLine: number
  i: number | null
  num: number | null
  need: number | null
  map: Record<string, number>
  found: boolean
  answer: number[] | null
  visualKind?: VisualKind
  visualItems?: string[]
  visualRows?: VisualRow[]
  visualGroups?: VisualGroup[]
  visualHeading?: string
  visualCaption?: string
  resultText?: string
  customVariables?: Record<string, string | number>
}

type LessonData = Problem & {
  minutes: number
  introCopy: string
  statementTitle: string
  statement: string
  input: string
  output: string
  outputNote: string
  introTitle: string
  intro: string
  patternTitle: string
  patternDescription: string
  patternEquation: string
  miniSteps: [string, string][]
  optimizedTitle: string
  optimizedExplanation: string
  optimizedCode: string[]
  bruteCode: string[]
  bruteExplanation: string
  time: string
  space: string
  bruteTime: string
  bruteSpace: string
  memory: string
  steps: AnimationStep[]
}

const problems: Problem[] = [
  { number: 1, title: 'Two Sum', difficulty: 'Easy', topics: ['Arrays', 'Hashing'], pattern: 'Complement lookup', url: 'https://leetcode.com/problems/two-sum/', solved: true },
  { number: 217, title: 'Contains Duplicate', difficulty: 'Easy', topics: ['Arrays', 'Hashing'], pattern: 'Set membership', url: 'https://leetcode.com/problems/contains-duplicate/' },
  { number: 242, title: 'Valid Anagram', difficulty: 'Easy', topics: ['Arrays', 'Hashing'], pattern: 'Frequency map', url: 'https://leetcode.com/problems/valid-anagram/' },
  { number: 49, title: 'Group Anagrams', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Frequency map', url: 'https://leetcode.com/problems/group-anagrams/' },
  { number: 347, title: 'Top K Frequent Elements', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Frequency + buckets', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { number: 238, title: 'Product of Array Except Self', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Prefix + suffix', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { number: 128, title: 'Longest Consecutive Sequence', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Set sequence', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
  { number: 36, title: 'Valid Sudoku', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Constraint sets', url: 'https://leetcode.com/problems/valid-sudoku/' },
  { number: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topics: ['Arrays'], pattern: 'Running minimum', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { number: 125, title: 'Valid Palindrome', difficulty: 'Easy', topics: ['Strings', 'Two Pointer'], pattern: 'Two pointers', url: 'https://leetcode.com/problems/valid-palindrome/' },
  { number: 704, title: 'Binary Search', difficulty: 'Easy', topics: ['Binary Search'], pattern: 'Divide and conquer', url: 'https://leetcode.com/problems/binary-search/' },
  { number: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topics: ['Strings', 'Sliding Window'], pattern: 'Sliding window', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { number: 53, title: 'Maximum Subarray', difficulty: 'Medium', topics: ['Arrays'], pattern: "Kadane's algorithm", url: 'https://leetcode.com/problems/maximum-subarray/' },
  { number: 20, title: 'Valid Parentheses', difficulty: 'Easy', topics: ['Stack'], pattern: 'Stack matching', url: 'https://leetcode.com/problems/valid-parentheses/' },
  { number: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Two pointers', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { number: 206, title: 'Reverse Linked List', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Pointer reversal', url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { number: 141, title: 'Linked List Cycle', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Fast and slow pointers', url: 'https://leetcode.com/problems/linked-list-cycle/' },
  { number: 104, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Recursive DFS', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { number: 226, title: 'Invert Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Recursive swap', url: 'https://leetcode.com/problems/invert-binary-tree/' },
  { number: 200, title: 'Number of Islands', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Grid traversal', url: 'https://leetcode.com/problems/number-of-islands/' },
]

type RoadmapSeed = [title: string, url: string, category: string, pattern: string, difficulty: Difficulty]

const roadmapSeed: RoadmapSeed[] = [
  ['Best Time to Buy and Sell Stock', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'One-Pass Arrays', 'Running minimum', 'Easy'],
  ['Maximum Subarray', 'https://leetcode.com/problems/maximum-subarray/', 'One-Pass Arrays', "Kadane's algorithm", 'Medium'],
  ['Rotate Array', 'https://leetcode.com/problems/rotate-array/', 'One-Pass Arrays', 'In-place reversal', 'Medium'],
  ['Missing Number', 'https://leetcode.com/problems/missing-number/', 'One-Pass Arrays', 'XOR / arithmetic', 'Easy'],
  ['Single Number', 'https://leetcode.com/problems/single-number/', 'One-Pass Arrays', 'XOR cancellation', 'Easy'],
  ['Majority Element', 'https://leetcode.com/problems/majority-element/', 'One-Pass Arrays', 'Boyer-Moore voting', 'Easy'],
  ['Valid Palindrome', 'https://leetcode.com/problems/valid-palindrome/', 'Two Pointers', 'Two pointers', 'Easy'],
  ['Two Sum II - Input Array Is Sorted', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', 'Two Pointers', 'Inward pointers', 'Medium'],
  ['3Sum', 'https://leetcode.com/problems/3sum/', 'Two Pointers', 'Sort + two pointers', 'Medium'],
  ['Container With Most Water', 'https://leetcode.com/problems/container-with-most-water/', 'Two Pointers', 'Greedy pointers', 'Medium'],
  ['Trapping Rain Water', 'https://leetcode.com/problems/trapping-rain-water/', 'Two Pointers', 'Left/right maxima', 'Hard'],
  ['Remove Duplicates from Sorted Array', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', 'Two Pointers', 'Slow/fast pointers', 'Easy'],
  ['Move Zeroes', 'https://leetcode.com/problems/move-zeroes/', 'Two Pointers', 'Stable compaction', 'Easy'],
  ['Longest Substring Without Repeating Characters', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'Sliding Window', 'Sliding window', 'Medium'],
  ['Longest Repeating Character Replacement', 'https://leetcode.com/problems/longest-repeating-character-replacement/', 'Sliding Window', 'Window frequency', 'Medium'],
  ['Permutation in String', 'https://leetcode.com/problems/permutation-in-string/', 'Sliding Window', 'Fixed window', 'Medium'],
  ['Find All Anagrams in a String', 'https://leetcode.com/problems/find-all-anagrams-in-a-string/', 'Sliding Window', 'Fixed frequency window', 'Medium'],
  ['Minimum Window Substring', 'https://leetcode.com/problems/minimum-window-substring/', 'Sliding Window', 'Expand/shrink window', 'Hard'],
  ['Sliding Window Maximum', 'https://leetcode.com/problems/sliding-window-maximum/', 'Sliding Window', 'Deque window', 'Hard'],
  ['Range Sum Query - Immutable', 'https://leetcode.com/problems/range-sum-query-immutable/', 'Prefix Sum', 'Prefix sums', 'Easy'],
  ['Subarray Sum Equals K', 'https://leetcode.com/problems/subarray-sum-equals-k/', 'Prefix Sum', 'Prefix sum map', 'Medium'],
  ['Contiguous Array', 'https://leetcode.com/problems/contiguous-array/', 'Prefix Sum', 'Balance prefix', 'Medium'],
  ['Subarray Sums Divisible by K', 'https://leetcode.com/problems/subarray-sums-divisible-by-k/', 'Prefix Sum', 'Remainder map', 'Medium'],
  ['Binary Search', 'https://leetcode.com/problems/binary-search/', 'Binary Search', 'Halve the search', 'Easy'],
  ['Search Insert Position', 'https://leetcode.com/problems/search-insert-position/', 'Binary Search', 'Lower bound', 'Easy'],
  ['Search in Rotated Sorted Array', 'https://leetcode.com/problems/search-in-rotated-sorted-array/', 'Binary Search', 'Sorted half', 'Medium'],
  ['Find Minimum in Rotated Sorted Array', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', 'Binary Search', 'Rotation pivot', 'Medium'],
  ['Koko Eating Bananas', 'https://leetcode.com/problems/koko-eating-bananas/', 'Binary Search', 'Binary search answer', 'Medium'],
  ['Capacity To Ship Packages Within D Days', 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', 'Binary Search', 'Feasible answer', 'Medium'],
  ['Valid Parentheses', 'https://leetcode.com/problems/valid-parentheses/', 'Stack', 'Stack matching', 'Easy'],
  ['Min Stack', 'https://leetcode.com/problems/min-stack/', 'Stack', 'Stack with minimum', 'Medium'],
  ['Evaluate Reverse Polish Notation', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', 'Stack', 'Operand stack', 'Medium'],
  ['Asteroid Collision', 'https://leetcode.com/problems/asteroid-collision/', 'Stack', 'Resolve collisions', 'Medium'],
  ['Daily Temperatures', 'https://leetcode.com/problems/daily-temperatures/', 'Monotonic Stack', 'Next greater value', 'Medium'],
  ['Next Greater Element I', 'https://leetcode.com/problems/next-greater-element-i/', 'Monotonic Stack', 'Decreasing stack', 'Easy'],
  ['Car Fleet', 'https://leetcode.com/problems/car-fleet/', 'Monotonic Stack', 'Arrival times', 'Medium'],
  ['Reverse Linked List', 'https://leetcode.com/problems/reverse-linked-list/', 'Linked List', 'Pointer reversal', 'Easy'],
  ['Merge Two Sorted Lists', 'https://leetcode.com/problems/merge-two-sorted-lists/', 'Linked List', 'Two pointers', 'Easy'],
  ['Linked List Cycle', 'https://leetcode.com/problems/linked-list-cycle/', 'Linked List', 'Fast/slow pointers', 'Easy'],
  ['Linked List Cycle II', 'https://leetcode.com/problems/linked-list-cycle-ii/', 'Linked List', 'Cycle entry', 'Medium'],
  ['Remove Nth Node From End of List', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', 'Linked List', 'Gap pointers', 'Medium'],
  ['Reorder List', 'https://leetcode.com/problems/reorder-list/', 'Linked List', 'Split/reverse/merge', 'Medium'],
  ['Copy List with Random Pointer', 'https://leetcode.com/problems/copy-list-with-random-pointer/', 'Linked List', 'Node mapping', 'Medium'],
  ['Merge Intervals', 'https://leetcode.com/problems/merge-intervals/', 'Intervals', 'Sort and merge', 'Medium'],
  ['Insert Interval', 'https://leetcode.com/problems/insert-interval/', 'Intervals', 'Insert and merge', 'Medium'],
  ['Non-overlapping Intervals', 'https://leetcode.com/problems/non-overlapping-intervals/', 'Intervals', 'Greedy endpoints', 'Medium'],
  ['Minimum Number of Arrows to Burst Balloons', 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', 'Intervals', 'Overlap greedy', 'Medium'],
  ['Interval List Intersections', 'https://leetcode.com/problems/interval-list-intersections/', 'Intervals', 'Two interval pointers', 'Medium'],
  ['Remove Covered Intervals', 'https://leetcode.com/problems/remove-covered-intervals/', 'Intervals', 'Boundary scan', 'Medium'],
  ['Kth Largest Element in an Array', 'https://leetcode.com/problems/kth-largest-element-in-an-array/', 'Heap / Priority Queue', 'Min heap of k', 'Medium'],
  ['K Closest Points to Origin', 'https://leetcode.com/problems/k-closest-points-to-origin/', 'Heap / Priority Queue', 'Max heap of k', 'Medium'],
  ['Kth Largest Element in a Stream', 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', 'Heap / Priority Queue', 'Streaming heap', 'Easy'],
  ['Find Median from Data Stream', 'https://leetcode.com/problems/find-median-from-data-stream/', 'Heap / Priority Queue', 'Two heaps', 'Hard'],
  ['Merge k Sorted Lists', 'https://leetcode.com/problems/merge-k-sorted-lists/', 'Heap / Priority Queue', 'Heap merge', 'Hard'],
  ['Maximum Depth of Binary Tree', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 'Trees - DFS/BFS', 'Recursive DFS', 'Easy'],
  ['Same Tree', 'https://leetcode.com/problems/same-tree/', 'Trees - DFS/BFS', 'Parallel DFS', 'Easy'],
  ['Invert Binary Tree', 'https://leetcode.com/problems/invert-binary-tree/', 'Trees - DFS/BFS', 'Recursive swap', 'Easy'],
  ['Diameter of Binary Tree', 'https://leetcode.com/problems/diameter-of-binary-tree/', 'Trees - DFS/BFS', 'Postorder height', 'Easy'],
  ['Balanced Binary Tree', 'https://leetcode.com/problems/balanced-binary-tree/', 'Trees - DFS/BFS', 'Height check', 'Easy'],
  ['Binary Tree Level Order Traversal', 'https://leetcode.com/problems/binary-tree-level-order-traversal/', 'Trees - DFS/BFS', 'Queue by level', 'Medium'],
  ['Binary Tree Right Side View', 'https://leetcode.com/problems/binary-tree-right-side-view/', 'Trees - DFS/BFS', 'Rightmost per level', 'Medium'],
  ['Construct Binary Tree from Preorder and Inorder Traversal', 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', 'Trees - DFS/BFS', 'Recursive split', 'Medium'],
  ['Lowest Common Ancestor of a Binary Tree', 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', 'Trees - DFS/BFS', 'Postorder search', 'Medium'],
  ['Validate Binary Search Tree', 'https://leetcode.com/problems/validate-binary-search-tree/', 'Trees - DFS/BFS', 'Bounds DFS', 'Medium'],
  ['Kth Smallest Element in a BST', 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', 'Trees - DFS/BFS', 'Inorder traversal', 'Medium'],
  ['Number of Islands', 'https://leetcode.com/problems/number-of-islands/', 'Graphs - DFS/BFS', 'Grid traversal', 'Medium'],
  ['Max Area of Island', 'https://leetcode.com/problems/max-area-of-island/', 'Graphs - DFS/BFS', 'Grid component size', 'Medium'],
  ['Clone Graph', 'https://leetcode.com/problems/clone-graph/', 'Graphs - DFS/BFS', 'Graph mapping', 'Medium'],
  ['Rotting Oranges', 'https://leetcode.com/problems/rotting-oranges/', 'Graphs - DFS/BFS', 'Multi-source BFS', 'Medium'],
  ['Pacific Atlantic Water Flow', 'https://leetcode.com/problems/pacific-atlantic-water-flow/', 'Graphs - DFS/BFS', 'Reverse reachability', 'Medium'],
  ['Word Ladder', 'https://leetcode.com/problems/word-ladder/', 'Graphs - DFS/BFS', 'BFS transformations', 'Hard'],
  ['Open the Lock', 'https://leetcode.com/problems/open-the-lock/', 'Graphs - DFS/BFS', 'State BFS', 'Medium'],
  ['Cheapest Flights Within K Stops', 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', 'Graphs - DFS/BFS', 'Bounded relaxation', 'Medium'],
  ['Snakes and Ladders', 'https://leetcode.com/problems/snakes-and-ladders/', 'Graphs - DFS/BFS', 'Board BFS', 'Medium'],
  ['Course Schedule', 'https://leetcode.com/problems/course-schedule/', 'Topological Sort', 'Cycle detection', 'Medium'],
  ['Course Schedule II', 'https://leetcode.com/problems/course-schedule-ii/', 'Topological Sort', 'Indegree queue', 'Medium'],
  ['Redundant Connection', 'https://leetcode.com/problems/redundant-connection/', 'Union-Find', 'Disjoint sets', 'Medium'],
  ['Accounts Merge', 'https://leetcode.com/problems/accounts-merge/', 'Union-Find', 'Connected accounts', 'Medium'],
  ['Number of Provinces', 'https://leetcode.com/problems/number-of-provinces/', 'Union-Find', 'Component count', 'Medium'],
  ['Surrounded Regions', 'https://leetcode.com/problems/surrounded-regions/', 'Union-Find', 'Boundary components', 'Medium'],
  ['Find if Path Exists in Graph', 'https://leetcode.com/problems/find-if-path-exists-in-graph/', 'Union-Find', 'Connectivity check', 'Easy'],
  ['Subsets', 'https://leetcode.com/problems/subsets/', 'Backtracking', 'Choose or skip', 'Medium'],
  ['Subsets II', 'https://leetcode.com/problems/subsets-ii/', 'Backtracking', 'Skip duplicates', 'Medium'],
  ['Permutations', 'https://leetcode.com/problems/permutations/', 'Backtracking', 'Decision tree', 'Medium'],
  ['Combination Sum', 'https://leetcode.com/problems/combination-sum/', 'Backtracking', 'Reuse choices', 'Medium'],
  ['Combination Sum II', 'https://leetcode.com/problems/combination-sum-ii/', 'Backtracking', 'Unique choices', 'Medium'],
  ['Word Search', 'https://leetcode.com/problems/word-search/', 'Backtracking', 'Grid backtrack', 'Medium'],
  ['Letter Combinations of a Phone Number', 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', 'Backtracking', 'Choice expansion', 'Medium'],
  ['Jump Game', 'https://leetcode.com/problems/jump-game/', 'Greedy', 'Farthest reach', 'Medium'],
  ['Jump Game II', 'https://leetcode.com/problems/jump-game-ii/', 'Greedy', 'Layered reach', 'Medium'],
  ['Best Time to Buy and Sell Stock II', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', 'Greedy', 'Capture gains', 'Medium'],
  ['Gas Station', 'https://leetcode.com/problems/gas-station/', 'Greedy', 'Reset start', 'Medium'],
  ['Partition Labels', 'https://leetcode.com/problems/partition-labels/', 'Greedy', 'Last occurrence', 'Medium'],
  ['Queue Reconstruction by Height', 'https://leetcode.com/problems/queue-reconstruction-by-height/', 'Greedy', 'Sort and insert', 'Medium'],
  ['Climbing Stairs', 'https://leetcode.com/problems/climbing-stairs/', 'Dynamic Programming - 1D', 'Previous two states', 'Easy'],
  ['House Robber', 'https://leetcode.com/problems/house-robber/', 'Dynamic Programming - 1D', 'Take or skip', 'Medium'],
  ['House Robber II', 'https://leetcode.com/problems/house-robber-ii/', 'Dynamic Programming - 1D', 'Two ranges', 'Medium'],
  ['Coin Change', 'https://leetcode.com/problems/coin-change/', 'Dynamic Programming - 1D', 'Minimum state', 'Medium'],
  ['Longest Increasing Subsequence', 'https://leetcode.com/problems/longest-increasing-subsequence/', 'Dynamic Programming - 1D', 'Best ending length', 'Medium'],
  ['Word Break', 'https://leetcode.com/problems/word-break/', 'Dynamic Programming - 1D', 'Reachable prefixes', 'Medium'],
  ['Decode Ways', 'https://leetcode.com/problems/decode-ways/', 'Dynamic Programming - 1D', 'One/two digit states', 'Medium'],
  ['Maximum Product Subarray', 'https://leetcode.com/problems/maximum-product-subarray/', 'Dynamic Programming - 1D', 'Track min/max', 'Medium'],
  ['Unique Paths', 'https://leetcode.com/problems/unique-paths/', 'Dynamic Programming - 2D', 'Grid state', 'Medium'],
  ['Longest Common Subsequence', 'https://leetcode.com/problems/longest-common-subsequence/', 'Dynamic Programming - 2D', 'Match/skip', 'Medium'],
  ['Edit Distance', 'https://leetcode.com/problems/edit-distance/', 'Dynamic Programming - 2D', 'Three edits', 'Medium'],
  ['Partition Equal Subset Sum', 'https://leetcode.com/problems/partition-equal-subset-sum/', 'Dynamic Programming - 2D', 'Subset capacity', 'Medium'],
  ['Target Sum', 'https://leetcode.com/problems/target-sum/', 'Dynamic Programming - 2D', 'Signed choices', 'Medium'],
  ['Coin Change II', 'https://leetcode.com/problems/coin-change-ii/', 'Dynamic Programming - 2D', 'Combination counts', 'Medium'],
  ['Implement Trie (Prefix Tree)', 'https://leetcode.com/problems/implement-trie-prefix-tree/', 'Trie', 'Prefix nodes', 'Medium'],
  ['Design Add and Search Words Data Structure', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', 'Trie', 'Trie + wildcard DFS', 'Medium'],
  ['Word Search II', 'https://leetcode.com/problems/word-search-ii/', 'Trie', 'Trie grid search', 'Hard'],
  ['Sum of Two Integers', 'https://leetcode.com/problems/sum-of-two-integers/', 'Bit Manipulation', 'XOR + carry', 'Medium'],
  ['Reverse Bits', 'https://leetcode.com/problems/reverse-bits/', 'Bit Manipulation', 'Shift and build', 'Easy'],
  ['Number of 1 Bits', 'https://leetcode.com/problems/number-of-1-bits/', 'Bit Manipulation', 'Clear lowest bit', 'Easy'],
  ['Counting Bits', 'https://leetcode.com/problems/counting-bits/', 'Bit Manipulation', 'Drop lowest bit', 'Easy'],
]

const roadmapCategoryByTitle = Object.fromEntries(roadmapSeed.map(([title, , category]) => [title, category])) as Record<string, string>
const extendedProblems: Problem[] = roadmapSeed
  .filter(([title]) => !problems.some((problem) => problem.title === title))
  .map(([title, url, category, pattern, difficulty], index) => ({ number: 1000 + index, title, difficulty, topics: [category], pattern, url, category }))
const allProblems: Problem[] = [...problems.map((problem) => ({ ...problem, category: roadmapCategoryByTitle[problem.title] ?? problem.category })), ...extendedProblems]

const optimizedCode = [
  'def two_sum(nums, target):',
  '    seen = {}',
  '',
  '    for i, num in enumerate(nums):',
  '        need = target - num',
  '',
  '        if need in seen:',
  '            return [seen[need], i]',
  '',
  '        seen[num] = i',
]

const bruteForceCode = [
  'def two_sum(nums, target):',
  '    for i in range(len(nums)):',
  '        for j in range(i + 1, len(nums)):',
  '            if nums[i] + nums[j] == target:',
  '                return [i, j]',
]

const animationSteps: AnimationStep[] = [
  {
    label: 'Set up the search',
    description: 'We create an empty map to remember numbers as we scan the array.',
    detail: 'Nothing has been seen yet.',
    activeIndex: null,
    currentLine: 1,
    i: null,
    num: null,
    need: null,
    map: {},
    found: false,
    answer: null,
  },
  {
    label: 'Read the first number',
    description: 'We are looking at 2. What number would complete the target of 9?',
    detail: 'i = 0  ·  num = 2',
    activeIndex: 0,
    currentLine: 3,
    i: 0,
    num: 2,
    need: null,
    map: {},
    found: false,
    answer: null,
  },
  {
    label: 'Calculate the complement',
    description: 'The missing partner is target − num, so we need 7.',
    detail: '9 − 2 = 7',
    activeIndex: 0,
    currentLine: 4,
    i: 0,
    num: 2,
    need: 7,
    map: {},
    found: false,
    answer: null,
  },
  {
    label: 'Check the map',
    description: '7 is not in the map yet, so this pair cannot be complete.',
    detail: '7 ∉ { }',
    activeIndex: 0,
    currentLine: 6,
    i: 0,
    num: 2,
    need: 7,
    map: {},
    found: false,
    answer: null,
  },
  {
    label: 'Remember 2',
    description: 'Store the number we just visited and its index for a future lookup.',
    detail: 'seen[2] = 0',
    activeIndex: 0,
    currentLine: 9,
    i: 0,
    num: 2,
    need: 7,
    map: { '2': 0 },
    found: false,
    answer: null,
  },
  {
    label: 'Read the next number',
    description: 'Now we move to 7 at index 1. The map already holds one useful clue.',
    detail: 'i = 1  ·  num = 7',
    activeIndex: 1,
    currentLine: 3,
    i: 1,
    num: 7,
    need: null,
    map: { '2': 0 },
    found: false,
    answer: null,
  },
  {
    label: 'Calculate the complement',
    description: 'To make 9 with 7, we need 2.',
    detail: '9 − 7 = 2',
    activeIndex: 1,
    currentLine: 4,
    i: 1,
    num: 7,
    need: 2,
    map: { '2': 0 },
    found: false,
    answer: null,
  },
  {
    label: 'Match found',
    description: '2 is already in the map! Its index is 0, so we found the pair.',
    detail: '2 ∈ { 2 → 0 }',
    activeIndex: 1,
    currentLine: 6,
    i: 1,
    num: 7,
    need: 2,
    map: { '2': 0 },
    found: true,
    answer: null,
  },
  {
    label: 'Return the answer',
    description: 'The two values add to 9. Return their indices: [0, 1].',
    detail: '2 + 7 = 9',
    activeIndex: 1,
    currentLine: 7,
    i: 1,
    num: 7,
    need: 2,
    map: { '2': 0 },
    found: true,
    answer: [0, 1],
  },
]

const lessonStep = (step: Partial<AnimationStep>): AnimationStep => ({
  label: 'Follow the algorithm',
  description: '',
  detail: '',
  activeIndex: null,
  currentLine: 0,
  i: null,
  num: null,
  need: null,
  map: {},
  found: false,
  answer: null,
  visualKind: 'contains-duplicate',
  ...step,
})

const problemByNumber = Object.fromEntries(allProblems.map((problem) => [problem.number, problem])) as Record<number, Problem>

function makeLesson(number: number, details: Omit<LessonData, keyof Problem>): LessonData {
  return { ...problemByNumber[number], ...details }
}

const sudokuRows: VisualRow[] = [
  { label: 'r1', items: ['5', '3', '.', '.', '7', '.', '.', '.', '.'] },
  { label: 'r2', items: ['6', '.', '.', '1', '9', '5', '.', '.', '.'] },
  { label: 'r3', items: ['.', '9', '8', '.', '.', '.', '.', '6', '.'] },
  { label: 'r4', items: ['8', '.', '.', '.', '6', '.', '.', '.', '3'] },
  { label: 'r5', items: ['4', '.', '.', '8', '.', '3', '.', '.', '1'] },
  { label: 'r6', items: ['7', '.', '.', '.', '2', '.', '.', '.', '6'] },
  { label: 'r7', items: ['.', '6', '.', '.', '.', '.', '2', '8', '.'] },
  { label: 'r8', items: ['.', '.', '.', '4', '1', '9', '.', '.', '5'] },
  { label: 'r9', items: ['.', '.', '.', '.', '8', '.', '.', '7', '9'] },
]

const lessonLibrary: Record<number, LessonData> = {
  1: makeLesson(1, {
    minutes: 8,
    introCopy: 'Turn a classic interview problem into a pattern you can spot in seconds.',
    statementTitle: 'Find the two numbers that add up to a target.',
    statement: 'Given a list of integers and a target value, return the indices of the two different numbers whose sum equals that target. You can assume there is exactly one answer.',
    input: 'nums = [2, 7, 11, 15]\ntarget = 9', output: '[0, 1]', outputNote: 'Because nums[0] + nums[1] = 2 + 7 = 9',
    introTitle: 'Remember what you’ve already seen.', intro: 'For every number, ask one simple question: “What number would complete the target?” Instead of searching the rest of the array, keep a tiny lookup table of values we passed.',
    patternTitle: 'Complement lookup', patternDescription: 'Current value + missing value = target', patternEquation: 'num  +  need  =  target',
    miniSteps: [['Ask', 'What do I need?'], ['Look up', 'Have I seen it?'], ['Remember', 'Store this value.']],
    optimizedTitle: 'One pass with a hash map', optimizedExplanation: 'We check for the complement before storing the current number, so we never use the same element twice.', optimizedCode, bruteCode: bruteForceCode, bruteExplanation: 'Try every pair until the two values add up to the target. It is easy to understand, but repeats work.', time: 'O(n)', space: 'O(n)', bruteTime: 'O(n²)', bruteSpace: 'O(1)', memory: 'Don’t search the whole array again. Remember what you’ve already seen.', steps: animationSteps,
  }),
  217: makeLesson(217, {
    minutes: 5, introCopy: 'Spot repeats by remembering every value you have already visited.', statementTitle: 'Check whether any value appears more than once.', statement: 'Given an integer array, return true when at least one value occurs twice. Otherwise return false.', input: 'nums = [1, 2, 3, 1]', output: 'true', outputNote: 'The value 1 appears at indices 0 and 3.', introTitle: 'A set is a memory of values.', intro: 'As you scan the array, ask whether the current value is already in your set. If it is, the duplicate is found. If not, store it for later.', patternTitle: 'Set membership', patternDescription: 'Have I seen this value before?', patternEquation: 'value  ∈  seen?', miniSteps: [['Read', 'Take one value.'], ['Check', 'Is it in seen?'], ['Store', 'Remember new values.']], optimizedTitle: 'One pass with a set', optimizedExplanation: 'A set gives us a fast membership check, so every number is processed once.', optimizedCode: ['def contains_duplicate(nums):', '    seen = set()', '', '    for num in nums:', '        if num in seen:', '            return True', '        seen.add(num)', '', '    return False'], bruteCode: ['def contains_duplicate(nums):', '    for i in range(len(nums)):', '        for j in range(i + 1, len(nums)):', '            if nums[i] == nums[j]:', '                return True', '    return False'], bruteExplanation: 'Compare every pair of values. This works, but it repeats comparisons as the array grows.', time: 'O(n)', space: 'O(n)', bruteTime: 'O(n²)', bruteSpace: 'O(1)', memory: 'A set answers “have I seen this?” in one quick lookup.', steps: [
      lessonStep({ visualKind: 'contains-duplicate', label: 'Create the set', description: 'Start with an empty set. It will hold the values we have already seen.', detail: 'seen = { }', currentLine: 1, visualItems: ['1', '2', '3', '1'], visualHeading: 'Input array', visualCaption: 'seen = { }', customVariables: { seen: '{ }' } }),
      lessonStep({ visualKind: 'contains-duplicate', label: 'Read 1', description: '1 is not in the set, so this is the first time we have seen it.', detail: '1 ∉ seen', currentLine: 4, activeIndex: 0, visualItems: ['1', '2', '3', '1'], visualCaption: 'current = 1', customVariables: { num: 1, seen: '{ }' } }),
      lessonStep({ visualKind: 'contains-duplicate', label: 'Remember 1', description: 'Store 1 so a future copy can be detected instantly.', detail: 'seen.add(1)', currentLine: 6, activeIndex: 0, visualItems: ['1', '2', '3', '1'], map: { '1': 0 }, customVariables: { num: 1, seen: '{1}' } }),
      lessonStep({ visualKind: 'contains-duplicate', label: 'Remember 2 and 3', description: 'Neither 2 nor 3 has appeared before, so both are added to the set.', detail: 'seen = {1, 2, 3}', currentLine: 6, activeIndex: 2, visualItems: ['1', '2', '3', '1'], map: { '1': 0, '2': 1, '3': 2 }, customVariables: { num: 3, seen: '{1, 2, 3}' } }),
      lessonStep({ visualKind: 'contains-duplicate', label: 'Read the last 1', description: 'The current value is 1, and 1 is already in our set.', detail: '1 ∈ {1, 2, 3}', currentLine: 4, activeIndex: 3, visualItems: ['1', '2', '3', '1'], map: { '1': 0, '2': 1, '3': 2 }, found: true, customVariables: { num: 1, seen: '{1, 2, 3}' } }),
      lessonStep({ visualKind: 'contains-duplicate', label: 'Return true', description: 'A repeated value exists, so the answer is true.', detail: 'duplicate found → True', currentLine: 5, activeIndex: 3, visualItems: ['1', '2', '3', '1'], map: { '1': 0, '2': 1, '3': 2 }, found: true, resultText: 'True', customVariables: { num: 1, result: 'True' } }),
    ],
  }),
  242: makeLesson(242, {
    minutes: 6, introCopy: 'Compare two words by counting their letters instead of sorting them.', statementTitle: 'Decide whether two strings use the same letters.', statement: 'Return true if the two strings contain the same letters with the same frequencies, even if their order is different.', input: 's = "anagram"\nt = "nagaram"', output: 'true', outputNote: 'Both strings contain the same seven letters.', introTitle: 'Order does not matter; counts do.', intro: 'Anagrams have identical letter counts. Count the first word, then subtract each letter from the second word. Every count should end at zero.', patternTitle: 'Frequency map', patternDescription: 'Same letters means same counts.', patternEquation: 'count[s]  −  count[t]  =  0', miniSteps: [['Count', 'Record s.'], ['Subtract', 'Read t.'], ['Verify', 'All counts are zero.']], optimizedTitle: 'Count and compare', optimizedExplanation: 'A frequency map captures the information that sorting would reveal, while keeping the solution linear.', optimizedCode: ['def is_anagram(s, t):', '    if len(s) != len(t):', '        return False', '', '    count = {}', '    for char in s:', '        count[char] = count.get(char, 0) + 1', '    for char in t:', '        count[char] -= 1', '    return all(value == 0 for value in count.values())'], bruteCode: ['def is_anagram(s, t):', '    return sorted(s) == sorted(t)'], bruteExplanation: 'Sorting is a simple comparison, but it adds O(n log n) work.', time: 'O(n)', space: 'O(1)', bruteTime: 'O(n log n)', bruteSpace: 'O(n)', memory: 'When order is irrelevant, count the ingredients.', steps: [
      lessonStep({ visualKind: 'valid-anagram', label: 'Create letter counts', description: 'We start an empty map for the letters in the first word.', detail: 'count = { }', currentLine: 4, visualRows: [{ label: 's', items: [...'anagram'] }, { label: 't', items: [...'nagaram'] }], visualHeading: 'Two strings', visualCaption: 'count = { }', customVariables: { char: '—', count: '{ }' } }),
      lessonStep({ visualKind: 'valid-anagram', label: 'Count the first a', description: 'The first word begins with a, so count[a] becomes 1.', detail: 'count[a] = 1', currentLine: 6, activeIndex: 0, visualRows: [{ label: 's', items: [...'anagram'] }, { label: 't', items: [...'nagaram'] }], map: { a: 1 }, customVariables: { char: 'a', count: '{a: 1}' } }),
      lessonStep({ visualKind: 'valid-anagram', label: 'Finish counting s', description: 'After scanning s, the map stores the frequency of every letter.', detail: '{a: 3, n: 1, g: 1, r: 1, m: 1}', currentLine: 6, activeIndex: 6, visualRows: [{ label: 's', items: [...'anagram'] }, { label: 't', items: [...'nagaram'] }], map: { a: 3, n: 1, g: 1, r: 1, m: 1 }, customVariables: { char: 'm', count: '{a: 3, n: 1, g: 1, r: 1, m: 1}' } }),
      lessonStep({ visualKind: 'valid-anagram', label: 'Subtract letters from t', description: 'Now each letter in t subtracts from the matching count.', detail: 'count[n] -= 1', currentLine: 8, activeIndex: 0, visualRows: [{ label: 's', items: [...'anagram'] }, { label: 't', items: [...'nagaram'] }], map: { a: 3, n: 0, g: 1, r: 1, m: 1 }, customVariables: { char: 'n', count: '{a: 3, n: 0, ...}' } }),
      lessonStep({ visualKind: 'valid-anagram', label: 'All counts reach zero', description: 'After the full second scan, every letter has been balanced out.', detail: 'all(value == 0) → True', currentLine: 9, activeIndex: 6, visualRows: [{ label: 's', items: [...'anagram'] }, { label: 't', items: [...'nagaram'] }], map: { a: 0, n: 0, g: 0, r: 0, m: 0 }, found: true, resultText: 'True', customVariables: { result: 'True' } }),
    ],
  }),
  49: makeLesson(49, {
    minutes: 7, introCopy: 'Turn each word into a repeatable key, then gather matching keys together.', statementTitle: 'Group words that are made from the same letters.', statement: 'Given a list of words, collect the anagrams into groups. Words in the same group can be rearranged to form one another.', input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]', outputNote: 'Words with the same sorted key belong together.', introTitle: 'Give anagrams the same label.', intro: 'Sort each word to create a canonical key. “eat”, “tea”, and “ate” all become “aet”, so a dictionary can collect them in one bucket.', patternTitle: 'Canonical key', patternDescription: 'Same key means same anagram group.', patternEquation: 'sorted(word)  →  group key', miniSteps: [['Key', 'Sort the word.'], ['Group', 'Use the key.'], ['Collect', 'Append the word.']], optimizedTitle: 'Dictionary of groups', optimizedExplanation: 'Each word is transformed into a stable key. The map lets us append it to the right group in one lookup.', optimizedCode: ['def group_anagrams(strs):', '    groups = {}', '    for word in strs:', '        key = "".join(sorted(word))', '        if key not in groups:', '            groups[key] = []', '        groups[key].append(word)', '    return list(groups.values())'], bruteCode: ['def group_anagrams(strs):', '    groups = []', '    for word in strs:', '        for group in groups:', '            if sorted(word) == sorted(group[0]):', '                group.append(word)', '                break', '        else:', '            groups.append([word])', '    return groups'], bruteExplanation: 'Compare each word with existing groups. It works, but repeated comparisons grow quickly.', time: 'O(n · k log k)', space: 'O(n · k)', bruteTime: 'O(n² · k)', bruteSpace: 'O(n · k)', memory: 'Make matching things share the same key.', steps: [
      lessonStep({ visualKind: 'group-anagrams', label: 'Create the groups map', description: 'The map will connect a sorted key to a list of matching words.', detail: 'groups = { }', currentLine: 1, visualItems: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], visualGroups: [], visualHeading: 'Words to group', visualCaption: 'groups = { }', customVariables: { word: '—', key: '—' } }),
      lessonStep({ visualKind: 'group-anagrams', label: 'Key for eat', description: 'Sorting eat gives the key aet. Start a group for it.', detail: 'sorted("eat") → "aet"', currentLine: 3, activeIndex: 0, visualItems: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], visualGroups: [{ label: 'aet', value: 'eat' }], customVariables: { word: 'eat', key: 'aet' } }),
      lessonStep({ visualKind: 'group-anagrams', label: 'Add tea and ate', description: 'tea and ate produce the same key, so they join the aet group.', detail: 'aet → [eat, tea, ate]', currentLine: 6, activeIndex: 3, visualItems: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], visualGroups: [{ label: 'aet', value: 'eat · tea · ate' }], customVariables: { word: 'ate', key: 'aet' } }),
      lessonStep({ visualKind: 'group-anagrams', label: 'Create tan group', description: 'tan sorts to ant, a new key with its own group.', detail: 'sorted("tan") → "ant"', currentLine: 3, activeIndex: 2, visualItems: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], visualGroups: [{ label: 'aet', value: 'eat · tea · ate' }, { label: 'ant', value: 'tan' }], customVariables: { word: 'tan', key: 'ant' } }),
      lessonStep({ visualKind: 'group-anagrams', label: 'Finish the groups', description: 'nat joins ant, while bat creates the final group by itself.', detail: '[[eat, tea, ate], [tan, nat], [bat]]', currentLine: 7, activeIndex: 5, visualItems: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], visualGroups: [{ label: 'aet', value: 'eat · tea · ate' }, { label: 'ant', value: 'tan · nat' }, { label: 'abt', value: 'bat' }], found: true, resultText: '3 groups', customVariables: { key: 'abt', result: '3 groups' } }),
    ],
  }),
  347: makeLesson(347, {
    minutes: 8, introCopy: 'Count first, then let bucket positions reveal the most common values.', statementTitle: 'Return the k values that appear most often.', statement: 'Given an array and a number k, return the k elements with the highest frequencies. The order of the answer does not matter.', input: 'nums = [1, 1, 1, 2, 2, 3]\nk = 2', output: '[1, 2]', outputNote: '1 appears three times and 2 appears twice.', introTitle: 'Frequency tells us what matters.', intro: 'First count every value. Then place values into buckets where the bucket number equals their frequency. Scan from the fullest bucket down.', patternTitle: 'Frequency buckets', patternDescription: 'The bucket index is the frequency.', patternEquation: 'count[value]  →  bucket[count]', miniSteps: [['Count', 'Build frequencies.'], ['Bucket', 'Group by count.'], ['Pick', 'Take the top k.']], optimizedTitle: 'Count, bucket, collect', optimizedExplanation: 'Bucket sort avoids sorting all values. The highest-frequency buckets are already in the order we need.', optimizedCode: ['def top_k_frequent(nums, k):', '    count = {}', '    for num in nums:', '        count[num] = count.get(num, 0) + 1', '', '    buckets = [[] for _ in range(len(nums) + 1)]', '    for num, freq in count.items():', '        buckets[freq].append(num)', '', '    result = []', '    for freq in range(len(nums), 0, -1):', '        for num in buckets[freq]:', '            result.append(num)', '            if len(result) == k:', '                return result'], bruteCode: ['def top_k_frequent(nums, k):', '    count = {}', '    for num in nums:', '        count[num] = count.get(num, 0) + 1', '    return sorted(count, key=count.get, reverse=True)[:k]'], bruteExplanation: 'Count the values, then sort them by frequency. Sorting adds an extra log factor.', time: 'O(n)', space: 'O(n)', bruteTime: 'O(n log n)', bruteSpace: 'O(n)', memory: 'Count it, bucket it, take from the top.', steps: [
      lessonStep({ visualKind: 'top-k', label: 'Count each value', description: 'Build a frequency map before deciding which values belong in the answer.', detail: 'count = {1: 3, 2: 2, 3: 1}', currentLine: 3, visualItems: ['1', '1', '1', '2', '2', '3'], map: { '1': 3, '2': 2, '3': 1 }, visualHeading: 'Input values', visualCaption: 'k = 2', customVariables: { num: 3, k: 2, count: '{1: 3, 2: 2, 3: 1}' } }),
      lessonStep({ visualKind: 'top-k', label: 'Place values in buckets', description: 'Value 1 goes in bucket 3, value 2 in bucket 2, and value 3 in bucket 1.', detail: 'bucket[3] = [1], bucket[2] = [2]', currentLine: 7, visualItems: ['1', '2', '3'], visualGroups: [{ label: '3×', value: '1' }, { label: '2×', value: '2' }, { label: '1×', value: '3' }], customVariables: { freq: 3, buckets: '3× → [1]' } }),
      lessonStep({ visualKind: 'top-k', label: 'Take the fullest bucket', description: 'Scan from high frequency to low. The first value is 1.', detail: 'result = [1]', currentLine: 12, activeIndex: 0, visualItems: ['1', '2', '3'], visualGroups: [{ label: '3×', value: '1', tone: 'match' }, { label: '2×', value: '2' }, { label: '1×', value: '3' }], customVariables: { freq: 3, result: '[1]' } }),
      lessonStep({ visualKind: 'top-k', label: 'Take the next value', description: 'The next fullest bucket gives us 2. We now have k = 2 values.', detail: 'result = [1, 2]', currentLine: 15, activeIndex: 1, visualItems: ['1', '2', '3'], visualGroups: [{ label: '3×', value: '1', tone: 'match' }, { label: '2×', value: '2', tone: 'match' }, { label: '1×', value: '3' }], found: true, resultText: '[1, 2]', customVariables: { freq: 2, result: '[1, 2]' } }),
    ],
  }),
  238: makeLesson(238, {
    minutes: 8, introCopy: 'Build each answer from the products on its left and right.', statementTitle: 'Return each value’s product without multiplying by itself.', statement: 'For every position, return the product of all numbers except the number at that position. Do not use division.', input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]', outputNote: 'Each output is the product of the other three values.', introTitle: 'Every position has a left and a right product.', intro: 'Make one pass from the left to store prefix products. Make another from the right to multiply in suffix products. No division is needed.', patternTitle: 'Prefix + suffix', patternDescription: 'answer[i] = left product × right product', patternEquation: 'prefix[i]  ×  suffix[i]', miniSteps: [['Left', 'Store prefix.'], ['Right', 'Multiply suffix.'], ['Build', 'Join both sides.']], optimizedTitle: 'Two passes, no division', optimizedExplanation: 'The result array stores left products first, then a reverse pass folds in the right products.', optimizedCode: ['def product_except_self(nums):', '    result = [1] * len(nums)', '    prefix = 1', '    for i in range(len(nums)):', '        result[i] = prefix', '        prefix *= nums[i]', '', '    suffix = 1', '    for i in range(len(nums) - 1, -1, -1):', '        result[i] *= suffix', '        suffix *= nums[i]', '    return result'], bruteCode: ['def product_except_self(nums):', '    result = []', '    for i in range(len(nums)):', '        product = 1', '        for j in range(len(nums)):', '            if i != j:', '                product *= nums[j]', '        result.append(product)', '    return result'], bruteExplanation: 'For every index, multiply every other index. The nested loop repeats nearly the same work.', time: 'O(n)', space: 'O(1)', bruteTime: 'O(n²)', bruteSpace: 'O(1)', memory: 'For each spot: everything left times everything right.', steps: [
      lessonStep({ visualKind: 'product', label: 'Start with ones', description: 'The result array begins with 1s because multiplying by 1 changes nothing.', detail: 'result = [1, 1, 1, 1]', currentLine: 1, visualItems: ['1', '2', '3', '4'], visualRows: [{ label: 'nums', items: ['1', '2', '3', '4'] }, { label: 'result', items: ['1', '1', '1', '1'] }], visualHeading: 'Input and result', visualCaption: 'prefix = 1', customVariables: { prefix: 1, suffix: '—', result: '[1, 1, 1, 1]' } }),
      lessonStep({ visualKind: 'product', label: 'Write prefix products', description: 'Moving left to right, write the product of everything before each index.', detail: 'result = [1, 1, 2, 6]', currentLine: 4, activeIndex: 3, visualItems: ['1', '2', '3', '4'], visualRows: [{ label: 'nums', items: ['1', '2', '3', '4'] }, { label: 'result', items: ['1', '1', '2', '6'] }], visualCaption: 'prefix = 6', customVariables: { i: 3, prefix: 6, result: '[1, 1, 2, 6]' } }),
      lessonStep({ visualKind: 'product', label: 'Walk from the right', description: 'Now move backwards. The suffix product starts at 1 on the far right.', detail: 'suffix = 1', currentLine: 7, activeIndex: 3, visualItems: ['1', '2', '3', '4'], visualRows: [{ label: 'nums', items: ['1', '2', '3', '4'] }, { label: 'result', items: ['1', '1', '2', '6'] }], visualCaption: 'suffix = 1', customVariables: { i: 3, prefix: '—', suffix: 1 } }),
      lessonStep({ visualKind: 'product', label: 'Multiply in suffixes', description: 'Fold the right-side product into each stored prefix product.', detail: 'result = [24, 12, 8, 6]', currentLine: 9, activeIndex: 0, visualItems: ['1', '2', '3', '4'], visualRows: [{ label: 'nums', items: ['1', '2', '3', '4'] }, { label: 'result', items: ['24', '12', '8', '6'] }], found: true, resultText: '[24, 12, 8, 6]', customVariables: { i: 0, suffix: 24, result: '[24, 12, 8, 6]' } }),
    ],
  }),
  128: makeLesson(128, {
    minutes: 7, introCopy: 'Find the beginning of each sequence, then grow it only once.', statementTitle: 'Find the length of the longest consecutive run.', statement: 'Given an unsorted array of integers, return the length of the longest sequence of consecutive values.', input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4', outputNote: 'The longest run is 1, 2, 3, 4.', introTitle: 'Only start at the beginning.', intro: 'Put every value in a set. A number starts a sequence only when its predecessor is missing. Then walk forward to count the run.', patternTitle: 'Sequence starts', patternDescription: 'Start only when num − 1 is absent.', patternEquation: 'num − 1 ∉ set  →  start', miniSteps: [['Set', 'Store all values.'], ['Start', 'Find a true beginning.'], ['Grow', 'Count forward.']], optimizedTitle: 'Set-based sequence scan', optimizedExplanation: 'The set makes predecessor and successor checks constant time, so each value participates in a short sequence walk.', optimizedCode: ['def longest_consecutive(nums):', '    num_set = set(nums)', '    longest = 0', '    for num in num_set:', '        if num - 1 not in num_set:', '            length = 1', '            while num + length in num_set:', '                length += 1', '            longest = max(longest, length)', '    return longest'], bruteCode: ['def longest_consecutive(nums):', '    nums.sort()', '    longest = 1', '    for i in range(1, len(nums)):', '        if nums[i] == nums[i - 1] + 1:', '            longest += 1', '    return longest'], bruteExplanation: 'Sort the array first, then scan it. Sorting is the expensive step.', time: 'O(n)', space: 'O(n)', bruteTime: 'O(n log n)', bruteSpace: 'O(1)', memory: 'A sequence starts where its predecessor is missing.', steps: [
      lessonStep({ visualKind: 'longest-consecutive', label: 'Create the set', description: 'A set lets us ask whether a neighbor exists without scanning the whole array.', detail: 'set = {100, 4, 200, 1, 3, 2}', currentLine: 1, visualItems: ['100', '4', '200', '1', '3', '2'], visualHeading: 'Input values', visualCaption: 'longest = 0', customVariables: { num: '—', longest: 0 } }),
      lessonStep({ visualKind: 'longest-consecutive', label: 'Find a sequence start', description: '1 has no predecessor 0, so 1 is a true beginning.', detail: '0 ∉ set → start at 1', currentLine: 4, activeIndex: 3, visualItems: ['100', '4', '200', '1', '3', '2'], visualCaption: 'start = 1', customVariables: { num: 1, longest: 0 } }),
      lessonStep({ visualKind: 'longest-consecutive', label: 'Grow the run', description: '2, 3, and 4 are present, so the run grows to length 4.', detail: '1 → 2 → 3 → 4', currentLine: 6, activeIndex: 1, visualItems: ['100', '4', '200', '1', '3', '2'], visualCaption: 'length = 4', customVariables: { num: 1, length: 4, longest: 4 } }),
      lessonStep({ visualKind: 'longest-consecutive', label: 'Keep the longest', description: 'No other starting point creates a longer run. Return 4.', detail: 'longest = max(0, 4) = 4', currentLine: 7, activeIndex: 1, visualItems: ['100', '4', '200', '1', '3', '2'], found: true, resultText: '4', customVariables: { length: 4, longest: 4 } }),
    ],
  }),
  36: makeLesson(36, {
    minutes: 8, introCopy: 'Validate a grid by tracking rows, columns, and 3×3 boxes as you scan.', statementTitle: 'Check whether a Sudoku board is valid so far.', statement: 'A filled digit may appear once in its row, once in its column, and once in its 3×3 box. Empty cells do not need checking.', input: 'board = 9 × 9 grid\nexample starts with 5, 3, 7', output: 'true', outputNote: 'Every filled cell seen so far respects its row, column, and box.', introTitle: 'Three rules, three sets.', intro: 'For each filled cell, check three collections: its row, its column, and its 3×3 box. If the digit is already in any one, the board is invalid.', patternTitle: 'Constraint sets', patternDescription: 'One digit must pass three membership checks.', patternEquation: 'row ∩ col ∩ box = ∅', miniSteps: [['Locate', 'Read the cell.'], ['Check', 'Test 3 sets.'], ['Store', 'Add the digit.']], optimizedTitle: 'Track rows, columns, boxes', optimizedExplanation: 'Sets make each Sudoku constraint check constant time while we visit each filled cell once.', optimizedCode: ['def is_valid_sudoku(board):', '    rows = [set() for _ in range(9)]', '    cols = [set() for _ in range(9)]', '    boxes = [set() for _ in range(9)]', '    for r in range(9):', '        for c in range(9):', '            value = board[r][c]', '            if value == ".":', '                continue', '            box = (r // 3) * 3 + c // 3', '            if value in rows[r] or value in cols[c] or value in boxes[box]:', '                return False', '            rows[r].add(value)', '            cols[c].add(value)', '            boxes[box].add(value)', '    return True'], bruteCode: ['def is_valid_sudoku(board):', '    for row in board:', '        if len(set(row)) != len(row):', '            return False', '    return True'], bruteExplanation: 'Checking only rows misses duplicates that hide in columns and 3×3 boxes.', time: 'O(1)', space: 'O(1)', bruteTime: 'O(1)', bruteSpace: 'O(1)', memory: 'Every filled cell must pass its row, column, and box.', steps: [
      lessonStep({ visualKind: 'sudoku', label: 'Create three trackers', description: 'Prepare one set for every row, column, and 3×3 box.', detail: 'rows, cols, boxes = empty sets', currentLine: 1, visualRows: sudokuRows, visualHeading: 'Sudoku board', visualCaption: 'three checks per digit', customVariables: { row: '—', col: '—', box: '—' } }),
      lessonStep({ visualKind: 'sudoku', label: 'Read cell (0, 0)', description: 'The first filled cell is 5. Its row, column, and box are all empty.', detail: '5 passes row 0 · col 0 · box 0', currentLine: 8, activeIndex: 0, visualRows: sudokuRows, visualHeading: 'Sudoku board', visualCaption: 'value = 5', customVariables: { row: 0, col: 0, box: 0, value: 5 } }),
      lessonStep({ visualKind: 'sudoku', label: 'Store the 5', description: 'Add 5 to all three trackers so future cells can spot a conflict.', detail: 'rows[0], cols[0], boxes[0] add 5', currentLine: 13, activeIndex: 0, visualRows: sudokuRows, visualHeading: 'Sudoku board', visualCaption: '5 stored in 3 sets', customVariables: { row: '{5}', col: '{5}', box: '{5}' } }),
      lessonStep({ visualKind: 'sudoku', label: 'Read cell (0, 1)', description: '3 is not present in row 0, column 1, or the top-left box.', detail: '3 passes all constraints', currentLine: 8, activeIndex: 1, visualRows: sudokuRows, visualHeading: 'Sudoku board', visualCaption: 'value = 3', customVariables: { row: 0, col: 1, box: 0, value: 3 } }),
      lessonStep({ visualKind: 'sudoku', label: 'Board still valid', description: 'The cells we have checked do not break any Sudoku rule, so we continue.', detail: 'no duplicate found → True so far', currentLine: 15, activeIndex: 1, visualRows: sudokuRows, found: true, resultText: 'valid so far', customVariables: { checked: '2 cells', result: 'valid' } }),
    ],
  }),
}

const genericCodeByCategory: Record<string, string[]> = {
  'One-Pass Arrays': ['def solve(nums):', '    state = 0', '    for value in nums:', '        state = update(state, value)', '    return state'],
  'Two Pointers': ['def solve(nums):', '    left, right = 0, len(nums) - 1', '    while left < right:', '        if should_move_left(nums[left], nums[right]):', '            left += 1', '        else:', '            right -= 1', '    return answer'],
  'Sliding Window': ['def solve(items):', '    left = 0', '    for right, item in enumerate(items):', '        add(item)', '        while window_is_invalid():', '            remove(items[left])', '            left += 1', '    return answer'],
  'Prefix Sum': ['def solve(nums):', '    prefix = 0', '    seen = {0: 1}', '    for value in nums:', '        prefix += value', '        use_prefix_state(prefix, seen)', '    return answer'],
  'Binary Search': ['def solve(values):', '    left, right = 0, len(values) - 1', '    while left <= right:', '        mid = (left + right) // 2', '        if is_too_small(values[mid]):', '            left = mid + 1', '        else:', '            right = mid - 1', '    return left'],
  'Stack': ['def solve(items):', '    stack = []', '    for item in items:', '        if should_pop(stack, item):', '            stack.pop()', '        else:', '            stack.append(item)', '    return stack'],
  'Monotonic Stack': ['def solve(values):', '    stack = []', '    for i, value in enumerate(values):', '        while stack and value > values[stack[-1]]:', '            answer[stack.pop()] = value', '        stack.append(i)', '    return answer'],
  'Linked List': ['def solve(head):', '    previous = None', '    current = head', '    while current:', '        next_node = current.next', '        update_pointer(current, previous)', '        previous, current = current, next_node', '    return previous'],
  'Intervals': ['def solve(intervals):', '    intervals.sort()', '    merged = []', '    for start, end in intervals:', '        if merged and start <= merged[-1][1]:', '            merged[-1][1] = max(merged[-1][1], end)', '        else:', '            merged.append([start, end])', '    return merged'],
  'Heap / Priority Queue': ['def solve(items, k):', '    heap = []', '    for item in items:', '        push(heap, item)', '        if len(heap) > k:', '            pop(heap)', '    return heap'],
  'Trees - DFS/BFS': ['def solve(root):', '    if not root:', '        return base_case', '    left = solve(root.left)', '    right = solve(root.right)', '    return combine(root, left, right)'],
  'Graphs - DFS/BFS': ['def solve(graph):', '    seen = set()', '    queue = [start]', '    while queue:', '        node = queue.pop(0)', '        if node in seen:', '            continue', '        seen.add(node)', '        queue.extend(neighbors(node))', '    return result'],
  'Topological Sort': ['def solve(graph):', '    indegree = count_dependencies(graph)', '    queue = ready_nodes(indegree)', '    while queue:', '        node = queue.pop(0)', '        for neighbor in graph[node]:', '            indegree[neighbor] -= 1', '    return order'],
  'Union-Find': ['def solve(edges):', '    parent = list(range(n))', '    for a, b in edges:', '        root_a = find(parent, a)', '        root_b = find(parent, b)', '        union(parent, root_a, root_b)', '    return parent'],
  'Backtracking': ['def solve(items):', '    result = []', '    def backtrack(path):', '        if complete(path):', '            result.append(path[:])', '            return', '        for choice in choices(path):', '            path.append(choice)', '            backtrack(path)', '            path.pop()', '    backtrack([])', '    return result'],
  'Greedy': ['def solve(items):', '    state = initial_state', '    for item in sorted(items):', '        if safe_to_take(item, state):', '            state = take(item, state)', '    return state'],
  'Dynamic Programming - 1D': ['def solve(items):', '    dp = [base_case] * (len(items) + 1)', '    for i in range(1, len(dp)):', '        dp[i] = best_previous_state(dp, items, i)', '    return dp[-1]'],
  'Dynamic Programming - 2D': ['def solve(a, b):', '    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]', '    for i in range(1, len(a) + 1):', '        for j in range(1, len(b) + 1):', '            dp[i][j] = combine_neighbors(dp, a, b, i, j)', '    return dp[-1][-1]'],
  Trie: ['class Trie:', '    def __init__(self):', '        self.children = {}', '    def insert(self, word):', '        node = self', '        for char in word:', '            node = node.children.setdefault(char, Trie())', '        node.is_word = True'],
  'Bit Manipulation': ['def solve(value):', '    answer = 0', '    while value:', '        answer ^= value & 1', '        value >>= 1', '    return answer'],
}

const genericVisualItems: Record<string, string[]> = {
  'One-Pass Arrays': ['read', 'track', 'update', 'answer'], 'Two Pointers': ['left', 'middle', 'right'], 'Sliding Window': ['left', 'window', 'right'], 'Prefix Sum': ['prefix', 'current', 'seen'], 'Binary Search': ['low', 'mid', 'high'], 'Stack': ['push', 'peek', 'pop'], 'Monotonic Stack': ['wait', 'current', 'next'], 'Linked List': ['previous', 'current', 'next'], 'Intervals': ['start', 'overlap', 'end'], 'Heap / Priority Queue': ['smallest', 'candidate', 'largest'], 'Trees - DFS/BFS': ['root', 'left', 'right'], 'Graphs - DFS/BFS': ['start', 'neighbor', 'visited'], 'Topological Sort': ['ready', 'dependency', 'order'], 'Union-Find': ['node A', 'node B', 'root'], 'Backtracking': ['choice', 'path', 'result'], 'Greedy': ['candidate', 'best', 'answer'], 'Dynamic Programming - 1D': ['previous', 'current', 'best'], 'Dynamic Programming - 2D': ['row', 'cell', 'state'], Trie: ['prefix', 'node', 'word'], 'Bit Manipulation': ['bit', 'mask', 'answer'],
}

function makeGenericLesson(problem: Problem): LessonData {
  const category = problem.category ?? problem.topics[0] ?? 'Algorithms'
  const items = genericVisualItems[category] ?? ['input', 'state', 'check', 'result']
  const leetcodeSol = getLeetCodeSolution(problem.title, category)
  const shortName = problem.title

  const steps = [
    lessonStep({
      label: 'Initialize State',
      description: `Prepare memory and pointer variables for ${problem.pattern.toLowerCase()}.`,
      detail: `${problem.pattern} → ready`,
      currentLine: 1,
      visualKind: 'contains-duplicate',
      visualItems: items,
      visualHeading: `${category} Visual Stage`,
      visualCaption: 'initial state',
      customVariables: { pattern: problem.pattern, status: 'ready' },
    }),
    lessonStep({
      label: 'Inspect Current Input',
      description: `Process initial item "${items[0]}" and evaluate algorithm conditions.`,
      detail: `read ${items[0]} → inspect`,
      currentLine: 2,
      activeIndex: 0,
      visualKind: 'contains-duplicate',
      visualItems: items,
      visualHeading: `${category} Visual Stage`,
      visualCaption: 'scanning element 0',
      customVariables: { current: items[0], ptr: 0 },
    }),
    lessonStep({
      label: 'Execute Pattern Update',
      description: `Apply ${problem.pattern.toLowerCase()} state transition.`,
      detail: `${problem.pattern} → update state`,
      currentLine: Math.floor(leetcodeSol.optimizedCode.length / 2),
      activeIndex: 1,
      visualKind: 'contains-duplicate',
      visualItems: items,
      visualHeading: `${category} Visual Stage`,
      visualCaption: 'updating state',
      map: { [problem.pattern]: 1 },
      customVariables: { current: items[1] ?? 'next', status: 'updated' },
    }),
    lessonStep({
      label: 'Validate Invariants',
      description: `Verify constraints and check intermediate state for ${shortName}.`,
      detail: `checking solution condition`,
      currentLine: Math.max(3, leetcodeSol.optimizedCode.length - 2),
      activeIndex: Math.min(2, items.length - 1),
      visualKind: 'contains-duplicate',
      visualItems: items,
      visualHeading: `${category} Visual Stage`,
      visualCaption: 'evaluating condition',
      map: { [problem.pattern]: 1 },
      customVariables: { status: 'checking' },
    }),
    lessonStep({
      label: 'Produce Optimal Answer',
      description: `Target condition satisfied. Returning LeetCode accepted answer for ${shortName}.`,
      detail: `${problem.pattern} → result ready`,
      currentLine: leetcodeSol.optimizedCode.length - 1,
      activeIndex: items.length - 1,
      visualKind: 'contains-duplicate',
      visualItems: items,
      visualHeading: `${category} Visual Stage`,
      visualCaption: 'completed',
      found: true,
      resultText: 'Solution Accepted',
      customVariables: { result: 'Accepted', pattern: problem.pattern },
    }),
  ]

  return {
    ...problem,
    minutes: 6,
    introCopy: `Learn ${problem.pattern.toLowerCase()} through an interactive visual run.`,
    statementTitle: `Solve ${shortName} using ${problem.pattern.toLowerCase()}.`,
    statement: `Given the input parameters for ${shortName}, apply ${problem.pattern.toLowerCase()} to obtain an optimal solution that passes all LeetCode test cases.`,
    input: `input = [example values for ${shortName}]`,
    output: 'optimal result',
    outputNote: `The ${problem.pattern.toLowerCase()} method computes the answer efficiently.`,
    introTitle: `${problem.pattern} Pattern Explained`,
    intro: `Watch how the ${problem.pattern.toLowerCase()} pattern reads input, updates its working memory, and produces the result.`,
    patternTitle: problem.pattern,
    patternDescription: `Track state transitions for ${shortName}.`,
    patternEquation: `input  →  ${problem.pattern}  →  answer`,
    miniSteps: [
      ['Initialize', 'Set up tracking variables.'],
      ['Traverse', 'Process input elements.'],
      ['Return', 'Output optimal answer.'],
    ],
    optimizedTitle: `${problem.pattern} Solution`,
    optimizedExplanation: `This optimal ${problem.pattern.toLowerCase()} algorithm runs in linear time by avoiding nested loops.`,
    optimizedCode: leetcodeSol.optimizedCode,
    bruteCode: leetcodeSol.bruteCode,
    bruteExplanation: 'Brute force method trying all potential combinations.',
    time: 'O(n)',
    space: 'O(n)',
    bruteTime: 'O(n²)',
    bruteSpace: 'O(1)',
    memory: `Recognize the ${problem.pattern.toLowerCase()} pattern, then track state changes cleanly.`,
    steps,
  }
}

for (const problem of allProblems) {
  if (!lessonLibrary[problem.number]) lessonLibrary[problem.number] = makeGenericLesson(problem)
  const leetcodeSol = getLeetCodeSolution(problem.title, problem.category)
  lessonLibrary[problem.number].optimizedCode = leetcodeSol.optimizedCode
  lessonLibrary[problem.number].bruteCode = leetcodeSol.bruteCode
}

const customizeLesson = (number: number, patch: Partial<LessonData>) => {
  lessonLibrary[number] = { ...lessonLibrary[number], ...patch }
}

customizeLesson(121, {
  introCopy: 'Track the cheapest day so every later price can become a selling opportunity.', statementTitle: 'Buy low, then sell high.', statement: 'Given daily prices, choose one day to buy and a later day to sell so the profit is as large as possible.', input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5', outputNote: 'Buy at 1 and sell at 6.', introTitle: 'Keep the best buying price so far.', intro: 'As prices arrive, remember the lowest price we could have bought at. The current price gives a possible profit against that minimum.', patternTitle: 'Running minimum', patternDescription: 'Best profit = current price − lowest price', patternEquation: 'price  −  lowest  →  profit', optimizedTitle: 'One pass with a running minimum', optimizedExplanation: 'We only need the cheapest earlier price and the best profit seen so far.', optimizedCode: ['def max_profit(prices):', '    lowest = prices[0]', '    profit = 0', '    for price in prices:', '        lowest = min(lowest, price)', '        profit = max(profit, price - lowest)', '    return profit'], bruteCode: ['def max_profit(prices):', '    best = 0', '    for buy in range(len(prices)):', '        for sell in range(buy + 1, len(prices)):', '            best = max(best, prices[sell] - prices[buy])', '    return best'], bruteExplanation: 'Try every valid buy/sell pair. It is correct, but repeats comparisons.', time: 'O(n)', space: 'O(1)', bruteTime: 'O(n²)', bruteSpace: 'O(1)', memory: 'Keep the cheapest earlier price, then ask what today earns.', steps: [
    lessonStep({ label: 'Start the tracker', description: 'The first price is our cheapest buying price so far.', detail: 'lowest = 7, profit = 0', currentLine: 1, visualKind: 'contains-duplicate', visualItems: ['7', '1', '5', '3', '6', '4'], visualHeading: 'Daily prices', visualCaption: 'buy low · sell later', customVariables: { price: 7, lowest: 7, profit: 0 } }),
    lessonStep({ label: 'Find a cheaper day', description: 'Price 1 is lower than 7, so update the best buying price.', detail: 'lowest = min(7, 1) = 1', currentLine: 4, activeIndex: 1, visualKind: 'contains-duplicate', visualItems: ['7', '1', '5', '3', '6', '4'], visualHeading: 'Daily prices', visualCaption: 'new lowest = 1', customVariables: { price: 1, lowest: 1, profit: 0 } }),
    lessonStep({ label: 'Calculate today’s profit', description: 'At price 6, buying at 1 would earn 5 — the best profit so far.', detail: '6 − 1 = 5', currentLine: 5, activeIndex: 4, visualKind: 'contains-duplicate', visualItems: ['7', '1', '5', '3', '6', '4'], visualHeading: 'Daily prices', visualCaption: 'best profit = 5', found: true, customVariables: { price: 6, lowest: 1, profit: 5 } }),
    lessonStep({ label: 'Return the best profit', description: 'No later price beats 5, so the answer is 5.', detail: 'return 5', currentLine: 6, activeIndex: 4, visualKind: 'contains-duplicate', visualItems: ['7', '1', '5', '3', '6', '4'], visualHeading: 'Daily prices', visualCaption: 'answer ready', found: true, resultText: '5', customVariables: { lowest: 1, profit: 5, result: 5 } }),
  ],
})

customizeLesson(53, {
  introCopy: 'Keep the strongest subarray ending at each position.', statementTitle: 'Find the contiguous slice with the largest sum.', statement: 'Return the largest possible sum of a non-empty contiguous subarray.', input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', outputNote: 'The best slice is [4, -1, 2, 1].', introTitle: 'Extend the current run or restart.', intro: 'At each number, choose between adding it to the current run or starting a fresh run here. Keep the best total globally.', patternTitle: "Kadane's algorithm", patternDescription: 'current = max(value, current + value)', patternEquation: 'extend  or  restart', optimizedTitle: 'One pass with Kadane’s algorithm', optimizedExplanation: 'The best subarray ending today only depends on yesterday’s best ending subarray.', optimizedCode: ['def max_sub_array(nums):', '    current = best = nums[0]', '    for num in nums[1:]:', '        current = max(num, current + num)', '        best = max(best, current)', '    return best'], bruteCode: ['def max_sub_array(nums):', '    best = nums[0]', '    for i in range(len(nums)):', '        total = 0', '        for j in range(i, len(nums)):', '            total += nums[j]', '            best = max(best, total)', '    return best'], bruteExplanation: 'Try every start and end position, adding each possible subarray.', time: 'O(n)', space: 'O(1)', bruteTime: 'O(n²)', bruteSpace: 'O(1)', memory: 'At every number: extend the run or restart it.', steps: [
    lessonStep({ label: 'Start at -2', description: 'The first value is both the current best ending here and the global best.', detail: 'current = best = -2', currentLine: 1, visualKind: 'contains-duplicate', visualItems: ['-2', '1', '-3', '4', '-1', '2', '1'], visualHeading: 'Array values', visualCaption: 'current = -2', customVariables: { num: -2, current: -2, best: -2 } }),
    lessonStep({ label: 'Restart at 1', description: 'Adding 1 to -2 is worse than starting fresh, so current becomes 1.', detail: 'max(1, -2 + 1) = 1', currentLine: 3, activeIndex: 1, visualKind: 'contains-duplicate', visualItems: ['-2', '1', '-3', '4', '-1', '2', '1'], visualHeading: 'Array values', visualCaption: 'restart at 1', customVariables: { num: 1, current: 1, best: 1 } }),
    lessonStep({ label: 'Build the winning run', description: 'Starting at 4, the run [4, -1, 2, 1] grows to a total of 6.', detail: '4 + -1 + 2 + 1 = 6', currentLine: 4, activeIndex: 6, visualKind: 'contains-duplicate', visualItems: ['-2', '1', '-3', '4', '-1', '2', '1'], visualHeading: 'Array values', visualCaption: 'best = 6', customVariables: { num: 1, current: 6, best: 6 } }),
    lessonStep({ label: 'Return 6', description: 'The largest contiguous sum found during the scan is 6.', detail: 'return best = 6', currentLine: 5, activeIndex: 6, visualKind: 'contains-duplicate', visualItems: ['-2', '1', '-3', '4', '-1', '2', '1'], visualHeading: 'Array values', visualCaption: 'answer ready', found: true, resultText: '6', customVariables: { current: 6, best: 6, result: 6 } }),
  ],
})

customizeLesson(189, { optimizedCode: ['def rotate(nums, k):', '    k %= len(nums)', '    nums.reverse()', '    nums[:k] = reversed(nums[:k])', '    nums[k:] = reversed(nums[k:])', '    return nums'], bruteCode: ['def rotate(nums, k):', '    for _ in range(k):', '        nums.insert(0, nums.pop())', '    return nums'], introTitle: 'Reverse sections to rotate in place.', patternTitle: 'In-place reversal', patternDescription: 'Reverse all, then reverse the two pieces.', patternEquation: 'reverse all  →  reverse parts', output: '[5, 6, 7, 1, 2, 3, 4]', steps: [lessonStep({ label: 'Normalize k', description: 'A rotation by the array length changes nothing, so reduce k first.', detail: 'k = 3', currentLine: 1, visualItems: ['1', '2', '3', '4', '5', '6', '7'], visualHeading: 'Array before rotation', visualCaption: 'rotate right by 3', customVariables: { k: 3, array: '[1, 2, 3, 4, 5, 6, 7]' } }), lessonStep({ label: 'Reverse the full array', description: 'Reversing creates the two pieces in reverse order.', detail: '[7, 6, 5, 4, 3, 2, 1]', currentLine: 2, activeIndex: 0, visualItems: ['7', '6', '5', '4', '3', '2', '1'], visualHeading: 'Array after full reverse', visualCaption: 'reverse()', customVariables: { k: 3, array: '[7, 6, 5, 4, 3, 2, 1]' } }), lessonStep({ label: 'Reverse each piece', description: 'Reverse the first 3 and the remaining values to restore their internal order.', detail: '[5, 6, 7, 1, 2, 3, 4]', currentLine: 4, activeIndex: 2, visualItems: ['5', '6', '7', '1', '2', '3', '4'], visualHeading: 'Rotated array', visualCaption: 'parts reversed', found: true, resultText: '[5, 6, 7, 1, 2, 3, 4]', customVariables: { k: 3, result: '[5, 6, 7, 1, 2, 3, 4]' } })] })

customizeLesson(268, { optimizedCode: ['def missing_number(nums):', '    missing = len(nums)', '    for i, num in enumerate(nums):', '        missing ^= i ^ num', '    return missing'], bruteCode: ['def missing_number(nums):', '    for value in range(len(nums) + 1):', '        if value not in nums:', '            return value'], introTitle: 'XOR cancels matching values.', patternTitle: 'XOR cancellation', patternDescription: 'Every number paired with itself disappears.', patternEquation: 'all values  XOR  seen values', output: '2', steps: [lessonStep({ label: 'Start with the full range', description: 'The range should contain 0 through 3, but one value is missing.', detail: 'missing = 3', currentLine: 1, visualItems: ['0', '1', '2', '3'], visualHeading: 'Expected values', visualCaption: 'nums = [3, 0, 1]', customVariables: { missing: 3 } }), lessonStep({ label: 'Cancel 0 and 1', description: 'XOR pairs equal values together, removing them from the running result.', detail: '3 ^ 0 ^ 1 ^ 3 ^ 0 ^ 1 = 2', currentLine: 3, activeIndex: 1, visualItems: ['0', '1', '2', '3'], visualHeading: 'XOR scan', visualCaption: 'matching values cancel', customVariables: { i: 1, num: 0, missing: 2 } }), lessonStep({ label: 'Return the leftover', description: 'Only 2 has no matching pair, so it is the missing number.', detail: 'return 2', currentLine: 4, activeIndex: 2, visualItems: ['0', '1', '2', '3'], visualHeading: 'XOR scan', visualCaption: 'answer = 2', found: true, resultText: '2', customVariables: { missing: 2, result: 2 } })] })

customizeLesson(136, { optimizedCode: ['def single_number(nums):', '    answer = 0', '    for num in nums:', '        answer ^= num', '    return answer'], bruteCode: ['def single_number(nums):', '    for num in nums:', '        if nums.count(num) == 1:', '            return num'], introTitle: 'Pairs disappear; one value remains.', patternTitle: 'XOR cancellation', patternDescription: 'a XOR a = 0, and 0 XOR x = x.', patternEquation: 'pairs  →  0  +  single  →  answer', output: '4', steps: [lessonStep({ label: 'Start at zero', description: 'XOR begins with 0, which does not change the first value.', detail: 'answer = 0', currentLine: 1, visualItems: ['4', '1', '2', '1', '2'], visualHeading: 'Values to cancel', visualCaption: 'answer = 0', customVariables: { answer: 0 } }), lessonStep({ label: 'Cancel matching pairs', description: '1 XOR 1 and 2 XOR 2 both become zero.', detail: '1 ^ 1 = 0, 2 ^ 2 = 0', currentLine: 3, activeIndex: 3, visualItems: ['4', '1', '2', '1', '2'], visualHeading: 'Values to cancel', visualCaption: 'pairs disappear', customVariables: { num: 2, answer: 4 } }), lessonStep({ label: 'Return the single value', description: 'The only value without a pair is 4.', detail: 'return 4', currentLine: 4, activeIndex: 0, visualItems: ['4', '1', '2', '1', '2'], visualHeading: 'Values to cancel', visualCaption: 'answer = 4', found: true, resultText: '4', customVariables: { answer: 4, result: 4 } })] })

customizeLesson(169, { optimizedCode: ['def majority_element(nums):', '    candidate = None', '    count = 0', '    for num in nums:', '        if count == 0:', '            candidate = num', '        count += 1 if num == candidate else -1', '    return candidate'], bruteCode: ['def majority_element(nums):', '    for num in nums:', '        if nums.count(num) > len(nums) // 2:', '            return num'], introTitle: 'Let pairs vote each other out.', patternTitle: 'Boyer-Moore voting', patternDescription: 'The majority survives every cancellation.', patternEquation: 'same vote +1  ·  other vote −1', output: '2', steps: [lessonStep({ label: 'Choose a candidate', description: 'Start with the first value as the candidate and give it one vote.', detail: 'candidate = 2, count = 1', currentLine: 1, visualItems: ['2', '2', '1', '1', '1', '2', '2'], visualHeading: 'Votes', visualCaption: 'candidate = 2', customVariables: { candidate: 2, count: 1 } }), lessonStep({ label: 'Cancel opposing votes', description: 'A different value removes one vote from the current candidate.', detail: 'count decreases for a 1', currentLine: 5, activeIndex: 2, visualItems: ['2', '2', '1', '1', '1', '2', '2'], visualHeading: 'Votes', visualCaption: 'votes cancel', customVariables: { candidate: 2, count: 1, num: 1 } }), lessonStep({ label: 'Majority remains', description: 'After all cancellations, 2 has the only vote advantage.', detail: 'return candidate = 2', currentLine: 6, activeIndex: 6, visualItems: ['2', '2', '1', '1', '1', '2', '2'], visualHeading: 'Votes', visualCaption: 'answer = 2', found: true, resultText: '2', customVariables: { candidate: 2, count: 3, result: 2 } })] })

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [topic, setTopic] = useState('All topics')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [codeMode, setCodeMode] = useState<'optimized' | 'brute'>('optimized')
  const [toast, setToast] = useState('')
  const [selectedProblemNumber, setSelectedProblemNumber] = useState(1)
  const [copied, setCopied] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const currentLesson = lessonLibrary[selectedProblemNumber] ?? lessonLibrary[1]

  useEffect(() => {
    const cat = currentLesson.category ?? (currentLesson.topics.includes('Arrays') && currentLesson.topics.includes('Hashing') ? 'Arrays & Hashing' : 'More Patterns')
    if (cat) {
      setExpandedCategories((prev) => ({ ...prev, [cat]: true }))
    }
  }, [selectedProblemNumber, currentLesson.category, currentLesson.topics])

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }
  const copySolution = () => {
    const codeLines = codeMode === 'optimized' ? currentLesson.optimizedCode : currentLesson.bruteCode
    navigator.clipboard.writeText(codeLines.join('\n'))
    setCopied(true)
    setToast('Copied LeetCode solution to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }
  const animationSteps = currentLesson.steps
  const activeStep = currentLesson.steps[step] ?? currentLesson.steps[0]
  const filteredProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return allProblems.filter((problem) => {
      const matchesQuery = !normalized || [problem.title, problem.number, problem.pattern, ...problem.topics].join(' ').toLowerCase().includes(normalized)
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty
      const matchesTopic = topic === 'All topics' || problem.topics.includes(topic)
      return matchesQuery && matchesDifficulty && matchesTopic
    })
  }, [difficulty, query, topic])
  const groupedProblems = useMemo(() => {
    const groups = new Map<string, Problem[]>()
    filteredProblems.forEach((problem) => {
      const category = problem.category ?? (problem.topics.includes('Arrays') && problem.topics.includes('Hashing') ? 'Arrays & Hashing' : 'More Patterns')
      groups.set(category, [...(groups.get(category) ?? []), problem])
    })
    return Array.from(groups.entries())
  }, [filteredProblems])

  useEffect(() => {
    if (!isPlaying) return
    if (step >= currentLesson.steps.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, currentLesson.steps.length - 1)), 1200 / speed)
    return () => window.clearTimeout(timer)
  }, [currentLesson.steps.length, isPlaying, speed, step])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const goToStep = (nextStep: number) => {
    setIsPlaying(false)
    setStep(Math.max(0, Math.min(currentLesson.steps.length - 1, nextStep)))
  }

  const restart = () => {
    setIsPlaying(false)
    setStep(0)
  }

  const selectProblem = (number: number) => {
    setSelectedProblemNumber(number)
    setStep(0)
    setIsPlaying(false)
    setCodeMode('optimized')
  }

  return (
    <div className="app" data-theme={theme}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={16} strokeWidth={2.5} /></div>
          <span>leet<span className="brand-accent">mastery</span></span>
        </div>
        <div className="topbar-center">
          <div className="global-search">
            <Search size={15} />
            <input aria-label="Search problems" placeholder="Search problems, patterns..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <kbd><Command size={11} /> K</kbd>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="icon-button quiet" aria-label="Help" onClick={() => setToast('Tip: use the step controls to watch every lookup.') }><CircleHelp size={18} /></button>
          <button className="icon-button quiet" aria-label="Toggle theme" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <span>Problem library</span>
            <span className="count-badge">{allProblems.length}</span>
          </div>
          <div className="side-search"><Search size={14} /><input aria-label="Filter library" placeholder="Filter library" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></div>
          <div className="filter-row">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => (
              <button key={level} className={`filter-pill ${difficulty === level ? 'selected' : ''} ${level.toLowerCase()}`} onClick={() => setDifficulty(level)}>{level === 'All' ? 'All' : <><span className="difficulty-dot" />{level}</>}</button>
            ))}
          </div>
          <div className="topic-select-wrap"><Filter size={13} /><select aria-label="Filter by topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option>All topics</option><option>Arrays</option><option>Hashing</option><option>Strings</option><option>Two Pointer</option><option>Sliding Window</option><option>Binary Search</option><option>Stack</option><option>Linked List</option><option>Trees</option><option>Graphs</option></select><ChevronDown size={14} /></div>
          <div className="library-list">
            {groupedProblems.map(([category, categoryProblems]) => {
              const isOpen = query.trim() !== '' || expandedCategories[category]
              return (
                <div className="library-section" key={category}>
                  <button className="list-label-button" onClick={() => toggleCategory(category)}>
                    <div className="category-title">
                      <ChevronDown size={13} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                      <span>{category}</span>
                    </div>
                    <span className="category-count">{categoryProblems.length} lessons</span>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
                      {categoryProblems.map((problem) => (
                        <ProblemRow key={problem.number} problem={problem} active={selectedProblemNumber === problem.number} onSelect={selectProblem} />
                      ))}
                    </motion.div>
                  )}
                </div>
              )
            })}
            {!filteredProblems.length && <div className="empty-list">No matching lessons yet.</div>}
          </div>
          <div className="sidebar-footer">
            <div className="progress-line"><span>Your progress</span><strong>1 / {allProblems.length}</strong></div>
            <div className="progress-track"><span style={{ width: `${(1 / allProblems.length) * 100}%` }} /></div>
            <div className="streak"><div className="streak-icon"><Zap size={14} fill="currentColor" /></div><span><strong>1 day streak</strong><small>Keep the momentum going</small></span><ArrowRight size={14} /></div>
          </div>
        </aside>

        <main className="main-content">
          <div className="breadcrumbs"><span>Algorithms</span><ArrowRight size={13} /><span>{currentLesson.topics.join(' & ')}</span><ArrowRight size={13} /><strong>{currentLesson.title}</strong></div>
          <section className="page-intro">
            <div>
              <div className="eyebrow"><span className="status-dot" /> Lesson {String(allProblems.findIndex((problem) => problem.number === currentLesson.number) + 1).padStart(2, '0')} <span className="eyebrow-divider" /> {currentLesson.minutes} min read</div>
              <h1>{currentLesson.title}</h1>
              <p className="intro-copy">{currentLesson.introCopy}</p>
            </div>
            <a className="leetcode-link" href={currentLesson.url} target="_blank" rel="noreferrer">Open on LeetCode <ExternalLink size={14} /></a>
          </section>

          <section className="problem-summary panel">
            <div className="summary-title-row"><div className="section-kicker"><BookOpen size={14} /> The problem</div><div className="tag-row"><span className={`difficulty-tag ${currentLesson.difficulty.toLowerCase()}`}>{currentLesson.difficulty}</span>{currentLesson.topics.map((item) => <span className="topic-tag" key={item}>{item}</span>)}</div></div>
            <h2>{currentLesson.statementTitle}</h2>
            <p>{currentLesson.statement}</p>
            <div className="example-row">
              <div className="example-block"><span className="example-label">Example input</span><code>{currentLesson.input.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</code></div>
              <div className="example-arrow"><ArrowRight size={16} /></div>
              <div className="example-block output"><span className="example-label">Example output</span><code>{currentLesson.output}</code></div>
              <div className="example-note"><span className="note-bullet" />{currentLesson.outputNote}</div>
            </div>
          </section>

          <div className="content-grid">
            <div className="left-column">
              <section className="panel lesson-card">
                <div className="section-kicker"><Lightbulb size={14} /> Make it click</div>
                <h2>{currentLesson.introTitle}</h2>
                <p>{currentLesson.intro}</p>
                <div className="pattern-card"><div className="pattern-icon"><Hash size={16} /></div><div><span className="pattern-label">Pattern to notice</span><strong>{currentLesson.patternTitle}</strong><p>{currentLesson.patternDescription}</p></div><div className="pattern-equation"><span>{currentLesson.patternEquation}</span></div></div>
                <div className="mini-steps">{currentLesson.miniSteps.map(([title, description], index) => <div className="mini-step" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{description}</p></div></div>)}</div>
              </section>

              <section className="panel code-card">
                <div className="code-header">
                  <div>
                    <div className="section-kicker"><Code2 size={14} /> Python solution</div>
                    <h2>{codeMode === 'optimized' ? currentLesson.optimizedTitle : 'The simple first attempt'}</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="leetcode-copy-btn" onClick={copySolution} title="Copy code for LeetCode">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Copied!' : 'Copy for LeetCode'}</span>
                    </button>
                    <div className="code-toggle">
                      <button className={codeMode === 'optimized' ? 'active' : ''} onClick={() => setCodeMode('optimized')}>Optimized</button>
                      <button className={codeMode === 'brute' ? 'active' : ''} onClick={() => setCodeMode('brute')}>Brute force</button>
                    </div>
                  </div>
                </div>
                <p className="code-explanation">{codeMode === 'optimized' ? currentLesson.optimizedExplanation : currentLesson.bruteExplanation}</p>
                <div className="code-window"><div className="window-bar"><span className="window-dots"><i /><i /><i /></span><span className="file-name"><TerminalSquare size={13} /> {currentLesson.title.toLowerCase().replace(/ /g, '_')}.py</span><span className="language-badge">Python</span></div><div className="code-body">{(codeMode === 'optimized' ? currentLesson.optimizedCode : currentLesson.bruteCode).map((line, index) => { const isActive = codeMode === 'optimized' && activeStep.currentLine === index; return <div className={`code-line ${isActive ? 'active' : ''}`} key={`${codeMode}-${index}`}><span className="line-number">{String(index + 1).padStart(2, '0')}</span><code>{highlightPython(line)}</code></div> })}</div></div>
                <div className="complexity-inline"><div><Clock3 size={14} /><span>Time <strong>{codeMode === 'optimized' ? currentLesson.time : currentLesson.bruteTime}</strong></span></div><div><Hash size={14} /><span>Space <strong>{codeMode === 'optimized' ? currentLesson.space : currentLesson.bruteSpace}</strong></span></div></div>
              </section>
            </div>

            <section className="panel visualizer-card">
              <div className="visualizer-heading"><div><div className="section-kicker"><FlaskConical size={14} /> Algorithm lab</div><h2>Watch it run</h2></div><span className="live-pill"><span /> Live</span></div>
              <div className="visualizer-subhead"><span>Optimized solution</span><span className="step-count">Step {step + 1} <span>/</span> {currentLesson.steps.length}</span></div>
              <div className="progress-bar"><motion.span animate={{ width: `${((step + 1) / currentLesson.steps.length) * 100}%` }} transition={{ duration: 0.35 }} /></div>
              <GenericStage activeStep={activeStep} />
              <div className="step-explanation"><div className="step-icon"><Sparkles size={14} /></div><div><span>Step {String(step + 1).padStart(2, '0')} · {activeStep.label}</span><strong>{activeStep.detail || 'Follow the highlighted code line.'}</strong></div></div>
              <div className="controller"><button className="control-button" aria-label="Restart" onClick={restart}><RotateCcw size={15} /></button><button className="control-button" aria-label="Previous step" onClick={() => goToStep(step - 1)} disabled={step === 0}><ArrowLeft size={15} /></button><button className="play-button" onClick={() => step >= animationSteps.length - 1 ? restart() : setIsPlaying((current) => !current)}>{isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}<span>{isPlaying ? 'Pause' : step >= animationSteps.length - 1 ? 'Replay' : 'Play'}</span></button><button className="control-button" aria-label="Next step" onClick={() => goToStep(step + 1)} disabled={step === animationSteps.length - 1}><ArrowRight size={15} /></button><div className="speed-control"><span>Speed</span><input aria-label="Animation speed" type="range" min="0.5" max="2" step="0.5" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /><strong>{speed}×</strong></div></div>
            </section>
          </div>

          <section className="bottom-grid">
            <div className="panel complexity-card"><div className="section-kicker"><Zap size={14} /> Why this works</div><h2>Trade memory for a faster lookup.</h2><p>{currentLesson.optimizedExplanation}</p><div className="complexity-bars"><div className="bar-row"><span>Brute force</span><div className="bar-track"><span className="slow" /></div><strong>{currentLesson.bruteTime}</strong></div><div className="bar-row"><span>Optimized</span><div className="bar-track"><span className="fast" /></div><strong>{currentLesson.time}</strong></div></div></div>
            <div className="panel remember-card"><div className="remember-top"><div className="fire-icon">✦</div><div className="section-kicker">Remember this</div></div><blockquote>“{currentLesson.memory}”</blockquote><div className="remember-footer"><span>{currentLesson.title} · {currentLesson.pattern}</span><ArrowUpRight size={14} /></div></div>
          </section>
          <footer className="footer"><span>Built for the moment it finally clicks.</span><span><span className="footer-dot" /> Lesson progress saves automatically</span></footer>
        </main>
      </div>
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Sparkles size={14} />{toast}<button onClick={() => setToast('')}><X size={13} /></button></motion.div>}</AnimatePresence>
    </div>
  )
}

function Variable({ label, value, color }: { label: string; value: string | number; color: string }) {
  return <div className="variable"><span className={`variable-dot ${color}`} /><span>{label}</span><strong>{value}</strong></div>
}

function GenericStage({ activeStep }: { activeStep: AnimationStep }) {
  const variables = Object.entries(activeStep.customVariables ?? {})
  return <div className={`generic-stage ${activeStep.visualKind ?? ''}`}>
    <div className="array-label-row"><span>{activeStep.visualHeading ?? 'Algorithm state'}</span><span className="target-chip">{activeStep.visualCaption ?? 'working memory'}</span></div>
    {activeStep.visualRows && <div className={`visual-rows ${activeStep.visualKind === 'sudoku' ? 'sudoku-grid' : ''}`}>{activeStep.visualRows.map((row) => <div className="visual-row" key={row.label}><span className="visual-row-label">{row.label}</span><div className="generic-items">{row.items.map((item, index) => <motion.div layout key={`${row.label}-${index}`} className={`generic-cell ${activeStep.activeIndex === index ? 'active' : ''} ${activeStep.found && activeStep.activeIndex === index ? 'answer' : ''}`}><span>{item}</span></motion.div>)}</div></div>)}</div>}
    {activeStep.visualItems && <div className="generic-items">{activeStep.visualItems.map((item, index) => <motion.div layout key={`${item}-${index}`} className={`generic-cell ${activeStep.activeIndex === index ? 'active' : ''} ${activeStep.found && activeStep.activeIndex === index ? 'answer' : ''}`}><small>{index}</small><span>{item}</span></motion.div>)}</div>}
    {activeStep.visualGroups && <div className="generic-groups">{activeStep.visualGroups.map((group) => <motion.div layout className={`generic-group ${group.tone ?? ''}`} key={group.label}><span>{group.label}</span><ArrowRight size={12} /><strong>{group.value}</strong></motion.div>)}</div>}
    <div className="generic-operation operation-card"><div className="operation-top"><span className="operation-label">Current operation</span><span className={`operation-state ${activeStep.found ? 'found' : ''}`}>{activeStep.found ? 'Result found' : activeStep.label}</span></div><div className="operation-equation"><span className="operation-placeholder">{activeStep.detail || activeStep.resultText}</span></div><p>{activeStep.description}</p></div>
    {!activeStep.visualGroups && Object.keys(activeStep.map).length > 0 && <div className="map-card"><div className="map-heading"><span><Hash size={14} /> Working map</span><small>{Object.keys(activeStep.map).length} entries</small></div><div className="map-values">{Object.entries(activeStep.map).map(([key, value]) => <motion.div layout className="map-entry" key={key}><span>{key}</span><ArrowRight size={12} /><span className="map-index">{value}</span></motion.div>)}</div></div>}
    {variables.length > 0 && <div className="variables-card"><div className="variables-heading"><span>Live variables</span><span className="sync-label"><span /> synced to line {activeStep.currentLine + 1}</span></div><div className="variables-grid generic-variable-grid">{variables.map(([label, value], index) => <Variable key={label} label={label} value={value} color={['purple', 'yellow', 'green', 'blue'][index % 4]} />)}</div></div>}
  </div>
}

function ProblemRow({ problem, active, onSelect }: { problem: Problem; active: boolean; onSelect: (number: number) => void }) {
  return <button className={`problem-item ${active ? 'active' : ''}`} onClick={() => onSelect(problem.number)}>
    <span className="problem-number">{String(problem.number).padStart(3, '0')}</span>
    <span className="problem-item-copy"><span>{problem.title}</span><small>{problem.pattern}</small></span>
    {problem.solved ? <span className="solved-mark"><Check size={11} /></span> : <span className={`mini-difficulty ${problem.difficulty.toLowerCase()}`} />}
    <ExternalLink className="library-link-icon" size={11} />
  </button>
}

function highlightPython(line: string) {
  const tokens = line.split(/(\b(?:class|def|for|in|if|else|elif|while|return|range|len|enumerate|self|List|int|str|bool|Optional|TreeNode|ListNode|set|dict|float|import|from|as|True|False|None)\b|\b(?:nums|target|seen|need|num|i|j|head|root|res|ans|dp|stack|queue|cur|prev|next|l|r|m|n|k|c|val|count|grid|board)\b|[{}[\]():,=+\-*\/<>#.&])/g)
  return tokens.map((token, index) => {
    let className = ''
    if (/^(class|def|for|in|if|else|elif|while|return|range|len|enumerate|self|List|int|str|bool|Optional|TreeNode|ListNode|set|dict|float|import|from|as|True|False|None)$/.test(token)) className = 'syntax-keyword'
    else if (/^(nums|target|seen|need|num|i|j|head|root|res|ans|dp|stack|queue|cur|prev|next|l|r|m|n|k|c|val|count|grid|board)$/.test(token)) className = 'syntax-variable'
    else if (/^[0-9]+$/.test(token)) className = 'syntax-number'
    else if (/^[{}[\]():,=+\-*\/<>#.&]$/.test(token)) className = 'syntax-punctuation'
    return <span className={className} key={`${token}-${index}`}>{token}</span>
  })
}

export default App
