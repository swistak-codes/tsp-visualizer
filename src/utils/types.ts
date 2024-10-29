import type { Edge, Node } from '@xyflow/react';

export type Algorithm =
  | 'brute-force'
  | 'held-karp'
  | 'nn'
  | 'rnn'
  | 'christofides'
  | 'simple-hc'
  | 'steepest-ascent-hc'
  | 'sa';

export type AlgoResult = {
  edges: Edge[];
  iterationsToAdd?: number;
  stage?: string;
  nodesToColor?: Record<string, string>;
  minLength?: number;
  currentLength?: number;
};

export type AlgoGenerator = Generator<AlgoResult, AlgoResult, unknown>;

export type AlgoFunction = (
  nodes: Node[],
  omitIntermediate: boolean,
  startType: StartType,
  additionalProperties: SaProperties
) => AlgoGenerator;

export const enum StartType {
  initial,
  random,
  rnn,
}

export const enum TemperatureFunction {
  linear,
  logarithmic,
  exponential,
  power,
}

export const enum SearchStrategy {
  random,
  breakOnFirstAccepted,
  checkAll,
}

export type SaProperties = {
  maxIterations: number;
  initialTemperature: number;
  temperatureFunction: TemperatureFunction;
  temperatureAlpha: number;
  searchStrategy: SearchStrategy;
};

export type NumberInputSettings = {
  min: number;
  max: number;
  step: number;
};
