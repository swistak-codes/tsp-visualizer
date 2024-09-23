import { Edge, Node } from '@xyflow/react';
import { nanoid } from 'nanoid';

export function pathToEdges(nodes: Node[], color: string): Edge[];
export function pathToEdges(nodes: string[], color: string): Edge[];
export function pathToEdges(nodes: (string | Node)[], color: string) {
  const result: Edge[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const sourceNode = nodes[i - 1];
    const targetNode = nodes[i];
    result.push({
      id: nanoid(),
      source: typeof sourceNode === 'string' ? sourceNode : sourceNode.id,
      target: typeof targetNode === 'string' ? targetNode : targetNode.id,
      style: {
        stroke: color,
      },
      type: 'straight',
      reconnectable: false,
    });
  }
  return result;
}
