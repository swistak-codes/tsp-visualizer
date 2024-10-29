import { Node } from '@xyflow/react';
import { toSwapped2opt } from './to-swapped-2opt';

export function getNeighbors(nodes: Node[]) {
  const neighbors = [];
  const n = nodes.length;
  for (let v1 = 0; v1 < n - 1; v1++) {
    for (let v2 = v1 + 1; v2 < n; v2++) {
      neighbors.push(toSwapped2opt(nodes, v1, v2));
    }
  }
  return neighbors;
}
