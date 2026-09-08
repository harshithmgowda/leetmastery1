import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  RotateCcw,
  BookOpen,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Layers,
  GitBranch,
  Split,
  ChevronRight,
  ArrowUp,
  Moon,
  Sun,
  Activity,
  Zap,
  Sparkles,
  Compass,
  ShieldAlert,
  Volume2,
  VolumeX
} from 'lucide-react';

// Binary tree node definition
export class TreeNode {
  val: any;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;

  constructor(val: any, left: TreeNode | null = null, right: TreeNode | null = null, id: string | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.id = id || Math.random().toString(36).substring(2, 9);
  }
}

export interface TestCase {
  id: string;
  name: string;
  expected: boolean;
  tag: string;
  description: string;
  buildP: () => TreeNode | null;
  buildQ: () => TreeNode | null;
}

export interface StackFrame {
  callId: number;
  parentCallId: number | null;
  sideLabel: string;
  depth: number;
  pDisplay: string;
  qDisplay: string;
  pVal: any;
  qVal: any;
  pId: string;
  qId: string;
  status: string;
  condVal: boolean | null;
  condLeft: boolean | null;
  condRight: boolean | null;
  returnedVal: boolean | null;
}

export interface TraceStep {
  stepIndex: number;
  lineId: string;
  codeSegment: string;
  pNode: TreeNode | null;
  qNode: TreeNode | null;
  pValDisplay: string;
  qValDisplay: string;
  activePId: string;
  activeQId: string;
  callStack: StackFrame[];
  condValMatch: boolean | null;
  condLeftMatch: boolean | null;
  condRightMatch: boolean | null;
  shortCircuited: boolean;
  shortCircuitReason: string;
  returnValue: boolean | null;
  returnTargetCallId: number | null;
  returnedToCondition: string | null;
  whatText: string;
  whyText: string;
  whereText: string;
  nextText: string;
  flowchartState: string;
  depth: number;
  comparisonsCount: number;
  functionCallsCount: number;
}

// Comprehensive test scenarios covering all branches of execution
export const TEST_CASES: TestCase[] = [
  {
    id: 'identical',
    name: '1. Identical Trees [1, 2, 3]',
    expected: true,
    tag: 'Full Match: True',
    description: 'Both trees share identical structures and values. Every comparison succeeds.',
    buildP: () => new TreeNode(1, new TreeNode(2, null, null, 'p2'), new TreeNode(3, null, null, 'p3'), 'p1'),
    buildQ: () => new TreeNode(1, new TreeNode(2, null, null, 'q2'), new TreeNode(3, null, null, 'q3'), 'q1'),
  },
  {
    id: 'diff_val',
    name: '2. Value Mismatch [1, 2, 3] vs [1, 5, 3]',
    expected: false,
    tag: 'Short-Circuit: Value',
    description: 'Left child of P is 2, but left child of Q is 5. Demonstrates instant short-circuiting on Condition 1.',
    buildP: () => new TreeNode(1, new TreeNode(2, null, null, 'p2'), new TreeNode(3, null, null, 'p3'), 'p1'),
    buildQ: () => new TreeNode(1, new TreeNode(5, null, null, 'q5'), new TreeNode(3, null, null, 'q3'), 'q1'),
  },
  {
    id: 'diff_struct',
    name: '3. Structural Difference [Left vs Right]',
    expected: false,
    tag: 'Structure Mismatch',
    description: 'P has left child 2 (right is None); Q has right child 2 (left is None). One pointer is None while the other is Node.',
    buildP: () => new TreeNode(1, new TreeNode(2, null, null, 'p2'), null, 'p1'),
    buildQ: () => new TreeNode(1, null, new TreeNode(2, null, null, 'q2'), 'q1'),
  },
  {
    id: 'empty_both',
    name: '4. Both Trees Empty (None)',
    expected: true,
    tag: 'Edge Case: None == None',
    description: 'Both P and Q are None. Base case: not p and not q -> True immediately.',
    buildP: () => null,
    buildQ: () => null,
  },
  {
    id: 'one_empty',
    name: '5. One Empty vs One Node',
    expected: false,
    tag: 'Edge Case: None != Node',
    description: 'P has root 1, while Q is None. Base case: not p or not q -> False immediately.',
    buildP: () => new TreeNode(1, null, null, 'p1'),
    buildQ: () => null,
  },
  {
    id: 'asymmetric',
    name: '6. Asymmetric Values [1, 2, 1] vs [1, 1, 2]',
    expected: false,
    tag: 'Deep Subtree Mismatch',
    description: 'Both trees contain values {1, 2}, but in opposite child branches.',
    buildP: () => new TreeNode(1, new TreeNode(2, null, null, 'p2'), new TreeNode(1, null, null, 'p1_r'), 'p1'),
    buildQ: () => new TreeNode(1, new TreeNode(1, null, null, 'q1_l'), new TreeNode(2, null, null, 'q2_r'), 'q1'),
  }
];

/**
 * Generates an uncompromising, step-by-step state trace of the exact algorithm:
 * 
 * class Solution:
 *     def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
 *         if not p or not q: return p == q
 *         return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
 */
