import { Node } from '@xyflow/react';

export function toSwapped2opt(nodes: Node[], v1: number, v2: number) {
  const result: Node[] = new Array(nodes.length);
  for (let i = 0; i <= v1; i++) {
    result[i] = nodes[i];
  }
  for (let i = v2, j = v1 + 1; i > v1; i--, j++) {
    result[j] = nodes[i];
  }
  for (let i = v2 + 1; i < nodes.length; i++) {
    result[i] = nodes[i];
  }
  return result;
}
