import type { Edge, Node } from '@xyflow/react';

export type Algorithm = 'brute-force' | 'held-karp';
export type AlgoGenerator = Generator<Edge[], Edge[], unknown>;
export type AlgoFunction = (
  nodes: Node[],
  omitIntermediate: boolean
) => AlgoGenerator;