export function generateExecutionTrace(rootP: TreeNode | null, rootQ: TreeNode | null): { steps: TraceStep[]; maxDepth: number } {
  const steps: TraceStep[] = [];
  let callCounter = 0;
  let comparisonCounter = 0;
  let maxDepth = 0;
  const callStack: StackFrame[] = [];

  function recordStep(stepData: {
    lineId: string;
    codeSegment: string;
    pNode: TreeNode | null;
    qNode: TreeNode | null;
    pValDisplay: string;
    qValDisplay: string;
    activePId: string;
    activeQId: string;
    condValMatch?: boolean | null;
    condLeftMatch?: boolean | null;
    condRightMatch?: boolean | null;
    shortCircuited?: boolean;
    shortCircuitReason?: string;
    returnValue?: boolean | null;
    returnTargetCallId?: number | null;
    returnedToCondition?: string | null;
    whatText: string;
    whyText: string;
    whereText: string;
    nextText: string;
    flowchartState?: string;
  }) {
    steps.push({
      stepIndex: steps.length,
      lineId: stepData.lineId,
      codeSegment: stepData.codeSegment,
      pNode: stepData.pNode,
      qNode: stepData.qNode,
      pValDisplay: stepData.pValDisplay,
      qValDisplay: stepData.qValDisplay,
      activePId: stepData.activePId,
      activeQId: stepData.activeQId,
      callStack: JSON.parse(JSON.stringify(callStack)),
      condValMatch: stepData.condValMatch ?? null,
      condLeftMatch: stepData.condLeftMatch ?? null,
      condRightMatch: stepData.condRightMatch ?? null,
      shortCircuited: stepData.shortCircuited ?? false,
      shortCircuitReason: stepData.shortCircuitReason ?? '',
      returnValue: stepData.returnValue ?? null,
      returnTargetCallId: stepData.returnTargetCallId ?? null,
      returnedToCondition: stepData.returnedToCondition ?? null,
      whatText: stepData.whatText,
      whyText: stepData.whyText,
      whereText: stepData.whereText,
      nextText: stepData.nextText,
      flowchartState: stepData.flowchartState ?? 'check_null',
      depth: callStack.length,
      comparisonsCount: comparisonCounter,
      functionCallsCount: callCounter
    });
  }

  function simulate(
    p: TreeNode | null,
    q: TreeNode | null,
    parentCallId: number | null = null,
    sideLabel: string = 'Root Call',
    parentTargetCond: string | null = null
  ): boolean {
    callCounter++;
    const currentCallId = callCounter;
    const currentDepth = callStack.length + 1;
    if (currentDepth > maxDepth) maxDepth = currentDepth;

    const pDisplay = p ? `Node(${p.val})` : 'None';
    const qDisplay = q ? `Node(${q.val})` : 'None';
    const pVal = p ? p.val : null;
    const qVal = q ? q.val : null;
    const pId = p ? p.id : `none_p_${currentCallId}`;
    const qId = q ? q.id : `none_q_${currentCallId}`;

    const currentFrame: StackFrame = {
      callId: currentCallId,
      parentCallId,
      sideLabel,
      depth: currentDepth,
      pDisplay,
      qDisplay,
      pVal,
      qVal,
      pId,
      qId,
      status: 'active',
      condVal: null,
      condLeft: null,
      condRight: null,
      returnedVal: null
    };

    callStack.push(currentFrame);

    // STEP 1: Entering the function
    recordStep({
      lineId: 'def',
      codeSegment: 'def isSameTree(self, p, q):',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      flowchartState: 'entry',
      whatText: `Invoked isSameTree(p=${pDisplay}, q=${qDisplay}).`,
      whyText: `A new recursive call was initiated to test equivalence for the ${sideLabel}.`,
      whereText: `P points to ${pDisplay}, Q points to ${qDisplay} at recursion depth ${currentDepth}.`,
      nextText: `Inspect whether either pointer is None using the base case check: 'if not p or not q'.`
    });

    // STEP 2: Base Case Null Check - if not p or not q:
    const notP = !p;
    const notQ = !q;
    const isBaseCase = notP || notQ;

    recordStep({
      lineId: 'check_null',
      codeSegment: 'if not p or not q:',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      flowchartState: 'check_null',
      whatText: `Evaluating condition: (not p: ${notP}) or (not q: ${notQ}).`,
      whyText: `We must verify whether either pointer reached an empty subtree before accessing .val to prevent AttributeError!`,
      whereText: `Currently inspecting nodes: P is ${pDisplay}, Q is ${qDisplay}.`,
      nextText: isBaseCase 
        ? `At least one pointer is None! Executing base case return: 'return p == q'.` 
        : `Both nodes exist! Neither is None. Proceeding past the if-statement to compare node values.`
    });

    // STEP 3: Handle Base Case (at least one is None)
    if (isBaseCase) {
      comparisonCounter++;
      const baseResult = (p === q); // True if both null, False if only one null
      currentFrame.returnedVal = baseResult;
      currentFrame.status = 'returning';

      recordStep({
        lineId: 'return_null',
        codeSegment: 'return p == q',
        pNode: p,
        qNode: q,
        pValDisplay: pDisplay,
        qValDisplay: qDisplay,
        activePId: pId,
        activeQId: qId,
        returnValue: baseResult,
        returnTargetCallId: parentCallId,
        returnedToCondition: parentTargetCond,
        flowchartState: 'return_null',
        whatText: `Evaluating 'return p == q': (${pDisplay} == ${qDisplay}) -> ${baseResult ? 'True ✅' : 'False ❌'}.`,
        whyText: baseResult
          ? `Both pointers are None! Two empty subtrees are structurally identical.`
          : `One pointer is None while the other is an actual Node! One tree has a node where the other has nothing. Structures differ!`,
        whereText: `Base case reached at depth ${currentDepth}. Function Call #${currentCallId} is finishing.`,
        nextText: parentCallId 
          ? `Popping this frame from the Call Stack and returning ${baseResult} back to parent Call #${parentCallId}.` 
          : `Algorithm terminates. Final result is ${baseResult}.`
      });

      callStack.pop();
      return baseResult;
    }

    // STEP 4: Condition 1 - Compare Values: p.val == q.val
    comparisonCounter++;
    const valuesMatch = (p!.val === q!.val);
    currentFrame.condVal = valuesMatch;

    recordStep({
      lineId: 'comp_val',
      codeSegment: 'p.val == q.val',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      condValMatch: valuesMatch,
      flowchartState: 'comp_val',
      whatText: `Condition ① Value Comparison: ${p!.val} == ${q!.val} -> ${valuesMatch ? 'True ✅' : 'False ❌'}.`,
      whyText: `The main return statement checks three 'and' conditions. Condition ① verifies if the current node values are equal.`,
      whereText: `Inspecting values of current active nodes: Tree P (${p!.val}) vs Tree Q (${q!.val}).`,
      nextText: valuesMatch 
        ? `Values match! Python now proceeds to evaluate Condition ②: calling self.isSameTree(p.left, q.left).` 
        : `Values differ! Condition ① is False. Python will short-circuit and STOP immediately!`
    });

    if (!valuesMatch) {
      currentFrame.returnedVal = false;
      currentFrame.status = 'returning';

      recordStep({
        lineId: 'return_combined',
        codeSegment: 'return p.val == q.val and ...',
        pNode: p,
        qNode: q,
        pValDisplay: pDisplay,
        qValDisplay: qDisplay,
        activePId: pId,
        activeQId: qId,
        condValMatch: false,
        shortCircuited: true,
        shortCircuitReason: `Condition ① failed (${p!.val} != ${q!.val})`,
        returnValue: false,
        returnTargetCallId: parentCallId,
        returnedToCondition: parentTargetCond,
        flowchartState: 'short_circuit',
        whatText: `⚡ Short-Circuit Triggered! Returning False immediately.`,
        whyText: `In Python, if the first clause of an 'and' expression evaluates to False, the remaining clauses are never evaluated. Left and right subtrees are completely skipped.`,
        whereText: `Inside Call #${currentCallId} at depth ${currentDepth}.`,
        nextText: parentCallId 
          ? `Popping frame #${currentCallId} and returning False up to Call #${parentCallId}.` 
          : `Top-level function finishes with False.`
      });

      callStack.pop();
      return false;
    }

    // STEP 5: Condition 2 - Recursive Call on Left Subtree
    recordStep({
      lineId: 'call_left',
      codeSegment: 'self.isSameTree(p.left, q.left)',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      condValMatch: true,
      flowchartState: 'call_left',
      whatText: `Condition ② Initiated: Calling self.isSameTree(p.left, q.left).`,
      whyText: `Node values matched! Now the entire left subtree of P must be proven identical to the left subtree of Q.`,
      whereText: `Moving attention down to left children: P.left (${p!.left ? p!.left.val : 'None'}) and Q.left (${q!.left ? q!.left.val : 'None'}).`,
      nextText: `Pausing current Call #${currentCallId} and pushing a new frame to the Call Stack for the left child pair.`
    });

    const leftResult = simulate(p!.left, q!.left, currentCallId, `Left child of (${p!.val})`, 'Condition ② (Left Subtree)');
    currentFrame.condLeft = leftResult;

    recordStep({
      lineId: 'resume_left',
      codeSegment: 'self.isSameTree(p.left, q.left)',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      condValMatch: true,
      condLeftMatch: leftResult,
      flowchartState: 'resume_left',
      whatText: `Call #${currentCallId} Resumed: Left subtree evaluation returned ${leftResult ? 'True ✅' : 'False ❌'}.`,
      whyText: `The child recursive call has finished and returned its result to Condition ② of this parent frame.`,
      whereText: `Back at Call #${currentCallId} comparing nodes (${p!.val}, ${q!.val}).`,
      nextText: leftResult
        ? `Condition ② passed! Python will now evaluate Condition ③: calling self.isSameTree(p.right, q.right).`
        : `Condition ② failed! Due to short-circuiting, Python will NOT check the right subtree!`
    });

    if (!leftResult) {
      currentFrame.returnedVal = false;
      currentFrame.status = 'returning';

      recordStep({
        lineId: 'return_combined',
        codeSegment: 'return p.val == q.val and ...',
        pNode: p,
        qNode: q,
        pValDisplay: pDisplay,
        qValDisplay: qDisplay,
        activePId: pId,
        activeQId: qId,
        condValMatch: true,
        condLeftMatch: false,
        shortCircuited: true,
        shortCircuitReason: 'Left subtree returned False',
        returnValue: false,
        returnTargetCallId: parentCallId,
        returnedToCondition: parentTargetCond,
        flowchartState: 'short_circuit',
        whatText: `⚡ Short-Circuit on Left Failure! Returning False.`,
        whyText: `Because Condition ② returned False, the entire 'and' chain is doomed. Checking the right subtree is unnecessary.`,
        whereText: `Inside Call #${currentCallId}.`,
        nextText: `Popping Call #${currentCallId} and propagating False upward.`
      });

      callStack.pop();
      return false;
    }

    // STEP 6: Condition 3 - Recursive Call on Right Subtree
    recordStep({
      lineId: 'call_right',
      codeSegment: 'self.isSameTree(p.right, q.right)',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      condValMatch: true,
      condLeftMatch: true,
      flowchartState: 'call_right',
      whatText: `Condition ③ Initiated: Calling self.isSameTree(p.right, q.right).`,
      whyText: `Values matched and left subtrees were identical! The final requirement is verifying that right subtrees match.`,
      whereText: `Moving down to right children: P.right (${p!.right ? p!.right.val : 'None'}) and Q.right (${q!.right ? q!.right.val : 'None'}).`,
      nextText: `Pausing Call #${currentCallId} and pushing a new frame for the right child pair.`
    });

    const rightResult = simulate(p!.right, q!.right, currentCallId, `Right child of (${p!.val})`, 'Condition ③ (Right Subtree)');
    currentFrame.condRight = rightResult;

    const finalAnswer = valuesMatch && leftResult && rightResult;
    currentFrame.returnedVal = finalAnswer;
    currentFrame.status = 'returning';

    recordStep({
      lineId: 'return_combined',
      codeSegment: 'return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)',
      pNode: p,
      qNode: q,
      pValDisplay: pDisplay,
      qValDisplay: qDisplay,
      activePId: pId,
      activeQId: qId,
      condValMatch: true,
      condLeftMatch: true,
      condRightMatch: rightResult,
      returnValue: finalAnswer,
      returnTargetCallId: parentCallId,
      returnedToCondition: parentTargetCond,
      flowchartState: 'combine',
      whatText: `All 3 Conditions Evaluated: (True and True and ${rightResult}) -> ${finalAnswer ? 'True ✅' : 'False ❌'}.`,
      whyText: `Both node values, left subtree, and right subtree have all completed evaluation. Their boolean conjunction produces the final answer for this subtree.`,
      whereText: `Call #${currentCallId} at depth ${currentDepth}.`,
      nextText: parentCallId 
        ? `Returning ${finalAnswer} to parent Call #${parentCallId}.` 
        : `All calls complete. Returning final answer to caller.`
    });

    callStack.pop();
    return finalAnswer;
  }

  simulate(rootP, rootQ, null, 'Root');

  // Final summary step
  const lastStep = steps[steps.length - 1];
  steps.push({
    ...lastStep,
    stepIndex: steps.length,
    lineId: 'completed',
    codeSegment: 'Algorithm Finished',
    callStack: [],
    flowchartState: 'finished',
    whatText: `🎉 Execution Complete! Final Result: ${lastStep.returnValue ? 'True' : 'False'}.`,
    whyText: lastStep.returnValue 
      ? `Every single corresponding node possessed the identical value and identical structural branching.`
      : `At least one value or structural disparity was discovered and propagated to the top level.`,
    whereText: `The Call Stack is now completely empty.`,
    nextText: `Select another test case or click Reset to re-examine the execution flow.`
  });

  return { steps, maxDepth };
}

