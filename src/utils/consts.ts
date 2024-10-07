import { Algorithm } from './types';

export const POINT = 'POINT';

export const nodeLimits: Record<Algorithm, number> = {
  'brute-force': 10,
  'held-karp': 15,
  nn: Infinity,
  rnn: Infinity,
  christofides: Infinity,
};

export const CURRENT_TESTED_COLOR = '#0000FF';
export const CURRENT_MIN_COLOR = '#AAAAAA';
export const FINAL_COLOR = '#000000';
export const DARKER_NODE = '#ffc900';
export const BRIGHTER_NODE = '#ffe78b';

export const algorithmsMap: Record<Algorithm, string> = {
  rnn: 'powtarzalny najbliższego sąsiada',
  nn: 'najbliższego sąsiada',
  christofides: 'Christofidesa',
  'held-karp': 'Helda-Karpa',
  'brute-force': 'siłowy',
};
