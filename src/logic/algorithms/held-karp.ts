import { Node } from '@xyflow/react';
import { AlgoFunction } from '../../utils/types';
import { distance } from '../helpers/distance';
import { pathToEdges } from '../mappers/path-to-edges';
import {
  CURRENT_MIN_COLOR,
  CURRENT_TESTED_COLOR,
  FINAL_COLOR,
} from '../../utils/consts';
import { orderBy } from 'lodash';
import { pathDistance } from '../helpers/path-distance';

type PartialPath = {
  cost: number;
  path: Node[];
  memo: Map<string, PartialPath>;
};

function memoKey(visitedSet: Set<number>, last: number) {
  const visitedKey = [...visitedSet].sort().join(',');
  return `${visitedKey},${last}`;
}

function* doHeldKarp(nodes: Node[]) {
  const n = nodes.length;
  const memo = new Map<string, PartialPath>();

  function* heldKarpRec(
    visitedSet: Set<number>,
    last: number
  ): Generator<PartialPath> {
    const key = memoKey(visitedSet, last);
    if (memo.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      yield memo.get(key)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return memo.get(key)!;
    }

    if (visitedSet.size === n) {
      const finalPath = {
        cost: distance(nodes[last], nodes[0]),
        path: [nodes[last], nodes[0]],
        memo,
      };
      yield finalPath;
      return finalPath;
    }

    let minLength = Number.POSITIVE_INFINITY;
    let minPath: Node[] = [];

    for (let next = 0; next < n; next++) {
      if (!visitedSet.has(next)) {
        const newVisitedSet = new Set(visitedSet);
        newVisitedSet.add(next);

        const result = yield* heldKarpRec(newVisitedSet, next);
        const currentCost = distance(nodes[last], nodes[next]) + result.cost;

        if (currentCost < minLength) {
          minLength = currentCost;
          minPath = [nodes[last], ...result.path];
        }

        yield {
          cost: minLength,
          path: minPath,
          memo,
        };
      }
    }

    const finalResult = { cost: minLength, path: minPath, memo };
    memo.set(key, finalResult);

    yield finalResult;
    return finalResult;
  }

  return yield* heldKarpRec(new Set([0]), 0);
}

function getOnlyLongestPaths(
  pathsMap: Map<string, PartialPath>,
  levels: number
) {
  const orderedPaths = orderBy(
    [...pathsMap.values()],
    (x) => x.path.length,
    'desc'
  );
  if (orderedPaths.length === 0) {
    return [];
  }
  let currentLevel = 0;
  let lastLength = 0;
  let i = 0;
  const result: Node[][] = [];
  while (currentLevel <= levels && i < orderedPaths.length) {
    const path = orderedPaths[i];
    if (path.path.length !== lastLength) {
      currentLevel++;
      lastLength = path.path.length;
    }
    result.push(path.path);
    i++;
  }
  return result;
}

export const heldKarp: AlgoFunction = function* (nodes, omitIntermediate) {
  let lastIteration: PartialPath | null = null;
  for (const iteration of doHeldKarp(nodes)) {
    lastIteration = iteration;
    if (!omitIntermediate) {
      yield {
        edges: [
          ...getOnlyLongestPaths(iteration.memo, 1).flatMap((x) =>
            pathToEdges(x, CURRENT_MIN_COLOR)
          ),
          ...pathToEdges(iteration.path, CURRENT_TESTED_COLOR),
        ],
      };
    } else {
      yield { edges: [] };
    }
  }
  if (!lastIteration) {
    return { edges: [] };
  }
  return {
    edges: pathToEdges(lastIteration.path, FINAL_COLOR),
    iterationsToAdd: 0,
    minLength: pathDistance(lastIteration.path),
  };
};