export interface VisualNode {
  id: string;
  val: any;
  x: number;
  y: number;
  depth: number;
  hasLeft?: boolean;
  hasRight?: boolean;
  isGhost?: boolean;
  parentSide?: string;
}

export interface VisualLink {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  id: string;
  isGhost?: boolean;
}

export interface TreeLayout {
  nodes: VisualNode[];
  links: VisualLink[];
  isEmpty: boolean;
}

// Computes visual SVG coordinates for standard binary tree structures
export function computeTreeLayout(root: TreeNode | null, width = 310, _height = 260): TreeLayout {
  const nodes: VisualNode[] = [];
  const links: VisualLink[] = [];

  if (!root) {
    return { nodes, links, isEmpty: true };
  }

  function traverse(node: TreeNode | null, depth: number, leftBound: number, rightBound: number, parent: VisualNode | null = null) {
    if (!node) return;

    const x = (leftBound + rightBound) / 2;
    const y = 45 + depth * 68;

    const visualNode: VisualNode = {
      id: node.id,
      val: node.val,
      x,
      y,
      depth,
      hasLeft: !!node.left,
      hasRight: !!node.right
    };
    nodes.push(visualNode);

    if (parent) {
      links.push({
        sourceX: parent.x,
        sourceY: parent.y,
        targetX: x,
        targetY: y,
        id: `${parent.id}->${node.id}`
      });
    }

    const mid = (leftBound + rightBound) / 2;
    if (node.left) {
      traverse(node.left, depth + 1, leftBound, mid, visualNode);
    } else {
      // Place ghost None node for left child
      nodes.push({
        id: `none_${node.id}_left`,
        val: 'None',
        x: (leftBound + mid) / 2,
        y: y + 68,
        depth: depth + 1,
        isGhost: true,
        parentSide: 'left'
      });
      links.push({
        sourceX: x,
        sourceY: y,
        targetX: (leftBound + mid) / 2,
        targetY: y + 68,
        id: `${node.id}->none_l`,
        isGhost: true
      });
    }

    if (node.right) {
      traverse(node.right, depth + 1, mid, rightBound, visualNode);
    } else {
      // Place ghost None node for right child
      nodes.push({
        id: `none_${node.id}_right`,
        val: 'None',
        x: (mid + rightBound) / 2,
        y: y + 68,
        depth: depth + 1,
        isGhost: true,
        parentSide: 'right'
      });
      links.push({
        sourceX: x,
        sourceY: y,
        targetX: (mid + rightBound) / 2,
        targetY: y + 68,
        id: `${node.id}->none_r`,
        isGhost: true
      });
    }
  }

  traverse(root, 0, 10, width - 10);
  return { nodes, links, isEmpty: false };
}

