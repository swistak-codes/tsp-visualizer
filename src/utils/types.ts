import type { Edge, Node } from '@xyflow/react';

export type Algorithm =
  | 'brute-force'
  | 'held-karp'
  | 'nn'
  | 'rnn'
  | 'christofides';

export type AlgoResult = {
  edges: Edge[];
  iterationsToAdd?: number;
  stage?: string;
  nodesToColor?: Record<string, string>;
};

export type AlgoGenerator = Generator<AlgoResult, AlgoResult, unknown>;

export type AlgoFunction = (
  nodes: Node[],
  omitIntermediate: boolean
) => AlgoGenerator;
