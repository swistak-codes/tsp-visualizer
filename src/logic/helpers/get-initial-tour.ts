/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Node } from '@xyflow/react';
import { distance } from './distance';
import { StartType } from '../../utils/types';
import { shuffle } from 'lodash';

function rnn(nodes: Node[]) {
  let currentMinLength = Number.POSITIVE_INFINITY;
  let currentMinPath: Node[] = [];
  for (const node of nodes) {
    const visitedNodes = new Set([node]);
    let length = 0;
    const path = [node];
    while (visitedNodes.size < nodes.length) {
      const lastNode = path.at(-1)!;
      let minDistance = Number.POSITIVE_INFINITY;
      let nextNode: Node | null = null;
      for (const node of nodes) {
        if (visitedNodes.has(node)) {
          continue;
        }
        const distanceToNode = distance(lastNode, node);
        if (distanceToNode < minDistance) {
          minDistance = distanceToNode;
          nextNode = node;
        }
      }
      visitedNodes.add(nextNode!);
      path.push(nextNode!);
      length += minDistance;
    }
    length += distance(path.at(-1), node);
    path.push(node);
    if (length < currentMinLength) {
      currentMinLength = length;
      currentMinPath = path;
    }
  }
  return currentMinPath;
}

export const getInitialTour = (nodes: Node[], startType: StartType) => {
  switch (startType) {
    case StartType.initial:
      return [...nodes];
    case StartType.random:
      return shuffle(nodes);
    case StartType.rnn:
      return rnn(nodes);
    default:
      throw new Error('Błędny rodzaj początkowej trasy');
  }
};