// Subtle synthesized web audio clicks for educational tactile feedback
export function playSubtleClick(frequency = 440, type: OscillatorType = 'sine') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Graceful fallback for non-supported or muted browsers
  }
}

export default function SameTreeVisualizer() {
  const [selectedCaseId, setSelectedCaseId] = useState('identical');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1300); // ms per step
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showZeroGuide, setShowZeroGuide] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);

  // Load current test scenario
  const currentCase = useMemo(() => {
    return TEST_CASES.find(c => c.id === selectedCaseId) || TEST_CASES[0];
  }, [selectedCaseId]);

  // Generate trace on test case change
  const { steps, maxDepth } = useMemo(() => {
    const rootP = currentCase.buildP();
    const rootQ = currentCase.buildQ();
    return generateExecutionTrace(rootP, rootQ);
  }, [currentCase]);

  // Tree layouts for SVG rendering
  const treePLayout = useMemo(() => {
    return computeTreeLayout(currentCase.buildP(), 290, 240);
  }, [currentCase]);

  const treeQLayout = useMemo(() => {
    return computeTreeLayout(currentCase.buildQ(), 290, 240);
  }, [currentCase]);

  // Current active step
  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (currentStepIndex < steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex(prev => {
            const next = prev + 1;
            if (soundEnabled) playSubtleClick(520, 'sine');
            return next;
          });
        }, playbackSpeed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed, soundEnabled]);

  const handleSelectCase = (caseId: string) => {
    setIsPlaying(false);
    setSelectedCaseId(caseId);
    setCurrentStepIndex(0);
    if (soundEnabled) playSubtleClick(400, 'triangle');
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (soundEnabled) playSubtleClick(300, 'sine');
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      if (soundEnabled) playSubtleClick(580, 'sine');
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      if (soundEnabled) playSubtleClick(350, 'sine');
    }
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
    if (soundEnabled) playSubtleClick(480, 'square');
  };

  // Calculates SVG position for the direct comparison laser connector
  const activeBridgeCoords = useMemo(() => {
    let pCoords: { x: number; y: number } | null = null;
    let qCoords: { x: number; y: number } | null = null;

    if (currentStep.activePId) {
      const pNode = treePLayout.nodes.find(n => n.id === currentStep.activePId);
      if (pNode) pCoords = { x: pNode.x + 5, y: pNode.y };
    }
    if (currentStep.activeQId) {
      const qNode = treeQLayout.nodes.find(n => n.id === currentStep.activeQId);
      if (qNode) qCoords = { x: qNode.x + 315, y: qNode.y };
    }

    return { pCoords, qCoords };
  }, [currentStep, treePLayout, treeQLayout]);

  const renderZeroGuideModal = () => {
    if (!showZeroGuide) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Absolute Zero: How Recursion Solves Same Tree</h2>
                <p className="text-xs text-slate-400">Master every concept from scratch before watching the visualization.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowZeroGuide(false)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-relaxed">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> 1. What is a Binary Tree?
              </h3>
              <p className="mt-1 text-slate-300">
                A binary tree is a data structure made of interconnected <strong>nodes</strong>. It starts at a single <strong>Root</strong> node. Each node contains a value (<code className="px-1.5 py-0.5 rounded bg-slate-700 text-amber-300">.val</code>) and two pointers: <code className="text-sky-300 font-mono">.left</code> and <code className="text-sky-300 font-mono">.right</code>. When a node has no child in a direction, that pointer is <code className="px-1.5 py-0.5 rounded bg-slate-700 text-rose-300 font-mono">None</code>.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-semibold text-sky-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 2. What is Recursion and the Call Stack?
              </h3>
              <p className="mt-1 text-slate-300">
                Recursion means a function calls <em>itself</em> with smaller subproblems. 
                Because the parent function cannot finish until the child finishes, the computer pauses the parent and stacks a new <strong>Stack Frame</strong> on top of the <strong>Call Stack</strong>. When the child finishes, it pops off the stack and passes its return value back down to the caller!
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> 3. Why does 'if not p or not q: return p == q' work?
              </h3>
              <p className="mt-1 text-slate-300">
                This is the <strong>Base Case</strong>. It safely handles empty branches before we ever touch <code className="font-mono">.val</code>:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
                <li><strong>Both None:</strong> <code className="font-mono text-emerald-300">None == None</code> evaluates to <span className="font-bold text-emerald-400">True</span> (empty branches match).</li>
                <li><strong>One None, One Node:</strong> <code className="font-mono text-rose-300">None == Node</code> evaluates to <span className="font-bold text-rose-400">False</span> (one tree has a branch where the other does not).</li>
              </ul>
            </div>

            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                <Zap className="w-4 h-4" /> 4. How 'and' and Short-Circuiting Work
              </h3>
              <p className="mt-1 text-slate-300">
                In Python, <code className="text-emerald-300 font-mono">A and B and C</code> stops the instant any part is False:
              </p>
              <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 font-mono text-xs border border-slate-700/80 text-slate-300">
                1. Check: p.val == q.val<br/>
                &nbsp;&nbsp;&nbsp;↳ If False ❌ ➔ STOP! Skip B and C entirely.<br/>
                2. Check: isSameTree(p.left, q.left)<br/>
                &nbsp;&nbsp;&nbsp;↳ If False ❌ ➔ STOP! Skip C entirely.<br/>
                3. Check: isSameTree(p.right, q.right)
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowZeroGuide(false)}
              className="px-6 py-2.5 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
            >
              Start Exploring!
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFlowchartModal = () => {
    if (!showFlowchart) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className={`max-w-2xl w-full rounded-3xl p-6 shadow-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Execution Decision Tree (Roadmap)</h2>
                <p className="text-xs text-slate-400">The exact sequence of choices made for every subtree pair.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowFlowchart(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="py-6 flex flex-col items-center gap-3 font-mono text-xs">
            <div className={`px-4 py-2 rounded-xl border font-bold ${
              currentStep.flowchartState === 'entry' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              isSameTree(p, q)
            </div>
            <span className="text-slate-500">↓</span>
            
            <div className={`px-4 py-2 rounded-xl border text-center ${
              currentStep.flowchartState === 'check_null' ? 'bg-amber-600 text-white shadow-lg scale-105' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              Are either p or q None?<br/>
              <span className="text-[10px] text-slate-400 font-normal">if not p or not q:</span>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-md">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-bold">YES</span>
                <div className={`w-full text-center px-3 py-2 rounded-xl border ${
                  currentStep.flowchartState === 'return_null' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  return p == q
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-sky-400 font-bold">NO</span>
                <div className={`w-full text-center px-3 py-2 rounded-xl border ${
                  currentStep.flowchartState === 'comp_val' ? 'bg-sky-600 text-white shadow-lg scale-105' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  Compare: p.val == q.val
                </div>
              </div>
            </div>

            <span className="text-slate-500">↓</span>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className={`text-center p-2 rounded-xl border ${
                currentStep.flowchartState === 'call_left' || currentStep.flowchartState === 'resume_left'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                Left Subtree<br/>
                <span className="text-[10px] text-slate-400">isSameTree(p.left, q.left)</span>
              </div>

              <div className={`text-center p-2 rounded-xl border ${
                currentStep.flowchartState === 'call_right'
                  ? 'bg-teal-600 text-white shadow-lg scale-105'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                Right Subtree<br/>
                <span className="text-[10px] text-slate-400">isSameTree(p.right, q.right)</span>
              </div>
            </div>

            <span className="text-slate-500">↓</span>

            <div className={`px-4 py-2 rounded-xl border font-bold ${
              currentStep.flowchartState === 'combine' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              Combine: (Val Match) and (Left Match) and (Right Match)
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowFlowchart(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Close Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {renderZeroGuideModal()}
      {renderFlowchartModal()}

      {/* HEADER BAR */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6 transition-colors ${
        isDarkMode ? 'bg-slate-900/85 border-slate-800' : 'bg-white/95 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
              🌳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Same Binary Tree — Recursion Visualizer
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  LeetCode #100
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Understand recursion by watching two trees get compared step by step.
              </p>
            </div>
          </div>

          {/* Top action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFlowchart(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-medium transition ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-750 text-sky-400 border-sky-500/30' 
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Recursion Roadmap</span>
            </button>

            <button
              onClick={() => setShowZeroGuide(true)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-medium transition ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-750 text-emerald-400 border-emerald-500/30' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Teach Me from Zero</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* SCENARIOS BAR */}
      <div className={`border-b px-4 py-2.5 sm:px-6 ${
        isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-200/70 border-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Test Scenarios:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {TEST_CASES.map(tc => {
              const active = tc.id === selectedCaseId;
              return (
                <button
                  key={tc.id}
                  onClick={() => handleSelectCase(tc.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-102'
                      : isDarkMode
                        ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  <span>{tc.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active 
                      ? 'bg-emerald-700/70 text-emerald-100' 
                      : tc.expected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {tc.expected ? 'True' : 'False'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* COLUMN 1: LEFT - Exact Python Code & Scope (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className={`rounded-3xl border p-4 shadow-xl transition ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Exact Python Solution
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Python 3
                </span>
              </div>

              {/* Exact code block with sub-expression highlights */}
              <div className="font-mono text-xs leading-6 space-y-1 overflow-x-auto select-none">
                <div className="text-slate-500">class Solution:</div>
                <div className="text-slate-500 pl-3">
                  def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -&gt; bool:
                </div>

                {/* Line 1: if not p or not q: return p == q */}
                <div className={`pl-6 py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  currentStep.lineId === 'check_null' || currentStep.lineId === 'return_null'
                    ? 'bg-amber-500/20 border-l-4 border-amber-400 text-amber-200 font-semibold'
                    : 'text-slate-300'
                }`}>
                  <span className={currentStep.lineId === 'check_null' ? 'bg-amber-500/40 px-1 rounded text-white' : ''}>
                    if not p or not q:
                  </span>{' '}
                  <span className={currentStep.lineId === 'return_null' ? 'bg-emerald-500/40 px-1 rounded text-white font-bold animate-pulse' : ''}>
                    return p == q
                  </span>
                </div>

                {/* Line 2: return p.val == q.val and ... */}
                <div className={`pl-6 py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  currentStep.lineId === 'comp_val' ||
                  currentStep.lineId === 'call_left' ||
                  currentStep.lineId === 'resume_left' ||
                  currentStep.lineId === 'call_right' ||
                  currentStep.lineId === 'return_combined'
                    ? 'bg-sky-500/15 border-l-4 border-sky-400'
                    : ''
                }`}>
                  <div className="text-slate-400">return (</div>
                  <div className="pl-4 space-y-1">
                    {/* Condition 1: p.val == q.val */}
                    <div className={`px-1.5 py-0.5 rounded-lg transition ${
                      currentStep.lineId === 'comp_val' 
                        ? 'bg-sky-500/30 text-sky-200 font-bold ring-1 ring-sky-400' 
                        : currentStep.condValMatch === true 
                          ? 'text-emerald-400' 
                          : currentStep.condValMatch === false 
                            ? 'text-rose-400 line-through' 
                            : 'text-slate-300'
                    }`}>
                      p.val == q.val <span className="text-slate-500">and</span>
                    </div>

                    {/* Condition 2: self.isSameTree(p.left, q.left) */}
                    <div className={`px-1.5 py-0.5 rounded-lg transition ${
                      currentStep.lineId === 'call_left' || currentStep.lineId === 'resume_left'
                        ? 'bg-purple-500/30 text-purple-200 font-bold ring-1 ring-purple-400'
                        : currentStep.condLeftMatch === true
                          ? 'text-emerald-400'
                          : currentStep.condLeftMatch === false
                            ? 'text-rose-400 line-through'
                            : 'text-slate-300'
                    }`}>
                      self.isSameTree(p.left, q.left) <span className="text-slate-500">and</span>
                    </div>

                    {/* Condition 3: self.isSameTree(p.right, q.right) */}
                    <div className={`px-1.5 py-0.5 rounded-lg transition ${
                      currentStep.lineId === 'call_right'
                        ? 'bg-teal-500/30 text-teal-200 font-bold ring-1 ring-teal-400'
                        : currentStep.condRightMatch === true
                          ? 'text-emerald-400'
                          : currentStep.condRightMatch === false
                            ? 'text-rose-400'
                            : 'text-slate-300'
                    }`}>
                      self.isSameTree(p.right, q.right)
                    </div>
                  </div>
                  <div className="text-slate-400">)</div>
                </div>
              </div>

              {/* Live Variable Scope Watch */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Active Stack Frame Variables
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className={`p-2.5 rounded-xl border flex flex-col gap-0.5 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400">p pointer:</span>
                    <span className="font-bold text-emerald-400">{currentStep.pValDisplay}</span>
                    <span className="text-[10px] text-slate-500">
                      .val: {currentStep.pNode ? currentStep.pNode.val : 'None'}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col gap-0.5 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400">q pointer:</span>
                    <span className="font-bold text-sky-400">{currentStep.qValDisplay}</span>
                    <span className="text-[10px] text-slate-500">
                      .val: {currentStep.qNode ? currentStep.qNode.val : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AND Condition & Short-Circuit Engine */}
            <div className={`rounded-3xl border p-4 shadow-xl transition ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Split className="w-4 h-4 text-amber-400" />
                  "AND" Condition Engine
                </span>
                {currentStep.shortCircuited && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 animate-pulse">
                    Short-Circuit ⚡
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                {/* Condition 1 */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  currentStep.condValMatch === true 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : currentStep.condValMatch === false 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                }`}>
                  <span className="font-mono">① p.val == q.val</span>
                  <span className="font-bold">
                    {currentStep.condValMatch === null ? '⏳ Waiting' : currentStep.condValMatch ? 'True ✅' : 'False ❌'}
                  </span>
                </div>

                <div className="text-center text-[10px] font-bold text-slate-500 tracking-widest">AND</div>

                {/* Condition 2 */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  currentStep.condLeftMatch === true 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : currentStep.condLeftMatch === false 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                      : currentStep.shortCircuited && currentStep.condValMatch === false
                        ? 'bg-slate-800/20 border-dashed border-slate-700 text-slate-500 line-through'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                }`}>
                  <span className="font-mono">② isSameTree(left)</span>
                  <span className="font-bold">
                    {currentStep.shortCircuited && currentStep.condValMatch === false
                      ? 'Skipped ⚡'
                      : currentStep.condLeftMatch === null 
                        ? '⏳ Waiting' 
                        : currentStep.condLeftMatch ? 'True ✅' : 'False ❌'}
                  </span>
                </div>

                <div className="text-center text-[10px] font-bold text-slate-500 tracking-widest">AND</div>

                {/* Condition 3 */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  currentStep.condRightMatch === true 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : currentStep.condRightMatch === false 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                      : currentStep.shortCircuited
                        ? 'bg-slate-800/20 border-dashed border-slate-700 text-slate-500 line-through'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                }`}>
                  <span className="font-mono">③ isSameTree(right)</span>
                  <span className="font-bold">
                    {currentStep.shortCircuited
                      ? 'Skipped ⚡'
                      : currentStep.condRightMatch === null 
                        ? '⏳ Waiting' 
                        : currentStep.condRightMatch ? 'True ✅' : 'False ❌'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: CENTER - Dual Trees & Visual Comparison Bridge (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className={`rounded-3xl border p-4 shadow-xl transition ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  Dual Tree Visualization
                </span>
                
                {/* Active Comparison Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-mono font-medium border bg-slate-800/80 border-slate-700 text-slate-200">
                    Active: {currentStep.pValDisplay} ↔ {currentStep.qValDisplay}
                  </span>
                </div>
              </div>

              {/* Side-by-side labels */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold mb-1">
                <div className="text-emerald-400 flex items-center justify-center gap-1">
                  <span>Tree P</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Left Pointer)</span>
                </div>
                <div className="text-sky-400 flex items-center justify-center gap-1">
                  <span>Tree Q</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Right Pointer)</span>
                </div>
              </div>

              {/* SVG Tree Display with Bridge */}
              <div className="relative w-full h-[280px] rounded-2xl border border-slate-800/60 bg-slate-950/60 overflow-hidden flex items-center justify-center shadow-inner">
                <svg className="w-full h-full" viewBox="0 0 620 270">
                  {/* Center dotted division line */}
                  <line
                    x1="310"
                    y1="10"
                    x2="310"
                    y2="260"
                    stroke={isDarkMode ? '#334155' : '#cbd5e1'}
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />

                  {/* ACTIVE COMPARISON BRIDGE / LASER */}
                  {activeBridgeCoords.pCoords && activeBridgeCoords.qCoords && (
                    <g className="transition-all duration-300">
                      <line
                        x1={activeBridgeCoords.pCoords.x}
                        y1={activeBridgeCoords.pCoords.y}
                        x2={activeBridgeCoords.qCoords.x}
                        y2={activeBridgeCoords.qCoords.y}
                        stroke={
                          currentStep.condValMatch === true 
                            ? '#10b981' 
                            : currentStep.condValMatch === false 
                              ? '#f43f5e' 
                              : '#f59e0b'
                        }
                        strokeWidth="2.5"
                        strokeDasharray="5 5"
                        className="animate-pulse"
                      />
                      {/* Center comparison pill */}
                      <g transform={`translate(${310}, ${(activeBridgeCoords.pCoords.y + activeBridgeCoords.qCoords.y) / 2})`}>
                        <rect
                          x="-45"
                          y="-12"
                          width="90"
                          height="24"
                          rx="12"
                          fill={isDarkMode ? '#0f172a' : '#ffffff'}
                          stroke={
                            currentStep.condValMatch === true 
                              ? '#10b981' 
                              : currentStep.condValMatch === false 
                                ? '#f43f5e' 
                                : '#f59e0b'
                          }
                          strokeWidth="2"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={
                            currentStep.condValMatch === true 
                              ? '#10b981' 
                              : currentStep.condValMatch === false 
                                ? '#f43f5e' 
                                : '#f59e0b'
                          }
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {currentStep.condValMatch === true 
                            ? 'MATCH ✅' 
                            : currentStep.condValMatch === false 
                              ? 'DIFF ❌' 
                              : 'COMPARE'}
                        </text>
                      </g>
                    </g>
                  )}

                  {/* TREE P */}
                  <g transform="translate(5, 0)">
                    {treePLayout.isEmpty ? (
                      <text x="145" y="130" textAnchor="middle" fill="#64748b" fontSize="13" fontStyle="italic">
                        P is None (Empty Tree)
                      </text>
                    ) : (
                      <>
                        {treePLayout.links.map(link => (
                          <line
                            key={link.id}
                            x1={link.sourceX}
                            y1={link.sourceY}
                            x2={link.targetX}
                            y2={link.targetY}
                            stroke={link.isGhost ? (isDarkMode ? '#334155' : '#e2e8f0') : (isDarkMode ? '#475569' : '#94a3b8')}
                            strokeDasharray={link.isGhost ? '3 3' : 'none'}
                            strokeWidth={link.isGhost ? '1.5' : '2'}
                          />
                        ))}

                        {treePLayout.nodes.map(node => {
                          const isActive = currentStep.activePId === node.id;
                          if (node.isGhost) {
                            return (
                              <g key={node.id} opacity={isActive ? 1 : 0.35}>
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="13"
                                  fill="none"
                                  stroke={isActive ? '#f59e0b' : '#475569'}
                                  strokeDasharray="2 2"
                                  strokeWidth={isActive ? '2' : '1'}
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 3}
                                  textAnchor="middle"
                                  fill={isActive ? '#f59e0b' : '#64748b'}
                                  fontSize="9"
                                  fontFamily="monospace"
                                >
                                  None
                                </text>
                              </g>
                            );
                          }

                          return (
                            <g key={node.id} className="transition-all duration-300">
                              {isActive && (
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="26"
                                  fill="#10b981"
                                  opacity="0.25"
                                  className="animate-ping"
                                />
                              )}
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r="18"
                                fill={isActive ? '#10b981' : (isDarkMode ? '#1e293b' : '#f8fafc')}
                                stroke={isActive ? '#34d399' : (isDarkMode ? '#334155' : '#cbd5e1')}
                                strokeWidth={isActive ? '3' : '2'}
                              />
                              <text
                                x={node.x}
                                y={node.y + 5}
                                textAnchor="middle"
                                fill={isActive ? '#ffffff' : (isDarkMode ? '#e2e8f0' : '#1e293b')}
                                fontSize="13"
                                fontWeight="bold"
                                fontFamily="monospace"
                              >
                                {node.val}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    )}
                  </g>

                  {/* TREE Q */}
                  <g transform="translate(315, 0)">
                    {treeQLayout.isEmpty ? (
                      <text x="145" y="130" textAnchor="middle" fill="#64748b" fontSize="13" fontStyle="italic">
                        Q is None (Empty Tree)
                      </text>
                    ) : (
                      <>
                        {treeQLayout.links.map(link => (
                          <line
                            key={link.id}
                            x1={link.sourceX}
                            y1={link.sourceY}
                            x2={link.targetX}
                            y2={link.targetY}
                            stroke={link.isGhost ? (isDarkMode ? '#334155' : '#e2e8f0') : (isDarkMode ? '#475569' : '#94a3b8')}
                            strokeDasharray={link.isGhost ? '3 3' : 'none'}
                            strokeWidth={link.isGhost ? '1.5' : '2'}
                          />
                        ))}

                        {treeQLayout.nodes.map(node => {
                          const isActive = currentStep.activeQId === node.id;
                          if (node.isGhost) {
                            return (
                              <g key={node.id} opacity={isActive ? 1 : 0.35}>
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="13"
                                  fill="none"
                                  stroke={isActive ? '#f59e0b' : '#475569'}
                                  strokeDasharray="2 2"
                                  strokeWidth={isActive ? '2' : '1'}
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 3}
                                  textAnchor="middle"
                                  fill={isActive ? '#f59e0b' : '#64748b'}
                                  fontSize="9"
                                  fontFamily="monospace"
                                >
                                  None
                                </text>
                              </g>
                            );
                          }

                          return (
                            <g key={node.id} className="transition-all duration-300">
                              {isActive && (
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="26"
                                  fill="#0284c7"
                                  opacity="0.25"
                                  className="animate-ping"
                                />
                              )}
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r="18"
                                fill={isActive ? '#0284c7' : (isDarkMode ? '#1e293b' : '#f8fafc')}
                                stroke={isActive ? '#38bdf8' : (isDarkMode ? '#334155' : '#cbd5e1')}
                                strokeWidth={isActive ? '3' : '2'}
                              />
                              <text
                                x={node.x}
                                y={node.y + 5}
                                textAnchor="middle"
                                fill={isActive ? '#ffffff' : (isDarkMode ? '#e2e8f0' : '#1e293b')}
                                fontSize="13"
                                fontWeight="bold"
                                fontFamily="monospace"
                              >
                                {node.val}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    )}
                  </g>
                </svg>
              </div>

              {/* Dynamic Comparison Live Banner */}
              <div className="mt-3">
                {currentStep.lineId === 'check_null' || currentStep.lineId === 'return_null' ? (
                  <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    currentStep.returnValue !== null
                      ? currentStep.returnValue 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Base Case Check: p is {currentStep.pValDisplay}, q is {currentStep.qValDisplay}
                      </span>
                    </div>
                    <span className="font-bold font-mono">
                      {currentStep.returnValue !== null ? (currentStep.returnValue ? 'True ✅' : 'False ❌') : 'Evaluating'}
                    </span>
                  </div>
                ) : (
                  <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    currentStep.condValMatch === true
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : currentStep.condValMatch === false
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {currentStep.condValMatch === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : currentStep.condValMatch === false ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-sky-400" />
                      )}
                      <span>
                        Comparing Values: ({currentStep.pNode ? currentStep.pNode.val : 'None'} == {currentStep.qNode ? currentStep.qNode.val : 'None'})
                      </span>
                    </div>
                    <span className="font-bold font-mono">
                      {currentStep.condValMatch === null
                        ? 'Evaluating...'
                        : currentStep.condValMatch ? 'True ✅' : 'False ❌'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* State Metrics Bar */}
            <div className={`rounded-3xl border p-4 shadow-xl transition ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`p-2.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Stack Depth</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">{currentStep.depth}</span>
                  <span className="text-[9px] text-slate-500 block">Peak: {maxDepth}</span>
                </div>
                <div className={`p-2.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Comparisons</span>
                  <span className="text-lg font-mono font-bold text-sky-400">{currentStep.comparisonsCount}</span>
                  <span className="text-[9px] text-slate-500 block">p == q & val</span>
                </div>
                <div className={`p-2.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Calls</span>
                  <span className="text-lg font-mono font-bold text-purple-400">{currentStep.functionCallsCount}</span>
                  <span className="text-[9px] text-slate-500 block">isSameTree</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: RIGHT - Recursion Call Stack with Return Flow (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div className={`rounded-3xl border p-4 shadow-xl transition flex flex-col min-h-[460px] ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Call Stack
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  {currentStep.callStack.length} {currentStep.callStack.length === 1 ? 'Frame' : 'Frames'}
                </span>
              </div>

              {/* Stack Instruction */}
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                Active stack frames stacked vertically. The current active function sits at the <strong>TOP</strong>.
              </p>

              {/* Stack Visualizer */}
              <div className="flex-1 flex flex-col-reverse justify-start gap-2 overflow-y-auto pr-1">
                {currentStep.callStack.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                    <Layers className="w-6 h-6 mb-1 opacity-40" />
                    <span className="text-xs">Stack completely unwound.</span>
                  </div>
                ) : (
                  currentStep.callStack.map((frame, index) => {
                    const isTop = index === currentStep.callStack.length - 1;
                    return (
                      <div
                        key={frame.callId}
                        className={`rounded-2xl border p-3 transition-all duration-300 transform ${
                          isTop
                            ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/60 shadow-lg shadow-purple-950/40 scale-102'
                            : isDarkMode 
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400' 
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                          <span className={isTop ? 'text-purple-300 flex items-center gap-1.5' : 'text-slate-400'}>
                            {isTop && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                            Frame #{frame.callId}: isSameTree
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            Depth {frame.depth}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono mt-1 text-slate-300">
                          p = <span className="text-emerald-400 font-bold">{frame.pDisplay}</span>, q = <span className="text-sky-400 font-bold">{frame.qDisplay}</span>
                        </div>

                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>Focus: {frame.sideLabel}</span>
                          {frame.returnedVal !== null && (
                            <span className={`font-bold px-1.5 py-0.2 rounded ${
                              frame.returnedVal ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              Returns {frame.returnedVal ? 'True' : 'False'}
                            </span>
                          )}
                        </div>

                        {/* Animated Return Flow Indicator */}
                        {isTop && currentStep.returnValue !== null && (
                          <div className="mt-2 pt-2 border-t border-purple-500/30 flex items-center justify-between text-[10px] font-semibold text-emerald-300 animate-pulse">
                            <span className="flex items-center gap-1">
                              <ArrowUp className="w-3.5 h-3.5" /> Return Flow:
                            </span>
                            <span className="font-mono font-bold">
                              {currentStep.returnValue ? 'True ✅' : 'False ❌'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE 4-PART EXPLANATION PANEL */}
        <div className={`rounded-3xl border p-4 sm:p-5 shadow-xl transition ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 font-mono text-emerald-400 border border-slate-700">
                    {currentStep.codeSegment}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {currentStep.whatText}
                </h3>
              </div>
            </div>

            {/* Final Completion Summary Banner */}
            {currentStep.lineId === 'completed' && (
              <div className={`px-4 py-2.5 rounded-2xl font-bold text-sm border flex items-center gap-2 shadow-lg ${
                currentStep.returnValue 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {currentStep.returnValue ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span>Result: {currentStep.returnValue ? 'True (Identical Trees)' : 'False (Different Trees)'}</span>
              </div>
            )}
          </div>

          {/* 4-Box Explanation Grid */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs leading-relaxed">
            {/* Box 1: WHAT */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <span>1. WHAT happened?</span>
              </div>
              <p className="text-slate-300">{currentStep.whatText}</p>
            </div>

            {/* Box 2: WHY */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                <span>2. WHY did it happen?</span>
              </div>
              <p className="text-slate-300">{currentStep.whyText}</p>
            </div>

            {/* Box 3: WHERE */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                <span>3. WHERE are we?</span>
              </div>
              <p className="text-slate-300">{currentStep.whereText}</p>
            </div>

            {/* Box 4: NEXT */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <span>4. WHAT happens next?</span>
              </div>
              <p className="text-slate-300">{currentStep.nextText}</p>
            </div>
          </div>
        </div>

        {/* EXECUTION CONTROLS TOOLBAR */}
        <div className={`rounded-3xl border p-4 shadow-2xl sticky bottom-2 z-30 backdrop-blur-xl transition ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Step scrubber bar */}
            <div className="w-full sm:w-1/3 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Execution Progress</span>
                <span>{currentStepIndex + 1} / {steps.length} Steps</span>
              </div>
              <input
                type="range"
                min="0"
                max={steps.length - 1}
                value={currentStepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Number(e.target.value));
                }}
                className="w-full h-1.5 rounded-lg bg-slate-700 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Step execution buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2.5 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition shadow-sm"
                title="Reset to beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2.5 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition shadow-sm"
                title="Previous Step"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className={`px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                  isPlaying 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIndex >= steps.length - 1}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold flex items-center gap-1.5 border border-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition shadow-sm"
                title="Next Step (1 atomic operation)"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Speed controller */}
            <div className="w-full sm:w-1/4 flex items-center gap-2">
              <span className="text-xs text-slate-400">🐢</span>
              <input
                type="range"
                min="300"
                max="2500"
                step="100"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-700 accent-purple-500 cursor-pointer"
                title="Playback Speed"
              />
              <span className="text-xs text-slate-400">⚡</span>
              <span className="text-[10px] font-mono text-slate-400 w-12 text-right">
                {(playbackSpeed / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
