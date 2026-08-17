import type { DetailedProblemData } from '../types';
import { arraysHashingSolutions } from './1_arraysHashing';
import { twoPointersSolutions } from './2_twoPointers';
import { slidingWindowSolutions } from './3_slidingWindow';
import { stackSolutions } from './4_stack';
import { binarySearchSolutions } from './5_binarySearch';
import { linkedListSolutions } from './6_linkedList';
import { treeSolutions } from './7_trees';
import { trieSolutions } from './8_tries';
import { heapSolutions } from './9_heaps';
import { backtrackingSolutions } from './10_backtracking';
import { graphSolutions } from './11_graphs';
import { advancedGraphSolutions } from './12_advancedGraphs';
import { dp1DSolutions } from './13_dp1D';
import { dp2DSolutions } from './14_dp2D';
import { greedySolutions } from './15_greedy';
import { intervalSolutions } from './16_intervals';
import { mathGeometrySolutions } from './17_mathGeometry';
import { bitManipulationSolutions } from './18_bitManipulation';
import { recursionSolutions } from './19_recursion';

export const allCuratedProblemData: Record<string, DetailedProblemData> = {
  ...arraysHashingSolutions,
  ...twoPointersSolutions,
  ...slidingWindowSolutions,
  ...stackSolutions,
  ...binarySearchSolutions,
  ...linkedListSolutions,
  ...treeSolutions,
  ...trieSolutions,
  ...heapSolutions,
  ...backtrackingSolutions,
  ...graphSolutions,
  ...advancedGraphSolutions,
  ...dp1DSolutions,
  ...dp2DSolutions,
  ...greedySolutions,
  ...intervalSolutions,
  ...mathGeometrySolutions,
  ...bitManipulationSolutions,
  ...recursionSolutions,
};
