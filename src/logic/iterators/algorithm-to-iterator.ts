import { AlgoFunction, Algorithm } from '../../utils/types';
import { bruteForce } from '../algorithms/brute-force';
import { heldKarp } from '../algorithms/held-karp';
import { nn } from '../algorithms/nn';
import { rnn } from '../algorithms/rnn';
import { christofides } from '../algorithms/christofides';

export const algorithmToIterator: Record<Algorithm, AlgoFunction> = {
  'brute-force': bruteForce,
  'held-karp': heldKarp,
  nn: nn,
  rnn: rnn,
  christofides: christofides,
} as const;
