export interface ProblemVisualizerInfo {
  problemNumber: number
  title: string
  subtitle: string
  path: string
  badge: string
  description: string
  highlights: string[]
}

export const PROBLEM_VISUALIZERS: Record<number, ProblemVisualizerInfo> = {
  226: {
    problemNumber: 226,
    title: 'Invert Binary Tree',
    subtitle: 'Interactive Recursion Tutor & Physical Pointer Swaps',
    path: '/visualizers/226.html',
    badge: 'Recursion Tutor',
    description: 'Step-by-step recursion mental model: call stack inspection, child returns, tuple staging, and dynamic pointer swap animations.',
    highlights: ['Beginner & Interview Modes', 'Tuple Staging & Variable Watch', 'Animated Floating Return Packets', 'Interactive Custom Tree Builder'],
  },
  104: {
    problemNumber: 104,
    title: 'Maximum Depth of Binary Tree',
    subtitle: 'Patient Visual Teacher with Skyscraper Floor Analogy',
    path: '/visualizers/104.html',
    badge: 'Beginner Teacher',
    description: 'Step-by-step recursive DFS: query children, return 0 for None, take the taller branch, add 1 for self, and bubble results up to the root.',
    highlights: ['Skyscraper Floor Analogy Modal', '226 vs 104 Mental Model Comparison', 'Interactive Quiz Checkpoint', 'Longest Path Tracer'],
  },
  111: {
    problemNumber: 111,
    title: 'Minimum Depth of Binary Tree',
    subtitle: 'BFS Level-Order Early-Exit Visualizer with Physical Queue',
    path: '/visualizers/111.html',
    badge: 'BFS Early-Exit',
    description: 'Explore tree level-by-level with collections.deque. The first leaf encountered immediately yields the minimum depth and prunes remaining branches.',
    highlights: ['Physical FIFO Queue (popleft / append)', 'Depth Level Scanlines', 'Water Ripple Analogy', 'Subtree Pruning Visualization'],
  },
  543: {
    problemNumber: 543,
    title: 'Diameter of Binary Tree',
    subtitle: 'Zero-Knowledge Visualizer with Height vs Diameter & nonlocal Scope',
    path: '/visualizers/543.html',
    badge: 'Zero-Knowledge Trace',
    description: 'Line-by-line Python interpreter trace demonstrating nonlocal max_d, the dual formulas (l + r vs 1 + max), and the synchronized SVG tree canvas.',
    highlights: ['Exact Python Code Line Highlighter', 'Nonlocal Scope Enclosure Visualizer', 'Live Height vs Diameter Math Card', 'Subtree Dominates Preset'],
  },
  110: {
    problemNumber: 110,
    title: 'Balanced Binary Tree',
    subtitle: 'Optimal Bottom-Up Postorder DFS with -1 Early Exit',
    path: '/visualizers/110.html',
    badge: 'Optimal DFS O(N)',
    description: 'Bottom-up postorder DFS checking |left - right| ≤ 1 at every node with emergency -1 signal propagation and mathematically collision-free tree layout.',
    highlights: ['Live Balance Calculation Card', 'Emergency -1 Early Exit Banner', 'Zoom/Pan Tree Canvas', 'Audio Synthesizer Effects'],
  },
  100: {
    problemNumber: 100,
    title: 'Same Tree',
    subtitle: 'Simultaneous Pairwise DFS & Short-Circuiting Visualizer',
    path: '/visualizers/100.html',
    badge: 'Simultaneous DFS',
    description: 'Line-by-line simultaneous recursion trace: base case null comparisons, short-circuit evaluation, active laser bridge, and visual call stack unwinding.',
    highlights: ['Dual Tree Laser Comparison Bridge', 'Exact Python Code Line Highlighter', 'Call Stack & Stack Frame Inspector', 'Short-Circuit "AND" Condition Engine', 'Tactile Sound Synthesizer & Roadmap'],
  },
}

export function hasVisualizer(problemNumber: number): boolean {
  return Boolean(PROBLEM_VISUALIZERS[problemNumber])
}

export function getVisualizer(problemNumber: number): ProblemVisualizerInfo | undefined {
  return PROBLEM_VISUALIZERS[problemNumber]
}
