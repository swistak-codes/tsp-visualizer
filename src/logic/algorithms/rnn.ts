import { AlgoFunction } from '../../utils/types';
import { distance } from '../helpers/distance';
import { Node } from '@xyflow/react';
import { pathToEdges } from '../mappers/path-to-edges';
import {
  CURRENT_MIN_COLOR,
  CURRENT_TESTED_COLOR,
  FINAL_COLOR,
} from '../../utils/consts';

export const rnn: AlgoFunction = function* (nodes, omitIntermediate) {
  let currentMinLength = Number.POSITIVE_INFINITY;
  let currentMinPath: Node[] = [];
  for (const startNode of nodes) {
    const visitedNodes = new Set([startNode]);
    let length = 0;
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
              ...pathToEdges(currentMinPath, CURRENT_MIN_COLOR),
              ...pathToEdges(path, FINAL_COLOR),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...pathToEdges([path.at(-1)!, node], CURRENT_TESTED_COLOR),
            ],
            minLength: isFinite(currentMinLength)
              ? currentMinLength
              : undefined,
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
      length += minDistance;
    }
    path.push(startNode);
    length += distance(path.at(-2), path.at(-1));
    if (!omitIntermediate) {
      yield {
        edges: [
          ...pathToEdges(currentMinPath, CURRENT_MIN_COLOR),
          ...pathToEdges(path, FINAL_COLOR),
        ],
        minLength: isFinite(currentMinLength) ? currentMinLength : undefined,
        currentLength: length,
      };
    } else {
      yield { edges: [] };
    }
    if (length < currentMinLength) {
      currentMinPath = path;
      currentMinLength = length;
    }
  }
  const finalResult = {
    edges: pathToEdges(currentMinPath, FINAL_COLOR),
    iterationsToAdd: 0,
    minLength: currentMinLength,
  };
  yield finalResult;
  return finalResult;
};
