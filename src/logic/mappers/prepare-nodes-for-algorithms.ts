import { Node } from '@xyflow/react';

export const prepareNodesForAlgorithms = (nodes: Node[]) => {
  return {
    nodeMap: new Map(nodes.map((x) => [x.id, x])),
    ids: nodes.map((x) => x.id),
  };
};
