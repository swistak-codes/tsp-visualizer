import { AlgoFunction, Algorithm } from '../../utils/types';
import { bruteForce } from '../algorithms/brute-force';
import { heldKarp } from '../algorithms/held-karp';
import { nn } from '../algorithms/nn';
import { rnn } from '../algorithms/rnn';
import { christofides } from '../algorithms/christofides';
import { hillClimbing } from '../algorithms/hill-climbing';
import { sa } from '../algorithms/sa';

export const algorithmToIterator: Record<Algorithm, AlgoFunction> = {
  'brute-force': bruteForce,
  'held-karp': heldKarp,
  nn: nn,
  rnn: rnn,
  christofides: christofides,
  'simple-hc': hillClimbing(true),
  'steepest-ascent-hc': hillClimbing(false),
  sa: sa,
} as const;
