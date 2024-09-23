import { AlgoFunction, Algorithm } from '../../utils/types';
import { bruteForce } from '../algorithms/brute-force';
import { heldKarp } from '../algorithms/held-karp';

export const algorithmToIterator: Record<Algorithm, AlgoFunction> = {
  'brute-force': bruteForce,
  'held-karp': heldKarp,
} as const;
