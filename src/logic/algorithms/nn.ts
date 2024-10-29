import { AlgoFunction } from '../../utils/types';
import { distance } from '../helpers/distance';
import { Node } from '@xyflow/react';
import { pathToEdges } from '../mappers/path-to-edges';
import {
  CURRENT_MIN_COLOR,
  CURRENT_TESTED_COLOR,
  FINAL_COLOR,
} from '../../utils/consts';
import { pathDistance } from '../helpers/path-distance';

export const nn: AlgoFunction = function* (nodes, omitIntermediate) {
  const startNode = nodes.find((x) => x.selected) || nodes[0];
  const visitedNodes = new Set([startNode]);
  const path = [startNode];
  while (visitedNodes.size < nodes.length) {
    const lastNode = path.at(-1);
    let minDistance = Number.POSITIVE_INFINITY;
    let nextNode: Node | null = null;
    for (const node of nodes) {
      if (visitedNodes.has(node)) {
        continue;
      }
      const distanceToNode = distance(lastNode, node);
      if (!omitIntermediate) {
        yield {
          edges: [
            ...pathToEdges(path, CURRENT_MIN_COLOR),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...pathToEdges([path.at(-1)!, node], CURRENT_TESTED_COLOR),
          ],
        };
      } else {
        yield { edges: [] };
      }
      if (distanceToNode < minDistance) {
        minDistance = distanceToNode;
        nextNode = node;
      }
    }
    if (nextNode) {
      visitedNodes.add(nextNode);
      path.push(nextNode);
    }
  }
  path.push(startNode);
  const finalResult = {
    edges: pathToEdges(path, FINAL_COLOR),
    iterationsToAdd: 0,
    minLength: pathDistance(path),
  };
  yield finalResult;
  return finalResult;
};
