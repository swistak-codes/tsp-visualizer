import { Algorithm } from './types';

export const POINT = 'POINT';

export const nodeLimits: Record<Algorithm, number> = {
  'brute-force': 10,
  'held-karp': 15,
};

export const CURRENT_TESTED_COLOR = 'blue';
export const CURRENT_MIN_COLOR = '#AAA';
export const FINAL_COLOR = 'black';
