import { Node } from '@xyflow/react';
import { distance } from './distance';

export function pathDistance(nodes: Node[], isLooped = true) {
  let result = 0;
  for (let i = 0; i < nodes.length - 1; i++) {
    result += distance(nodes[i], nodes[i + 1]);
  }
  if (!isLooped) {
    result += distance(nodes.at(-1), nodes[0]);
  }
  return result;
}
