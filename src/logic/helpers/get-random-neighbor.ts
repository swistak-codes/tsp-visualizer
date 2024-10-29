import { Node } from '@xyflow/react';
import { toSwapped2opt } from './to-swapped-2opt';

export const getRandomNeighbor = (nodes: Node[]) => {
  const n = nodes.length;
  let v1 = Math.floor(Math.random() * (n - 1));
  let v2 = Math.floor(Math.random() * (n - 1));
  while (v1 === v2) {
    v2 = Math.floor(Math.random() * (n - 1));
  }
  if (v1 > v2) {
    const temp = v1;
    v1 = v2;
    v2 = temp;
  }
  return [toSwapped2opt(nodes, v1, v2)];
};
