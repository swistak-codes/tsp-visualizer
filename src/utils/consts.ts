import { Algorithm, NumberInputSettings, TemperatureFunction } from './types';

export const POINT = 'POINT';

export const nodeLimits: Record<Algorithm, number> = {
  'brute-force': 10,
  'held-karp': 15,
  nn: Infinity,
  rnn: Infinity,
  christofides: Infinity,
  'simple-hc': Infinity,
  'steepest-ascent-hc': Infinity,
  sa: Infinity,
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
  'simple-hc': 'simple hill climbing',
  'steepest-ascent-hc': 'steepest-ascent hill climbing',
  sa: 'symulowane wyżarzanie',
};

export const algorithmsWithStartControls: Record<Algorithm, boolean> = {
  rnn: false,
  nn: false,
  christofides: false,
  'held-karp': false,
  'brute-force': false,
  'simple-hc': true,
  'steepest-ascent-hc': true,
  sa: true,
};

export const defaultTemperatureAlpha: Record<TemperatureFunction, number> = {
  [TemperatureFunction.linear]: 1,
  [TemperatureFunction.logarithmic]: 9,
  [TemperatureFunction.exponential]: 0.01,
  [TemperatureFunction.power]: 2,
};

export const temperatureInputSettings: Record<
  TemperatureFunction,
  NumberInputSettings
> = {
  [TemperatureFunction.linear]: { min: 1, max: 1, step: 1 },
  [TemperatureFunction.logarithmic]: { min: 1, max: 100, step: 1 },
  [TemperatureFunction.exponential]: { min: 0.0001, max: 1, step: 0.01 },
  [TemperatureFunction.power]: { min: 1, max: 16, step: 0.01 },
};
