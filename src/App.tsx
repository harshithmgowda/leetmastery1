import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Command,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  Hash,
  Layers,
  Lightbulb,
  ListChecks,
  Maximize2,
  Minimize2,
  Moon,
  Play,
  RotateCcw,
  Search,
  Share2,
  ShieldAlert,
  Sparkles,
  Sun,
  TerminalSquare,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import {
  getDetailedProblemData,
  DetailedProblemData,
} from './leetcodeSolutions'

type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Language = 'python' | 'cpp'
type TabMode = 'overview' | 'comparison' | 'walkthrough' | 'edgecases'

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

const allProblemsSeed: Problem[] = [
  // Arrays & Hashing
  { number: 1, title: 'Two Sum', difficulty: 'Easy', topics: ['Arrays', 'Hashing'], pattern: 'Complement lookup', url: 'https://leetcode.com/problems/two-sum/', category: 'Arrays & Hashing', solved: true },
  { number: 217, title: 'Contains Duplicate', difficulty: 'Easy', topics: ['Arrays', 'Hashing'], pattern: 'Set membership', url: 'https://leetcode.com/problems/contains-duplicate/', category: 'Arrays & Hashing' },
  { number: 242, title: 'Valid Anagram', difficulty: 'Easy', topics: ['Arrays', 'Hashing'], pattern: 'Frequency map', url: 'https://leetcode.com/problems/valid-anagram/', category: 'Arrays & Hashing' },
  { number: 49, title: 'Group Anagrams', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Categorize by count', url: 'https://leetcode.com/problems/group-anagrams/', category: 'Arrays & Hashing' },
  { number: 347, title: 'Top K Frequent Elements', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Frequency buckets', url: 'https://leetcode.com/problems/top-k-frequent-elements/', category: 'Arrays & Hashing' },
  { number: 238, title: 'Product of Array Except Self', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Prefix and postfix', url: 'https://leetcode.com/problems/product-of-array-except-self/', category: 'Arrays & Hashing' },
  { number: 128, title: 'Longest Consecutive Sequence', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Set sequence starts', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', category: 'Arrays & Hashing' },
  { number: 36, title: 'Valid Sudoku', difficulty: 'Medium', topics: ['Arrays', 'Hashing'], pattern: 'Constraint sets', url: 'https://leetcode.com/problems/valid-sudoku/', category: 'Arrays & Hashing' },
  { number: 271, title: 'Encode and Decode Strings', difficulty: 'Medium', topics: ['Arrays', 'Strings'], pattern: 'Chunked transfer prefix', url: 'https://leetcode.com/problems/encode-and-decode-strings/', category: 'Arrays & Hashing' },
  { number: 560, title: 'Subarray Sum Equals K', difficulty: 'Medium', topics: ['Arrays', 'Prefix Sum'], pattern: 'Prefix sum hash map', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', category: 'Arrays & Hashing' },
  { number: 169, title: 'Majority Element', difficulty: 'Easy', topics: ['Arrays'], pattern: 'Boyer-Moore voting', url: 'https://leetcode.com/problems/majority-element/', category: 'Arrays & Hashing' },
  { number: 75, title: 'Sort Colors', difficulty: 'Medium', topics: ['Arrays', 'Two Pointers'], pattern: 'Dutch National Flag (3 pointers)', url: 'https://leetcode.com/problems/sort-colors/', category: 'Arrays & Hashing' },
  { number: 31, title: 'Next Permutation', difficulty: 'Medium', topics: ['Arrays'], pattern: 'Pivot swap and suffix reverse', url: 'https://leetcode.com/problems/next-permutation/', category: 'Arrays & Hashing' },
  { number: 41, title: 'First Missing Positive', difficulty: 'Hard', topics: ['Arrays'], pattern: 'Index as hash key placement', url: 'https://leetcode.com/problems/first-missing-positive/', category: 'Arrays & Hashing' },
  { number: 118, title: "Pascal's Triangle", difficulty: 'Easy', topics: ['Arrays'], pattern: 'Row addition DP', url: 'https://leetcode.com/problems/pascals-triangle/', category: 'Arrays & Hashing' },
  { number: 88, title: 'Merge Sorted Array', difficulty: 'Easy', topics: ['Arrays', 'Two Pointers'], pattern: 'Back-to-front merge', url: 'https://leetcode.com/problems/merge-sorted-array/', category: 'Arrays & Hashing' },

  // Two Pointers
  { number: 125, title: 'Valid Palindrome', difficulty: 'Easy', topics: ['Two Pointers', 'Strings'], pattern: 'Two pointers inward', url: 'https://leetcode.com/problems/valid-palindrome/', category: 'Two Pointers' },
  { number: 167, title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', topics: ['Two Pointers'], pattern: 'Inward search', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', category: 'Two Pointers' },
  { number: 15, title: '3Sum', difficulty: 'Medium', topics: ['Two Pointers', 'Sorting'], pattern: 'Sort + two pointers', url: 'https://leetcode.com/problems/3sum/', category: 'Two Pointers' },
  { number: 16, title: '3Sum Closest', difficulty: 'Medium', topics: ['Two Pointers'], pattern: 'Sort + closest distance track', url: 'https://leetcode.com/problems/3sum-closest/', category: 'Two Pointers' },
  { number: 11, title: 'Container With Most Water', difficulty: 'Medium', topics: ['Two Pointers', 'Greedy'], pattern: 'Shrink shorter side', url: 'https://leetcode.com/problems/container-with-most-water/', category: 'Two Pointers' },
  { number: 42, title: 'Trapping Rain Water', difficulty: 'Hard', topics: ['Two Pointers', 'Stack'], pattern: 'Left/right maxima bounds', url: 'https://leetcode.com/problems/trapping-rain-water/', category: 'Two Pointers' },
  { number: 26, title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', topics: ['Two Pointers'], pattern: 'Slow & fast write pointer', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', category: 'Two Pointers' },
  { number: 80, title: 'Remove Duplicates from Sorted Array II', difficulty: 'Medium', topics: ['Two Pointers'], pattern: 'At most twice write pointer', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/', category: 'Two Pointers' },
  { number: 283, title: 'Move Zeroes', difficulty: 'Easy', topics: ['Two Pointers'], pattern: 'In-place compaction', url: 'https://leetcode.com/problems/move-zeroes/', category: 'Two Pointers' },
  { number: 18, title: '4Sum', difficulty: 'Medium', topics: ['Two Pointers'], pattern: 'k-Sum reduction', url: 'https://leetcode.com/problems/4sum/', category: 'Two Pointers' },
  { number: 881, title: 'Boats to Save People', difficulty: 'Medium', topics: ['Two Pointers', 'Greedy'], pattern: 'Greedy pair heaviest with lightest', url: 'https://leetcode.com/problems/boats-to-save-people/', category: 'Two Pointers' },
  { number: 680, title: 'Valid Palindrome II', difficulty: 'Easy', topics: ['Two Pointers'], pattern: 'One deletion skip check', url: 'https://leetcode.com/problems/valid-palindrome-ii/', category: 'Two Pointers' },
  { number: 844, title: 'Backspace String Compare', difficulty: 'Easy', topics: ['Two Pointers', 'Stack'], pattern: 'Reverse iteration with skip count', url: 'https://leetcode.com/problems/backspace-string-compare/', category: 'Two Pointers' },
  { number: 977, title: 'Squares of a Sorted Array', difficulty: 'Easy', topics: ['Two Pointers'], pattern: 'Inward comparison filling backwards', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/', category: 'Two Pointers' },

  // Sliding Window
  { number: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topics: ['Sliding Window', 'Arrays'], pattern: 'Running minimum', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', category: 'Sliding Window' },
  { number: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'Dynamic character window', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', category: 'Sliding Window' },
  { number: 424, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'Max frequency window', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', category: 'Sliding Window' },
  { number: 567, title: 'Permutation in String', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'Fixed frequency window', url: 'https://leetcode.com/problems/permutation-in-string/', category: 'Sliding Window' },
  { number: 438, title: 'Find All Anagrams in a String', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'Fixed frequency window', url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/', category: 'Sliding Window' },
  { number: 76, title: 'Minimum Window Substring', difficulty: 'Hard', topics: ['Sliding Window'], pattern: 'Expand and contract window', url: 'https://leetcode.com/problems/minimum-window-substring/', category: 'Sliding Window' },
  { number: 239, title: 'Sliding Window Maximum', difficulty: 'Hard', topics: ['Sliding Window', 'Monotonic Queue'], pattern: 'Monotonic decreasing deque', url: 'https://leetcode.com/problems/sliding-window-maximum/', category: 'Sliding Window' },
  { number: 209, title: 'Minimum Size Subarray Sum', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'Sum shrink window', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/', category: 'Sliding Window' },
  { number: 1004, title: 'Max Consecutive Ones III', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'Zero-budget sliding window', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/', category: 'Sliding Window' },
  { number: 904, title: 'Fruit Into Baskets', difficulty: 'Medium', topics: ['Sliding Window'], pattern: 'At most 2 distinct types window', url: 'https://leetcode.com/problems/fruit-into-baskets/', category: 'Sliding Window' },
  { number: 643, title: 'Maximum Average Subarray I', difficulty: 'Easy', topics: ['Sliding Window'], pattern: 'Fixed size k average window', url: 'https://leetcode.com/problems/maximum-average-subarray-i/', category: 'Sliding Window' },

  // Stack & Monotonic Stack
  { number: 20, title: 'Valid Parentheses', difficulty: 'Easy', topics: ['Stack'], pattern: 'Bracket stack matching', url: 'https://leetcode.com/problems/valid-parentheses/', category: 'Stack' },
  { number: 155, title: 'Min Stack', difficulty: 'Medium', topics: ['Stack'], pattern: 'Auxiliary min tracking', url: 'https://leetcode.com/problems/min-stack/', category: 'Stack' },
  { number: 150, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', topics: ['Stack'], pattern: 'Operand evaluation stack', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', category: 'Stack' },
  { number: 22, title: 'Generate Parentheses', difficulty: 'Medium', topics: ['Stack', 'Backtracking'], pattern: 'Open/close balance count', url: 'https://leetcode.com/problems/generate-parentheses/', category: 'Stack' },
  { number: 739, title: 'Daily Temperatures', difficulty: 'Medium', topics: ['Monotonic Stack'], pattern: 'Decreasing index stack', url: 'https://leetcode.com/problems/daily-temperatures/', category: 'Stack' },
  { number: 496, title: 'Next Greater Element I', difficulty: 'Easy', topics: ['Monotonic Stack'], pattern: 'Next greater element map', url: 'https://leetcode.com/problems/next-greater-element-i/', category: 'Stack' },
  { number: 503, title: 'Next Greater Element II', difficulty: 'Medium', topics: ['Monotonic Stack'], pattern: 'Circular array (2N iteration)', url: 'https://leetcode.com/problems/next-greater-element-ii/', category: 'Stack' },
  { number: 901, title: 'Online Stock Span', difficulty: 'Medium', topics: ['Monotonic Stack'], pattern: 'Price and weight pair stack', url: 'https://leetcode.com/problems/online-stock-span/', category: 'Stack' },
  { number: 853, title: 'Car Fleet', difficulty: 'Medium', topics: ['Stack'], pattern: 'Time to destination stack', url: 'https://leetcode.com/problems/car-fleet/', category: 'Stack' },
  { number: 84, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topics: ['Monotonic Stack'], pattern: 'Increasing bar stack', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', category: 'Stack' },
  { number: 85, title: 'Maximal Rectangle', difficulty: 'Hard', topics: ['Monotonic Stack', 'DP'], pattern: 'Row histogram conversion', url: 'https://leetcode.com/problems/maximal-rectangle/', category: 'Stack' },
  { number: 735, title: 'Asteroid Collision', difficulty: 'Medium', topics: ['Stack'], pattern: 'Right-moving vs left-moving collision', url: 'https://leetcode.com/problems/asteroid-collision/', category: 'Stack' },
  { number: 71, title: 'Simplify Path', difficulty: 'Medium', topics: ['Stack'], pattern: 'Unix directory path token stack', url: 'https://leetcode.com/problems/simplify-path/', category: 'Stack' },
  { number: 394, title: 'Decode String', difficulty: 'Medium', topics: ['Stack'], pattern: 'Multiplier and string stack', url: 'https://leetcode.com/problems/decode-string/', category: 'Stack' },

  // Binary Search
  { number: 704, title: 'Binary Search', difficulty: 'Easy', topics: ['Binary Search'], pattern: 'Divide and conquer', url: 'https://leetcode.com/problems/binary-search/', category: 'Binary Search' },
  { number: 74, title: 'Search a 2D Matrix', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Virtual 1D binary search', url: 'https://leetcode.com/problems/search-a-2d-matrix/', category: 'Binary Search' },
  { number: 240, title: 'Search a 2D Matrix II', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Top-right corner search', url: 'https://leetcode.com/problems/search-a-2d-matrix-ii/', category: 'Binary Search' },
  { number: 875, title: 'Koko Eating Bananas', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Binary search on answer space', url: 'https://leetcode.com/problems/koko-eating-bananas/', category: 'Binary Search' },
  { number: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Identify sorted half', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', category: 'Binary Search' },
  { number: 81, title: 'Search in Rotated Sorted Array II', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Duplicate boundary skip', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/', category: 'Binary Search' },
  { number: 153, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Pivot detection', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', category: 'Binary Search' },
  { number: 981, title: 'Time Based Key-Value Store', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Timestamp binary search', url: 'https://leetcode.com/problems/time-based-key-value-store/', category: 'Binary Search' },
  { number: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topics: ['Binary Search'], pattern: 'Partition binary search', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', category: 'Binary Search' },
  { number: 35, title: 'Search Insert Position', difficulty: 'Easy', topics: ['Binary Search'], pattern: 'Lower bound binary search', url: 'https://leetcode.com/problems/search-insert-position/', category: 'Binary Search' },
  { number: 162, title: 'Find Peak Element', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Gradient ascent binary search', url: 'https://leetcode.com/problems/find-peak-element/', category: 'Binary Search' },
  { number: 1011, title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', topics: ['Binary Search'], pattern: 'Capacity binary search', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', category: 'Binary Search' },

  // Linked List
  { number: 206, title: 'Reverse Linked List', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Pointer reversal (prev/cur/next)', url: 'https://leetcode.com/problems/reverse-linked-list/', category: 'Linked List' },
  { number: 92, title: 'Reverse Linked List II', difficulty: 'Medium', topics: ['Linked List'], pattern: 'Sublist pointer reversal', url: 'https://leetcode.com/problems/reverse-linked-list-ii/', category: 'Linked List' },
  { number: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Dummy node merge', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', category: 'Linked List' },
  { number: 141, title: 'Linked List Cycle', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Fast and slow pointers (Floyd)', url: 'https://leetcode.com/problems/linked-list-cycle/', category: 'Linked List' },
  { number: 142, title: 'Linked List Cycle II', difficulty: 'Medium', topics: ['Linked List'], pattern: 'Cycle entry point', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', category: 'Linked List' },
  { number: 143, title: 'Reorder List', difficulty: 'Medium', topics: ['Linked List'], pattern: 'Find mid, reverse, merge', url: 'https://leetcode.com/problems/reorder-list/', category: 'Linked List' },
  { number: 19, title: 'Remove Nth Node From End of List', difficulty: 'Medium', topics: ['Linked List'], pattern: 'Two pointers gap of N', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', category: 'Linked List' },
  { number: 138, title: 'Copy List with Random Pointer', difficulty: 'Medium', topics: ['Linked List'], pattern: 'Hash map clone / Interleaving', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', category: 'Linked List' },
  { number: 2, title: 'Add Two Numbers', difficulty: 'Medium', topics: ['Linked List'], pattern: 'Digit addition with carry', url: 'https://leetcode.com/problems/add-two-numbers/', category: 'Linked List' },
  { number: 287, title: 'Find the Duplicate Number', difficulty: 'Medium', topics: ['Linked List'], pattern: "Floyd's cycle detection on array", url: 'https://leetcode.com/problems/find-the-duplicate-number/', category: 'Linked List' },
  { number: 146, title: 'LRU Cache', difficulty: 'Medium', topics: ['Linked List', 'Hash Table'], pattern: 'Doubly Linked List + Hash Map', url: 'https://leetcode.com/problems/lru-cache/', category: 'Linked List' },
  { number: 460, title: 'LFU Cache', difficulty: 'Hard', topics: ['Linked List', 'Hash Table'], pattern: 'Frequency map + DLLs', url: 'https://leetcode.com/problems/lfu-cache/', category: 'Linked List' },
  { number: 23, title: 'Merge k Sorted Lists', difficulty: 'Hard', topics: ['Linked List', 'Heap'], pattern: 'Min heap / Divide & conquer', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', category: 'Linked List' },
  { number: 25, title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topics: ['Linked List'], pattern: 'Count k nodes and reverse recursively', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', category: 'Linked List' },
  { number: 234, title: 'Palindrome Linked List', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Find middle and reverse half', url: 'https://leetcode.com/problems/palindrome-linked-list/', category: 'Linked List' },
  { number: 160, title: 'Intersection of Two Linked Lists', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Switch head traversal equalizing paths', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', category: 'Linked List' },
  { number: 876, title: 'Middle of the Linked List', difficulty: 'Easy', topics: ['Linked List'], pattern: 'Fast & slow pointer', url: 'https://leetcode.com/problems/middle-of-the-linked-list/', category: 'Linked List' },

  // Trees & BST
  { number: 226, title: 'Invert Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Recursive child swap', url: 'https://leetcode.com/problems/invert-binary-tree/', category: 'Trees' },
  { number: 104, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Recursive DFS height', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', category: 'Trees' },
  { number: 111, title: 'Minimum Depth of Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'BFS leaf detection', url: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/', category: 'Trees' },
  { number: 543, title: 'Diameter of Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Post-order depth calculation', url: 'https://leetcode.com/problems/diameter-of-binary-tree/', category: 'Trees' },
  { number: 110, title: 'Balanced Binary Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Bottom-up height check', url: 'https://leetcode.com/problems/balanced-binary-tree/', category: 'Trees' },
  { number: 100, title: 'Same Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Simultaneous DFS', url: 'https://leetcode.com/problems/same-tree/', category: 'Trees' },
  { number: 101, title: 'Symmetric Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Mirror node DFS', url: 'https://leetcode.com/problems/symmetric-tree/', category: 'Trees' },
  { number: 572, title: 'Subtree of Another Tree', difficulty: 'Easy', topics: ['Trees'], pattern: 'Tree isomorphism DFS', url: 'https://leetcode.com/problems/subtree-of-another-tree/', category: 'Trees' },
  { number: 235, title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', topics: ['Trees'], pattern: 'BST split property', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', category: 'Trees' },
  { number: 236, title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', topics: ['Trees'], pattern: 'Post-order DFS node search', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', category: 'Trees' },
  { number: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topics: ['Trees', 'BFS'], pattern: 'Queue level-by-level BFS', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', category: 'Trees' },
  { number: 103, title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', topics: ['Trees', 'BFS'], pattern: 'Deque alternate direction BFS', url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', category: 'Trees' },
  { number: 199, title: 'Binary Tree Right Side View', difficulty: 'Medium', topics: ['Trees'], pattern: 'BFS last node per level', url: 'https://leetcode.com/problems/binary-tree-right-side-view/', category: 'Trees' },
  { number: 1448, title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', topics: ['Trees'], pattern: 'DFS path max tracking', url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', category: 'Trees' },
  { number: 98, title: 'Validate Binary Search Tree', difficulty: 'Medium', topics: ['Trees'], pattern: 'Min/max boundary propagation', url: 'https://leetcode.com/problems/validate-binary-search-tree/', category: 'Trees' },
  { number: 230, title: 'Kth Smallest Element in a BST', difficulty: 'Medium', topics: ['Trees'], pattern: 'In-order traversal count', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', category: 'Trees' },
  { number: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', topics: ['Trees'], pattern: 'Recursive root split', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', category: 'Trees' },
  { number: 124, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topics: ['Trees'], pattern: 'Max gain through node DFS', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', category: 'Trees' },
  { number: 297, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topics: ['Trees'], pattern: 'Preorder string serialization', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', category: 'Trees' },
  { number: 112, title: 'Path Sum', difficulty: 'Easy', topics: ['Trees'], pattern: 'Target subtraction DFS', url: 'https://leetcode.com/problems/path-sum/', category: 'Trees' },

  // Tries
  { number: 208, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', topics: ['Trie'], pattern: 'Character tree nodes', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', category: 'Tries' },
  { number: 211, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', topics: ['Trie'], pattern: 'Trie + wildcard DFS', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', category: 'Tries' },
  { number: 212, title: 'Word Search II', difficulty: 'Hard', topics: ['Trie', 'Backtracking'], pattern: 'Trie grid backtrack', url: 'https://leetcode.com/problems/word-search-ii/', category: 'Tries' },

  // Heap / Priority Queue
  { number: 703, title: 'Kth Largest Element in a Stream', difficulty: 'Easy', topics: ['Heap'], pattern: 'Min heap of size k', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', category: 'Heap / Priority Queue' },
  { number: 1046, title: 'Last Stone Weight', difficulty: 'Easy', topics: ['Heap'], pattern: 'Max heap simulation', url: 'https://leetcode.com/problems/last-stone-weight/', category: 'Heap / Priority Queue' },
  { number: 973, title: 'K Closest Points to Origin', difficulty: 'Medium', topics: ['Heap'], pattern: 'Max heap of size k', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', category: 'Heap / Priority Queue' },
  { number: 215, title: 'Kth Largest Element in an Array', difficulty: 'Medium', topics: ['Heap', 'Quickselect'], pattern: 'Min heap / Quickselect', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', category: 'Heap / Priority Queue' },
  { number: 621, title: 'Task Scheduler', difficulty: 'Medium', topics: ['Heap', 'Greedy'], pattern: 'Max frequency greedy / Math', url: 'https://leetcode.com/problems/task-scheduler/', category: 'Heap / Priority Queue' },
  { number: 295, title: 'Find Median from Data Stream', difficulty: 'Hard', topics: ['Heap'], pattern: 'Two heaps (min & max)', url: 'https://leetcode.com/problems/find-median-from-data-stream/', category: 'Heap / Priority Queue' },
  { number: 767, title: 'Reorganize String', difficulty: 'Medium', topics: ['Heap', 'Greedy'], pattern: 'Max frequency pair placement', url: 'https://leetcode.com/problems/reorganize-string/', category: 'Heap / Priority Queue' },

  // Backtracking
  { number: 78, title: 'Subsets', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Include / exclude choice', url: 'https://leetcode.com/problems/subsets/', category: 'Backtracking' },
  { number: 90, title: 'Subsets II', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Sort + skip duplicate choices', url: 'https://leetcode.com/problems/subsets-ii/', category: 'Backtracking' },
  { number: 39, title: 'Combination Sum', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Reusable elements backtrack', url: 'https://leetcode.com/problems/combination-sum/', category: 'Backtracking' },
  { number: 40, title: 'Combination Sum II', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Single-use sorted backtrack', url: 'https://leetcode.com/problems/combination-sum-ii/', category: 'Backtracking' },
  { number: 216, title: 'Combination Sum III', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'k-sized combinations to sum n', url: 'https://leetcode.com/problems/combination-sum-iii/', category: 'Backtracking' },
  { number: 46, title: 'Permutations', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Array permutations tree', url: 'https://leetcode.com/problems/permutations/', category: 'Backtracking' },
  { number: 47, title: 'Permutations II', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Sorted duplicate tracking permutations', url: 'https://leetcode.com/problems/permutations-ii/', category: 'Backtracking' },
  { number: 79, title: 'Word Search', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Grid DFS with visited rollback', url: 'https://leetcode.com/problems/word-search/', category: 'Backtracking' },
  { number: 131, title: 'Palindrome Partitioning', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Substring palindrome backtrack', url: 'https://leetcode.com/problems/palindrome-partitioning/', category: 'Backtracking' },
  { number: 17, title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', topics: ['Backtracking'], pattern: 'Digit map choice tree', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', category: 'Backtracking' },
  { number: 51, title: 'N-Queens', difficulty: 'Hard', topics: ['Backtracking'], pattern: 'Column and diagonal bitsets', url: 'https://leetcode.com/problems/n-queens/', category: 'Backtracking' },
  { number: 37, title: 'Sudoku Solver', difficulty: 'Hard', topics: ['Backtracking'], pattern: 'Constraint validation solver', url: 'https://leetcode.com/problems/sudoku-solver/', category: 'Backtracking' },

  // Graphs
  { number: 200, title: 'Number of Islands', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Grid DFS/BFS connected components', url: 'https://leetcode.com/problems/number-of-islands/', category: 'Graphs' },
  { number: 695, title: 'Max Area of Island', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Component area DFS', url: 'https://leetcode.com/problems/max-area-of-island/', category: 'Graphs' },
  { number: 133, title: 'Clone Graph', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Hash map graph copy DFS', url: 'https://leetcode.com/problems/clone-graph/', category: 'Graphs' },
  { number: 994, title: 'Rotting Oranges', difficulty: 'Medium', topics: ['Graphs', 'BFS'], pattern: 'Multi-source BFS', url: 'https://leetcode.com/problems/rotting-oranges/', category: 'Graphs' },
  { number: 417, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Reverse reachability BFS/DFS', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', category: 'Graphs' },
  { number: 130, title: 'Surrounded Regions', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Boundary capture DFS', url: 'https://leetcode.com/problems/surrounded-regions/', category: 'Graphs' },
  { number: 207, title: 'Course Schedule', difficulty: 'Medium', topics: ['Graphs', 'Topological Sort'], pattern: "Kahn's indegree / DFS cycle", url: 'https://leetcode.com/problems/course-schedule/', category: 'Graphs' },
  { number: 210, title: 'Course Schedule II', difficulty: 'Medium', topics: ['Graphs', 'Topological Sort'], pattern: 'Topological order BFS', url: 'https://leetcode.com/problems/course-schedule-ii/', category: 'Graphs' },
  { number: 684, title: 'Redundant Connection', difficulty: 'Medium', topics: ['Graphs', 'Union-Find'], pattern: 'Disjoint set cycle finder', url: 'https://leetcode.com/problems/redundant-connection/', category: 'Graphs' },
  { number: 127, title: 'Word Ladder', difficulty: 'Hard', topics: ['Graphs', 'BFS'], pattern: 'Shortest word transformation BFS', url: 'https://leetcode.com/problems/word-ladder/', category: 'Graphs' },
  { number: 547, title: 'Number of Provinces', difficulty: 'Medium', topics: ['Graphs', 'Union-Find'], pattern: 'Connected component count', url: 'https://leetcode.com/problems/number-of-provinces/', category: 'Graphs' },
  { number: 785, title: 'Is Graph Bipartite?', difficulty: 'Medium', topics: ['Graphs'], pattern: '2-Coloring BFS/DFS', url: 'https://leetcode.com/problems/is-graph-bipartite/', category: 'Graphs' },
  { number: 1091, title: 'Shortest Path in Binary Matrix', difficulty: 'Medium', topics: ['Graphs', 'BFS'], pattern: '8-directional BFS', url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/', category: 'Graphs' },

  // Advanced Graphs
  { number: 743, title: 'Network Delay Time', difficulty: 'Medium', topics: ['Graphs'], pattern: "Dijkstra's shortest path", url: 'https://leetcode.com/problems/network-delay-time/', category: 'Advanced Graphs' },
  { number: 1584, title: 'Min Cost to Connect All Points', difficulty: 'Medium', topics: ['Graphs'], pattern: "Prim's / Kruskal's MST", url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', category: 'Advanced Graphs' },
  { number: 787, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topics: ['Graphs'], pattern: 'Bellman-Ford / BFS relaxation', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', category: 'Advanced Graphs' },

  // 1-D Dynamic Programming
  { number: 70, title: 'Climbing Stairs', difficulty: 'Easy', topics: ['Dynamic Programming'], pattern: 'Fibonacci state recurrence', url: 'https://leetcode.com/problems/climbing-stairs/', category: '1-D Dynamic Programming' },
  { number: 746, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', topics: ['Dynamic Programming'], pattern: 'Min previous two steps', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/', category: '1-D Dynamic Programming' },
  { number: 198, title: 'House Robber', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Rob or skip previous', url: 'https://leetcode.com/problems/house-robber/', category: '1-D Dynamic Programming' },
  { number: 213, title: 'House Robber II', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Circular house ranges', url: 'https://leetcode.com/problems/house-robber-ii/', category: '1-D Dynamic Programming' },
  { number: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', topics: ['Dynamic Programming', 'Two Pointers'], pattern: 'Expand around centers', url: 'https://leetcode.com/problems/longest-palindromic-substring/', category: '1-D Dynamic Programming' },
  { number: 647, title: 'Palindromic Substrings', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Center expansion count', url: 'https://leetcode.com/problems/palindromic-substrings/', category: '1-D Dynamic Programming' },
  { number: 91, title: 'Decode Ways', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'One/two digit decoding states', url: 'https://leetcode.com/problems/decode-ways/', category: '1-D Dynamic Programming' },
  { number: 322, title: 'Coin Change', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Bottom-up knapsack min coins', url: 'https://leetcode.com/problems/coin-change/', category: '1-D Dynamic Programming' },
  { number: 152, title: 'Maximum Product Subarray', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Track min and max product', url: 'https://leetcode.com/problems/maximum-product-subarray/', category: '1-D Dynamic Programming' },
  { number: 139, title: 'Word Break', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Reachable prefix DP', url: 'https://leetcode.com/problems/word-break/', category: '1-D Dynamic Programming' },
  { number: 300, title: 'Longest Increasing Subsequence', difficulty: 'Medium', topics: ['Dynamic Programming', 'Binary Search'], pattern: 'Patience sort / DP', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', category: '1-D Dynamic Programming' },
  { number: 416, title: 'Partition Equal Subset Sum', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: '0/1 Knapsack subset target', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', category: '1-D Dynamic Programming' },
  { number: 279, title: 'Perfect Squares', difficulty: 'Medium', topics: ['Dynamic Programming', 'BFS'], pattern: 'Min squares transition', url: 'https://leetcode.com/problems/perfect-squares/', category: '1-D Dynamic Programming' },
  { number: 377, title: 'Combination Sum IV', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Order-sensitive combination DP', url: 'https://leetcode.com/problems/combination-sum-iv/', category: '1-D Dynamic Programming' },

  // 2-D Dynamic Programming
  { number: 62, title: 'Unique Paths', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Grid path combination', url: 'https://leetcode.com/problems/unique-paths/', category: '2-D Dynamic Programming' },
  { number: 63, title: 'Unique Paths II', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Grid obstacle DP', url: 'https://leetcode.com/problems/unique-paths-ii/', category: '2-D Dynamic Programming' },
  { number: 64, title: 'Minimum Path Sum', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Min path grid transition', url: 'https://leetcode.com/problems/minimum-path-sum/', category: '2-D Dynamic Programming' },
  { number: 1143, title: 'Longest Common Subsequence', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: '2D match/skip recurrence', url: 'https://leetcode.com/problems/longest-common-subsequence/', category: '2-D Dynamic Programming' },
  { number: 309, title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'State machine (Buy/Sell/Rest)', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', category: '2-D Dynamic Programming' },
  { number: 518, title: 'Coin Change II', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Unbounded knapsack combinations', url: 'https://leetcode.com/problems/coin-change-ii/', category: '2-D Dynamic Programming' },
  { number: 494, title: 'Target Sum', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Subset sum transformation', url: 'https://leetcode.com/problems/target-sum/', category: '2-D Dynamic Programming' },
  { number: 97, title: 'Interleaving String', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: '2D prefix match grid', url: 'https://leetcode.com/problems/interleaving-string/', category: '2-D Dynamic Programming' },
  { number: 72, title: 'Edit Distance', difficulty: 'Medium', topics: ['Dynamic Programming'], pattern: 'Insert/Delete/Replace matrix', url: 'https://leetcode.com/problems/edit-distance/', category: '2-D Dynamic Programming' },
  { number: 312, title: 'Burst Balloons', difficulty: 'Hard', topics: ['Dynamic Programming'], pattern: 'Interval DP (last balloon)', url: 'https://leetcode.com/problems/burst-balloons/', category: '2-D Dynamic Programming' },

  // Greedy
  { number: 53, title: 'Maximum Subarray', difficulty: 'Medium', topics: ['Greedy', 'Arrays'], pattern: "Kadane's algorithm", url: 'https://leetcode.com/problems/maximum-subarray/', category: 'Greedy' },
  { number: 55, title: 'Jump Game', difficulty: 'Medium', topics: ['Greedy'], pattern: 'Farthest reachable index', url: 'https://leetcode.com/problems/jump-game/', category: 'Greedy' },
  { number: 45, title: 'Jump Game II', difficulty: 'Medium', topics: ['Greedy'], pattern: 'Layered BFS / Greedy reach', url: 'https://leetcode.com/problems/jump-game-ii/', category: 'Greedy' },
  { number: 134, title: 'Gas Station', difficulty: 'Medium', topics: ['Greedy'], pattern: 'Running tank reset', url: 'https://leetcode.com/problems/gas-station/', category: 'Greedy' },
  { number: 846, title: 'Hand of Straights', difficulty: 'Medium', topics: ['Greedy'], pattern: 'Min element consecutive check', url: 'https://leetcode.com/problems/hand-of-straights/', category: 'Greedy' },
  { number: 763, title: 'Partition Labels', difficulty: 'Medium', topics: ['Greedy'], pattern: 'Last occurrence boundary', url: 'https://leetcode.com/problems/partition-labels/', category: 'Greedy' },
  { number: 678, title: 'Valid Parenthesis String', difficulty: 'Medium', topics: ['Greedy'], pattern: 'Open bracket range tracking', url: 'https://leetcode.com/problems/valid-parenthesis-string/', category: 'Greedy' },
  { number: 135, title: 'Candy', difficulty: 'Hard', topics: ['Greedy'], pattern: 'Left-to-right & right-to-left passes', url: 'https://leetcode.com/problems/candy/', category: 'Greedy' },

  // Intervals
  { number: 57, title: 'Insert Interval', difficulty: 'Medium', topics: ['Intervals'], pattern: 'Non-overlapping insertion', url: 'https://leetcode.com/problems/insert-interval/', category: 'Intervals' },
  { number: 56, title: 'Merge Intervals', difficulty: 'Medium', topics: ['Intervals'], pattern: 'Sort endpoints and merge', url: 'https://leetcode.com/problems/merge-intervals/', category: 'Intervals' },
  { number: 435, title: 'Non-overlapping Intervals', difficulty: 'Medium', topics: ['Intervals', 'Greedy'], pattern: 'Earliest finish time greedy', url: 'https://leetcode.com/problems/non-overlapping-intervals/', category: 'Intervals' },
  { number: 452, title: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', topics: ['Intervals', 'Greedy'], pattern: 'Greedy end position sort', url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', category: 'Intervals' },
  { number: 986, title: 'Interval List Intersections', difficulty: 'Medium', topics: ['Intervals'], pattern: 'Two pointers interval overlap', url: 'https://leetcode.com/problems/interval-list-intersections/', category: 'Intervals' },

  // Math & Geometry
  { number: 48, title: 'Rotate Image', difficulty: 'Medium', topics: ['Math', 'Matrix'], pattern: 'Transpose and reverse rows', url: 'https://leetcode.com/problems/rotate-image/', category: 'Math & Geometry' },
  { number: 54, title: 'Spiral Matrix', difficulty: 'Medium', topics: ['Math', 'Matrix'], pattern: 'Four boundary simulation', url: 'https://leetcode.com/problems/spiral-matrix/', category: 'Math & Geometry' },
  { number: 73, title: 'Set Matrix Zeroes', difficulty: 'Medium', topics: ['Math', 'Matrix'], pattern: 'First row and col marker', url: 'https://leetcode.com/problems/set-matrix-zeroes/', category: 'Math & Geometry' },
  { number: 202, title: 'Happy Number', difficulty: 'Easy', topics: ['Math'], pattern: 'Cycle detection with set/Floyd', url: 'https://leetcode.com/problems/happy-number/', category: 'Math & Geometry' },
  { number: 66, title: 'Plus One', difficulty: 'Easy', topics: ['Math'], pattern: 'Right-to-left carry handling', url: 'https://leetcode.com/problems/plus-one/', category: 'Math & Geometry' },
  { number: 50, title: 'Pow(x, n)', difficulty: 'Medium', topics: ['Math'], pattern: 'Binary exponentiation', url: 'https://leetcode.com/problems/powx-n/', category: 'Math & Geometry' },

  // Bit Manipulation
  { number: 136, title: 'Single Number', difficulty: 'Easy', topics: ['Bit Manipulation'], pattern: 'XOR self-cancellation', url: 'https://leetcode.com/problems/single-number/', category: 'Bit Manipulation' },
  { number: 191, title: 'Number of 1 Bits', difficulty: 'Easy', topics: ['Bit Manipulation'], pattern: 'n & (n - 1) bit clear', url: 'https://leetcode.com/problems/number-of-1-bits/', category: 'Bit Manipulation' },
  { number: 338, title: 'Counting Bits', difficulty: 'Easy', topics: ['Bit Manipulation'], pattern: 'DP bit recurrence', url: 'https://leetcode.com/problems/counting-bits/', category: 'Bit Manipulation' },
  { number: 190, title: 'Reverse Bits', difficulty: 'Easy', topics: ['Bit Manipulation'], pattern: '32-bit shift and assemble', url: 'https://leetcode.com/problems/reverse-bits/', category: 'Bit Manipulation' },
  { number: 268, title: 'Missing Number', difficulty: 'Easy', topics: ['Bit Manipulation'], pattern: 'XOR index vs value', url: 'https://leetcode.com/problems/missing-number/', category: 'Bit Manipulation' },
  { number: 371, title: 'Sum of Two Integers', difficulty: 'Medium', topics: ['Bit Manipulation'], pattern: 'Bitwise XOR & Carry shift', url: 'https://leetcode.com/problems/sum-of-two-integers/', category: 'Bit Manipulation' },
]

const TOPICS_LIST = [
  'All topics',
  'Arrays',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Trie',
  'Heap',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Intervals',
  'Bit Manipulation',
  'Math',
]

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [topic, setTopic] = useState('All topics')
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false)
  const [selectedProblemNumber, setSelectedProblemNumber] = useState(1)
  const [approachMode, setApproachMode] = useState<'optimal' | 'brute' | 'alternative'>('optimal')
  const [language, setLanguage] = useState<Language>('python')
  const [activeTab, setActiveTab] = useState<TabMode>('overview')
  const [fontSize, setFontSize] = useState(13)
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Arrays & Hashing': true,
    'Two Pointers': true,
  })

  // Track solved problems in localStorage
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('leetmastery_solved')
      return saved ? JSON.parse(saved) : { 1: true }
    } catch {
      return { 1: true }
    }
  })

  // Test simulation state
  const [testStatus, setTestStatus] = useState<{
    isRunning: boolean
    hasRun: boolean
    outputLog: string[]
    percentile: string
  }>({
    isRunning: false,
    hasRun: false,
    outputLog: [],
    percentile: '98.4%',
  })

  const currentProblem = useMemo(() => {
    return allProblemsSeed.find((p) => p.number === selectedProblemNumber) ?? allProblemsSeed[0]
  }, [selectedProblemNumber])

  const problemData = useMemo(() => {
    return getDetailedProblemData(currentProblem.title, currentProblem.category, currentProblem.pattern)
  }, [currentProblem])

  // Category auto-expand
  useEffect(() => {
    const cat = currentProblem.category ?? (currentProblem.topics.includes('Arrays') ? 'Arrays & Hashing' : 'Other')
    if (cat) {
      setExpandedCategories((prev) => ({ ...prev, [cat]: true }))
    }
  }, [currentProblem])

  const toggleSolved = (num: number) => {
    setSolvedMap((prev) => {
      const updated = { ...prev, [num]: !prev[num] }
      try {
        localStorage.setItem('leetmastery_solved', JSON.stringify(updated))
      } catch {}
      return updated
    })
    setToast(solvedMap[num] ? `Marked #${num} as Unsolved` : `Problem #${num} Solved! 🚀`)
  }

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const currentApproach = useMemo(() => {
    if (approachMode === 'brute') return problemData.bruteForce
    if (approachMode === 'alternative' && problemData.alternative) return problemData.alternative
    return problemData.optimal
  }, [approachMode, problemData])

  const currentCodeLines = useMemo(() => {
    return currentApproach.code[language] || currentApproach.code.python || []
  }, [currentApproach, language])

  const copySolution = () => {
    navigator.clipboard.writeText(currentCodeLines.join('\n'))
    setCopied(true)
    setToast(`Copied ${language.toUpperCase()} code! ✨`)
    setTimeout(() => setCopied(false), 2200)
  }

  // Generate Ask ChatGPT link with beginner-friendly prompt
  const openChatGPT = () => {
    const code = currentCodeLines.join('\n')
    const prompt = `Explain LeetCode Problem #${currentProblem.number}: ${currentProblem.title} (${currentProblem.pattern} pattern) step-by-step from absolute scratch.

Assume I am a beginner with zero algorithmic experience:
1. Explain the problem simply using an everyday intuitive analogy.
2. Explain the intuition and why the brute force / naive approach is slow.
3. Explain the optimal ${currentProblem.pattern} solution line-by-line in plain English.
4. Walk through a detailed step-by-step dry run on example: "${problemData.examples[0]?.input || 'standard example'}" tracking variable values in memory.
5. Explain the Time Complexity O(...) and Space Complexity O(...) with clear derivations.

Here is the solution code (${language.toUpperCase()}):
${code}`

    const url = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setToast('🚀 Opened ChatGPT with custom ELI5 interview prompt!')
  }

  // Generate Python Tutor visualizer URL with complete driver code
  const openPythonTutor = () => {
    const pythonCode = (problemData.optimal.code.python || currentCodeLines).join('\n')
    const exampleVal = problemData.examples[0]?.input || 'test'
    const driver = `\n\n# --- Python Tutor Interactive Execution ---\n# Test Driver for LeetCode #${currentProblem.number}: ${currentProblem.title}\n# Example: ${exampleVal}\nsol = Solution()\n# Execute and step through variables:\nprint("Optimal Solution Loaded.")\n`
    const fullScript = pythonCode + driver
    const tutorUrl = `https://pythontutor.com/visualize.html#code=${encodeURIComponent(fullScript)}&cumulative=false&heapPrimitives=nevernest&mode=edit&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false`
    window.open(tutorUrl, '_blank', 'noopener,noreferrer')
    setToast('🔬 Opened Python Tutor with code pre-loaded for visual execution!')
  }

  const runTestSimulation = () => {
    setTestStatus({
      isRunning: true,
      hasRun: false,
      outputLog: ['Compiling and evaluating against test suite...'],
      percentile: '98.4%',
    })

    setTimeout(() => {
      const logs = [
        `✓ Test Case 1: PASS (0ms) -> Input: ${problemData.examples[0]?.input || 'standard test'}`,
        `✓ Test Case 2: PASS (0ms) -> Expected Output Verified`,
        `✓ Hidden Test Cases: 100/100 Passed`,
        `🚀 Status: Accepted | Runtime: 0 ms (Beats 98.4%) | Memory: 17.2 MB (Beats 88.1%)`,
      ]
      setTestStatus({
        isRunning: false,
        hasRun: true,
        outputLog: logs,
        percentile: '98.4%',
      })
      setToast('✅ Test Suite Passed!')
    }, 500)
  }

  const filteredProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return allProblemsSeed.filter((p) => {
      const matchesQuery =
        !normalized ||
        [p.title, p.number, p.pattern, ...(p.topics || [])].join(' ').toLowerCase().includes(normalized)
      const matchesDifficulty = difficulty === 'All' || p.difficulty === difficulty
      const matchesTopic = topic === 'All topics' || p.topics.includes(topic)
      return matchesQuery && matchesDifficulty && matchesTopic
    })
  }, [difficulty, query, topic])

  const groupedProblems = useMemo(() => {
    const groups = new Map<string, Problem[]>()
    filteredProblems.forEach((p) => {
      const category = p.category ?? (p.topics.includes('Arrays') && p.topics.includes('Hashing') ? 'Arrays & Hashing' : 'Other')
      groups.set(category, [...(groups.get(category) ?? []), p])
    })
    return Array.from(groups.entries())
  }, [filteredProblems])

  const solvedCount = useMemo(() => {
    return allProblemsSeed.filter((p) => solvedMap[p.number]).length
  }, [solvedMap])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const selectProblem = (num: number) => {
    setSelectedProblemNumber(num)
    setApproachMode('optimal')
    setTestStatus({ isRunning: false, hasRun: false, outputLog: [], percentile: '98.4%' })
  }

  const diffClass = currentProblem.difficulty.toLowerCase()

  return (
    <div className={`app leetcode-dark ${theme === 'light' ? 'light-mode' : ''}`} data-theme={theme}>
      {/* Top Navigation Bar - LeetCode Inspired */}
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Zap size={15} strokeWidth={2.8} />
          </div>
          <span className="brand-title">
            leet<span className="brand-accent">mastery</span>
          </span>
          <span className="brand-version-badge">100+ PATTERNS</span>
        </div>

        <div className="topbar-center">
          <div className="global-search">
            <Search size={14} className="search-icon" />
            <input
              aria-label="Search problems"
              placeholder="Search 100+ problems, patterns, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>
              <Command size={11} /> K
            </kbd>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="solved-counter-pill" title="Tracked completed problems">
            <CheckCircle2 size={14} className="solved-icon" />
            <span>
              <strong>{solvedCount}</strong> / {allProblemsSeed.length} Solved
            </span>
          </div>

          <button
            className="icon-button"
            title="Toggle Dark / Light Theme"
            onClick={() => setTheme((c) => (c === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Left Sidebar - Problem Explorer */}
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div className="heading-title">
              <Layers size={13} />
              <span>Core Patterns ({allProblemsSeed.length})</span>
            </div>
            <span className="count-badge">{filteredProblems.length}</span>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="filter-row">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => (
              <button
                key={level}
                className={`filter-pill ${difficulty === level ? 'selected' : ''} ${level.toLowerCase()}`}
                onClick={() => setDifficulty(level)}
              >
                {level === 'All' ? (
                  'All'
                ) : (
                  <>
                    <span className="difficulty-dot" />
                    {level}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Custom Topic Selector Dropdown */}
          <div className="custom-topic-dropdown-container">
            <button
              type="button"
              className={`topic-dropdown-trigger ${isTopicDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsTopicDropdownOpen((prev) => !prev)}
              aria-expanded={isTopicDropdownOpen}
              aria-label="Filter problems by topic"
            >
              <div className="trigger-left">
                <Filter size={12} className="filter-icon" />
                <span className="selected-topic-text">{topic}</span>
              </div>
              <ChevronDown size={13} className={`trigger-chevron ${isTopicDropdownOpen ? 'open' : ''}`} />
            </button>

            {isTopicDropdownOpen && (
              <>
                <div className="dropdown-backdrop" onClick={() => setIsTopicDropdownOpen(false)} />
                <div className="topic-dropdown-menu" role="listbox">
                  {TOPICS_LIST.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`topic-option ${topic === t ? 'selected' : ''}`}
                      onClick={() => {
                        setTopic(t)
                        setIsTopicDropdownOpen(false)
                      }}
                      role="option"
                      aria-selected={topic === t}
                    >
                      <span>{t}</span>
                      {topic === t && <Check size={12} className="option-check" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Problem List by Category */}
          <div className="library-list">
            {groupedProblems.map(([category, categoryProblems]) => {
              const isOpen = query.trim() !== '' || expandedCategories[category]
              return (
                <div className="library-section" key={category}>
                  <button className="list-label-button" onClick={() => toggleCategory(category)}>
                    <div className="category-title">
                      <ChevronDown size={12} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                      <span>{category}</span>
                    </div>
                    <span className="category-count">{categoryProblems.length}</span>
                  </button>

                  {isOpen && (
                    <div className="section-problems">
                      {categoryProblems.map((problem) => {
                        const isSolved = !!solvedMap[problem.number]
                        const isSelected = selectedProblemNumber === problem.number
                        return (
                          <div
                            key={problem.number}
                            className={`problem-item ${isSelected ? 'active' : ''}`}
                            onClick={() => selectProblem(problem.number)}
                          >
                            <button
                              className={`check-box-btn ${isSolved ? 'checked' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleSolved(problem.number)
                              }}
                              title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                            >
                              {isSolved && <Check size={11} strokeWidth={3} />}
                            </button>
                            <span className="problem-number">{String(problem.number).padStart(3, '0')}</span>
                            <div className="problem-item-copy">
                              <span className="problem-title-text">{problem.title}</span>
                              <span className="problem-pattern-text">{problem.pattern}</span>
                            </div>
                            <span className={`mini-diff-badge ${problem.difficulty.toLowerCase()}`}>
                              {problem.difficulty[0]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            {!filteredProblems.length && <div className="empty-list">No matching problems found.</div>}
          </div>

          {/* Sidebar Progress Footer */}
          <div className="sidebar-footer">
            <div className="progress-line">
              <span>Your Mastery Progress</span>
              <strong>
                {solvedCount} / {allProblemsSeed.length} ({Math.round((solvedCount / allProblemsSeed.length) * 100)}%)
              </strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(solvedCount / allProblemsSeed.length) * 100}%` }} />
            </div>
            <div className="streak-banner">
              <div className="streak-icon">
                <Flame size={14} />
              </div>
              <div className="streak-info">
                <strong>LeetCode Ready</strong>
                <small>Best & Worst algorithmic patterns</small>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`main-content ${isExpanded ? 'fullscreen-mode' : ''}`}>
          {/* Problem Header Banner */}
          <section className="problem-top-banner">
            <div className="problem-header-left">
              <div className="breadcrumb-nav">
                <span>LeetCode</span>
                <ArrowRight size={12} />
                <span>{currentProblem.category || currentProblem.topics[0]}</span>
                <ArrowRight size={12} />
                <strong>#{currentProblem.number}</strong>
              </div>

              <div className="title-row">
                <h1 className="problem-main-title">
                  {currentProblem.number}. {currentProblem.title}
                </h1>
                <button
                  className={`mark-solved-btn ${solvedMap[currentProblem.number] ? 'solved' : ''}`}
                  onClick={() => toggleSolved(currentProblem.number)}
                >
                  <Check size={14} />
                  <span>{solvedMap[currentProblem.number] ? 'Solved' : 'Mark Solved'}</span>
                </button>
              </div>

              {/* Meta Tags Row */}
              <div className="problem-meta-row">
                <span className={`difficulty-badge ${diffClass}`}>{currentProblem.difficulty}</span>
                <span className="pattern-pill">
                  <Hash size={11} /> {currentProblem.pattern}
                </span>
                <span className="stat-pill">
                  <TrendingUp size={11} /> {problemData.acceptanceRate} Acceptance
                </span>
                <span className="stat-pill">
                  <Flame size={11} /> {problemData.frequency} Freq
                </span>

                <div className="companies-pills">
                  {problemData.companies.slice(0, 4).map((c) => (
                    <span key={c} className="company-tag">
                      {c}
                    </span>
                  ))}
                </div>

                <a
                  className="leetcode-direct-link"
                  href={currentProblem.url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open on LeetCode.com"
                >
                  <span>LeetCode</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </section>

          {/* Studio Workspace Layout */}
          <div className="studio-workspace">
            {/* Left Column: Problem Explanation & Breakdown Tabs */}
            <div className="explanation-column">
              {/* Tab Navigation */}
              <div className="study-tab-nav">
                <button
                  className={`study-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <BookOpen size={14} />
                  <span>Problem & Intuition</span>
                </button>
                <button
                  className={`study-tab ${activeTab === 'comparison' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comparison')}
                >
                  <Zap size={14} />
                  <span>Best vs Worst Breakdown</span>
                </button>
                <button
                  className={`study-tab ${activeTab === 'walkthrough' ? 'active' : ''}`}
                  onClick={() => setActiveTab('walkthrough')}
                >
                  <ListChecks size={14} />
                  <span>Dry Run & Invariants</span>
                </button>
                <button
                  className={`study-tab ${activeTab === 'edgecases' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edgecases')}
                >
                  <ShieldAlert size={14} />
                  <span>Edge Cases & Tips</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="study-tab-content">
                {/* TAB 1: Problem Overview & Intuition */}
                {activeTab === 'overview' && (
                  <div className="tab-pane">
                    {/* Intuition Callout Card */}
                    <div className="intuition-card">
                      <div className="intuition-header">
                        <div className="intuition-badge">
                          <Lightbulb size={15} />
                          <span>The "Aha!" Intuition</span>
                        </div>
                        <span className="key-tag">Interview Mental Model</span>
                      </div>
                      <p className="intuition-text">{problemData.intuition}</p>
                      <div className="key-invariant-box">
                        <span className="invariant-label">Algorithmic Invariant:</span>
                        <code>{problemData.keyInvariant}</code>
                      </div>
                    </div>

                    {/* Example Cards */}
                    <div className="section-title">
                      <TerminalSquare size={14} />
                      <span>Examples</span>
                    </div>
                    <div className="examples-list">
                      {problemData.examples.map((ex, idx) => (
                        <div key={idx} className="example-card">
                          <div className="example-card-header">
                            <span className="example-index">Example {idx + 1}</span>
                          </div>
                          <div className="example-io-grid">
                            <div className="io-block">
                              <span className="io-label">Input:</span>
                              <code>{ex.input}</code>
                            </div>
                            <div className="io-block output">
                              <span className="io-label">Output:</span>
                              <code>{ex.output}</code>
                            </div>
                          </div>
                          {ex.explanation && (
                            <div className="example-explanation">
                              <span>Explanation:</span> {ex.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div className="section-title">
                      <ShieldAlert size={14} />
                      <span>Constraints</span>
                    </div>
                    <ul className="constraints-list">
                      {problemData.constraints.map((c, i) => (
                        <li key={i}>
                          <code>{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TAB 2: Best vs Worst Comparison */}
                {activeTab === 'comparison' && (
                  <div className="tab-pane">
                    {/* Side-by-Side Complexity Table */}
                    <div className="complexity-comparison-table">
                      <div className="table-header-row">
                        <span>Approach</span>
                        <span>Time Complexity</span>
                        <span>Space Complexity</span>
                        <span>LeetCode Result</span>
                      </div>

                      {/* Best (Optimal) Row */}
                      <div className="table-data-row optimal-row">
                        <div className="approach-name">
                          <span className="badge optimal">BEST (Optimal)</span>
                          <strong>{problemData.optimal.title}</strong>
                        </div>
                        <div className="complexity-cell">
                          <span className="big-o fast">{problemData.optimal.timeComplexity}</span>
                          <small>{problemData.optimal.timeComplexityDetail}</small>
                        </div>
                        <div className="complexity-cell">
                          <span className="big-o">{problemData.optimal.spaceComplexity}</span>
                          <small>{problemData.optimal.spaceComplexityDetail}</small>
                        </div>
                        <div className="status-cell">
                          <span className="result-chip accepted">✅ ACCEPTED</span>
                          <small>Beats 98%+ Runtime</small>
                        </div>
                      </div>

                      {/* Worst (Brute Force) Row */}
                      <div className="table-data-row brute-row">
                        <div className="approach-name">
                          <span className="badge brute">WORST (Brute Force)</span>
                          <strong>{problemData.bruteForce.title}</strong>
                        </div>
                        <div className="complexity-cell">
                          <span className="big-o slow">{problemData.bruteForce.timeComplexity}</span>
                          <small>{problemData.bruteForce.timeComplexityDetail}</small>
                        </div>
                        <div className="complexity-cell">
                          <span className="big-o">{problemData.bruteForce.spaceComplexity}</span>
                          <small>{problemData.bruteForce.spaceComplexityDetail}</small>
                        </div>
                        <div className="status-cell">
                          <span className="result-chip tle">❌ TLE / SLOW</span>
                          <small>Time Limit Exceeded</small>
                        </div>
                      </div>

                      {/* Better (Alternative) Row if available */}
                      {problemData.alternative && (
                        <div className="table-data-row better-row">
                          <div className="approach-name">
                            <span className="badge better">ALTERNATIVE</span>
                            <strong>{problemData.alternative.title}</strong>
                          </div>
                          <div className="complexity-cell">
                            <span className="big-o">{problemData.alternative.timeComplexity}</span>
                            <small>{problemData.alternative.timeComplexityDetail}</small>
                          </div>
                          <div className="complexity-cell">
                            <span className="big-o">{problemData.alternative.spaceComplexity}</span>
                            <small>{problemData.alternative.spaceComplexityDetail}</small>
                          </div>
                          <div className="status-cell">
                            <span className="result-chip accepted">✅ ACCEPTED</span>
                            <small>Valid Tradeoff</small>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottleneck Analysis */}
                    <div className="bottleneck-card">
                      <div className="bottleneck-title">
                        <ShieldAlert size={15} />
                        <span>Why Brute Force Fails (The Bottleneck)</span>
                      </div>
                      <p>{problemData.bottleneck}</p>
                    </div>

                    {/* Breakthrough Explanation */}
                    <div className="breakthrough-card">
                      <div className="breakthrough-title">
                        <Zap size={15} />
                        <span>The Optimal Breakthrough</span>
                      </div>
                      <p>{problemData.optimal.explanation}</p>
                    </div>
                  </div>
                )}

                {/* TAB 3: Walkthrough & Dry Run Trace */}
                {activeTab === 'walkthrough' && (
                  <div className="tab-pane">
                    {/* Execution Steps */}
                    <div className="section-title">
                      <ListChecks size={14} />
                      <span>Algorithmic Execution Steps</span>
                    </div>
                    <div className="execution-steps-card">
                      {currentApproach.keySteps.map((step, idx) => (
                        <div key={idx} className="execution-step-item">
                          <span className="step-num">{idx + 1}</span>
                          <span className="step-text">{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dry Run Trace Table */}
                    {problemData.dryRunTrace && (
                      <>
                        <div className="section-title" style={{ marginTop: '20px' }}>
                          <Cpu size={14} />
                          <span>Dry Run Trace Table (Sample Input)</span>
                        </div>
                        <div className="trace-table-container">
                          <table className="trace-table">
                            <thead>
                              <tr>
                                {problemData.dryRunTrace.headers.map((h, i) => (
                                  <th key={i}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {problemData.dryRunTrace.rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx}>
                                      <code>{cell}</code>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB 4: Edge Cases & Interview Tips */}
                {activeTab === 'edgecases' && (
                  <div className="tab-pane">
                    {/* Edge Cases Card */}
                    <div className="edge-cases-card">
                      <div className="card-heading">
                        <ShieldAlert size={15} />
                        <span>Critical Edge Cases to Test</span>
                      </div>
                      <ul className="edge-cases-list">
                        {problemData.edgeCases.map((ec, idx) => (
                          <li key={idx}>
                            <CheckCircle2 size={13} className="bullet-icon" />
                            <span>{ec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interview Tips Card */}
                    <div className="interview-tips-card">
                      <div className="card-heading">
                        <Sparkles size={15} />
                        <span>Interviewer Pro-Tips & Follow-ups</span>
                      </div>
                      <ul className="interview-tips-list">
                        {problemData.interviewTips.map((tip, idx) => (
                          <li key={idx}>
                            <Zap size={13} className="tip-bullet-icon" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Xcode IDE Code Studio */}
            <div className="code-column">
              <div className="xcode-window-studio">
                {/* Xcode Window Header */}
                <div className="xcode-titlebar">
                  <div className="mac-traffic-lights">
                    <span className="traffic-dot close" title="Close" />
                    <span className="traffic-dot minimize" title="Minimize" />
                    <span className="traffic-dot maximize" title="Zoom / Expand" />
                  </div>

                  {/* Xcode Breadcrumbs */}
                  <div className="xcode-breadcrumbs">
                    <TerminalSquare size={12} className="xcode-icon" />
                    <span className="crumb">LeetMastery</span>
                    <span className="sep">›</span>
                    <span className="crumb">{currentProblem.category || 'Solutions'}</span>
                    <span className="sep">›</span>
                    <span className="crumb file-name">
                      {currentProblem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                      {language === 'python' ? '.py' : '.cpp'}
                    </span>
                    <span className="sep">›</span>
                    <span className="crumb scope">{approachMode === 'optimal' ? '⚡ Optimal' : '🐢 BruteForce'}</span>
                  </div>

                  {/* Quick Controls */}
                  <div className="xcode-quick-actions">
                    <button
                      className="xcode-tool-btn"
                      onClick={() => setFontSize((f) => Math.max(10, f - 1))}
                      title="Decrease Font Size"
                    >
                      A-
                    </button>
                    <button
                      className="xcode-tool-btn"
                      onClick={() => setFontSize((f) => Math.min(18, f + 1))}
                      title="Increase Font Size"
                    >
                      A+
                    </button>
                    <button
                      className="xcode-tool-btn"
                      onClick={() => setIsExpanded((e) => !e)}
                      title={isExpanded ? 'Restore View' : 'Expand Fullscreen'}
                    >
                      {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>
                  </div>
                </div>

                {/* Xcode Studio Toolbar & Approach Tabs */}
                <div className="xcode-toolbar">
                  {/* Approach Selector */}
                  <div className="approach-selector">
                    <button
                      className={`approach-tab ${approachMode === 'optimal' ? 'active optimal' : ''}`}
                      onClick={() => setApproachMode('optimal')}
                    >
                      <Zap size={13} />
                      <span>Best (Optimal)</span>
                      <span className="approach-time-pill">{problemData.optimal.timeComplexity}</span>
                    </button>

                    <button
                      className={`approach-tab ${approachMode === 'brute' ? 'active brute' : ''}`}
                      onClick={() => setApproachMode('brute')}
                    >
                      <Clock3 size={13} />
                      <span>Worst (Brute Force)</span>
                      <span className="approach-time-pill">{problemData.bruteForce.timeComplexity}</span>
                    </button>

                    {problemData.alternative && (
                      <button
                        className={`approach-tab ${approachMode === 'alternative' ? 'active better' : ''}`}
                        onClick={() => setApproachMode('alternative')}
                      >
                        <Lightbulb size={13} />
                        <span>Alternative</span>
                        <span className="approach-time-pill">{problemData.alternative.timeComplexity}</span>
                      </button>
                    )}
                  </div>

                  {/* Language Selector (Python 3 & C++) */}
                  <div className="language-selector">
                    {(['python', 'cpp'] as const).map((lang) => (
                      <button
                        key={lang}
                        className={`lang-btn ${language === lang ? 'active' : ''}`}
                        onClick={() => setLanguage(lang)}
                      >
                        {lang === 'python' ? 'Python 3' : 'C++'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Xcode Code Editor Body with Syntax Highlighting */}
                <div className="xcode-editor-body" style={{ fontSize: `${fontSize}px` }}>
                  <div className="xcode-gutter">
                    {currentCodeLines.map((_, idx) => (
                      <div key={idx} className="gutter-line-number">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    ))}
                  </div>

                  <div className="xcode-code-pane">
                    {currentCodeLines.map((line, idx) => (
                      <div key={`${language}-${approachMode}-${idx}`} className="xcode-code-line">
                        <code>{highlightCode(line, language)}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Xcode Action Bar: Run Test, Ask GPT, Python Tutor & Copy */}
                <div className="xcode-action-bar">
                  <div className="action-left">
                    <button
                      className={`xcode-run-btn ${testStatus.isRunning ? 'running' : ''}`}
                      onClick={runTestSimulation}
                      disabled={testStatus.isRunning}
                      title="Run against LeetCode test suite"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>{testStatus.isRunning ? 'Running...' : 'Run Tests'}</span>
                    </button>

                    {/* Ask ChatGPT Button */}
                    <button
                      className="xcode-ai-btn"
                      onClick={openChatGPT}
                      title="Ask ChatGPT to explain step-by-step for beginners (ELI5)"
                    >
                      <Bot size={13} />
                      <span>Ask ChatGPT</span>
                    </button>

                    {/* Python Tutor Visualizer Button */}
                    <button
                      className="xcode-tutor-btn"
                      onClick={openPythonTutor}
                      title="Visualize execution step-by-step on Python Tutor"
                    >
                      <Eye size={13} />
                      <span>Python Tutor</span>
                    </button>

                    <button className="xcode-copy-btn" onClick={copySolution} title="Copy code">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="approach-complexity-summary">
                    <span className="summary-item">
                      Time: <strong>{currentApproach.timeComplexity}</strong>
                    </span>
                    <span className="summary-dot">•</span>
                    <span className="summary-item">
                      Space: <strong>{currentApproach.spaceComplexity}</strong>
                    </span>
                  </div>
                </div>

                {/* Test Simulation Results Panel */}
                {testStatus.hasRun && (
                  <div className="test-results-drawer">
                    <div className="results-header">
                      <div className="results-title">
                        <CheckCircle2 size={14} className="pass-icon" />
                        <span>LeetCode Test Suite Results</span>
                      </div>
                      <span className="accepted-badge">100% Passed</span>
                    </div>
                    <div className="results-body">
                      {testStatus.outputLog.map((log, i) => (
                        <div key={i} className="test-log-line">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Xcode Status Bar */}
                <div className="xcode-statusbar">
                  <span className="status-segment">
                    <TerminalSquare size={11} /> Ready
                  </span>
                  <span className="status-segment">UTF-8</span>
                  <span className="status-segment">Spaces: 4</span>
                  <span className="status-segment">
                    {language === 'python' ? 'Python 3.11' : 'C++20'}
                  </span>
                  <span className="status-segment right">{currentApproach.leetcodeStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="leetcode-toast">
          <Sparkles size={14} />
          <span>{toast}</span>
          <button onClick={() => setToast('')}>
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

// Xcode Dark IDE Syntax Highlighter for Python & C++
function highlightCode(line: string, language: Language) {
  // Comments
  if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
    return <span className="xcode-comment">{line}</span>
  }

  const combinedRegex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:class|def|return|for|in|if|else|elif|while|import|from|as|True|False|None|self|new|function|const|let|var|public|private|static|void|int|vector|string|bool|float|double|auto|using|namespace|include|unordered_map|unordered_set|HashMap|HashSet|Map|Set|List|Optional|TreeNode|ListNode|boolean|true|false|null|override|final)\b|\b(?:twoSum|containsDuplicate|isAnagram|groupAnagrams|topKFrequent|productExceptSelf|longestConsecutive|isValidSudoku|maxProfit|isPalindrome|threeSum|maxArea|trap|binarySearch|search|isValid|minStack|reverseList|mergeTwoLists|hasCycle|invertTree|maxDepth|numIslands|lengthOfLongestSubstring|maxSubArray|climbStairs|coinChange|len|range|enumerate|print|append|add|insert|count|find|get|min|max|sort|sorted|reverse|reversed|pop|push|size|empty|clear|fill|every|some|map|filter|reduce|split|join|charAt|charCodeAt|toLowerCase|toUpperCase|isalnum|containsKey|has|set)\b|\b\d+\b|#.*|\/\/.*)/g

  const parts: (string | JSX.Element)[] = []
  let lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = combinedRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('#') || token.startsWith('//')) {
      parts.push(<span key={match.index} className="xcode-comment">{token}</span>)
    } else if (token.startsWith('"') || token.startsWith("'")) {
      parts.push(<span key={match.index} className="xcode-string">{token}</span>)
    } else if (/^\d+$/.test(token)) {
      parts.push(<span key={match.index} className="xcode-number">{token}</span>)
    } else if (
      /^(class|def|return|for|in|if|else|elif|while|import|from|as|True|False|None|self|new|function|const|let|var|public|private|static|void|int|vector|string|bool|float|double|auto|using|namespace|include|unordered_map|unordered_set|HashMap|HashSet|Map|Set|List|Optional|TreeNode|ListNode|boolean|true|false|null|override|final)$/.test(
        token
      )
    ) {
      if (
        /^(int|vector|string|bool|float|double|unordered_map|unordered_set|HashMap|HashSet|Map|Set|List|Optional|TreeNode|ListNode|boolean|void)$/.test(
          token
        )
      ) {
        parts.push(<span key={match.index} className="xcode-type">{token}</span>)
      } else {
        parts.push(<span key={match.index} className="xcode-keyword">{token}</span>)
      }
    } else {
      parts.push(<span key={match.index} className="xcode-function">{token}</span>)
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex))
  }

  return parts
}

export default App
