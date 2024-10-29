import { Node } from '@xyflow/react';
import {
  AlgoFunction,
  SearchStrategy,
  TemperatureFunction,
} from '../../utils/types';
import { getRandomNeighbor } from '../helpers/get-random-neighbor';
import { getNeighbors } from '../helpers/get-neighbors';
import { pathDistance } from '../helpers/path-distance';
import { pathToEdges } from '../mappers/path-to-edges';
import {
  CURRENT_MIN_COLOR,
  CURRENT_TESTED_COLOR,
  FINAL_COLOR,
} from '../../utils/consts';
import { getInitialTour } from '../helpers/get-initial-tour';

type TemperatureFunctionType = (
  progress: number,
  initial: number,
  alpha: number
) => number;
type SearchFunctionType = (nodes: Node[]) => Node[][];

const temperature: Record<TemperatureFunction, TemperatureFunctionType> = {
  [TemperatureFunction.linear]: (progress, initial) => initial * (1 - progress),
  [TemperatureFunction.logarithmic]: (progress, initial, alpha) =>
    initial / Math.log(1 + progress * alpha),
  [TemperatureFunction.exponential]: (progress, initial, alpha) =>
    initial * Math.pow(alpha, progress),
  [TemperatureFunction.power]: (progress, initial, alpha) =>
    initial * Math.pow(1 - progress, alpha),
};

const neighbors: Record<SearchStrategy, SearchFunctionType> = {
  [SearchStrategy.random]: getRandomNeighbor,
  [SearchStrategy.breakOnFirstAccepted]: getNeighbors,
  [SearchStrategy.checkAll]: getNeighbors,
};

export const sa: AlgoFunction = function* (
  nodes,
  omitIntermediate,
  startType,
  {
    maxIterations,
    searchStrategy,
    temperatureAlpha,
    temperatureFunction,
    initialTemperature,
  }
) {
  let currentPath = getInitialTour(nodes, startType);
  let currentLength = pathDistance(currentPath, false);
  let globalBestPath = currentPath;
  let globalBestLength = currentLength;
  if (!omitIntermediate) {
    yield {
      edges: pathToEdges([...currentPath, currentPath[0]], FINAL_COLOR),
      iterationsToAdd: 0,
      minLength: currentLength,
    };
  } else {
    yield { edges: [] };
  }
  for (let i = 0; i < maxIterations; i++) {
    const t = temperature[temperatureFunction](
      (i + 1) / maxIterations,
      initialTemperature,
      temperatureAlpha
    );
    for (const neighbor of neighbors[searchStrategy](currentPath)) {
      const neighborLength = pathDistance(neighbor, false);
      const delta = neighborLength - currentLength;
      const probability = Math.exp(-delta / t);
      console.log(probability);
      const random = Math.random();
      if (!omitIntermediate) {
        yield {
          edges: [
            ...pathToEdges(
              [...globalBestPath, globalBestPath[0]],
              CURRENT_MIN_COLOR
            ),
            ...pathToEdges([...currentPath, currentPath[0]], FINAL_COLOR),
            ...pathToEdges([...neighbor, neighbor[0]], CURRENT_TESTED_COLOR),
          ],
          minLength: globalBestLength,
          currentLength: currentLength,
          stage: `Temperatura: ${t.toFixed(2)}, delta: ${Math.floor(delta)}${
            probability <= 1
              ? `, prawdopodobieństwo: ${probability.toFixed(
                  4
                )}, losowa liczba: ${random.toFixed(4)}`
              : ', trasa krótsza'
          }`,
        };
      } else {
        yield { edges: [] };
      }
      if (delta < 0 || (delta > 0 && probability >= random)) {
        currentPath = neighbor;
        currentLength = neighborLength;
        if (currentLength < globalBestLength) {
          globalBestPath = currentPath;
          globalBestLength = currentLength;
        }
        if (searchStrategy === SearchStrategy.breakOnFirstAccepted) {
          break;
        }
      }
    }
  }
  globalBestPath.push(globalBestPath[0]);
  const finalResult = {
    edges: pathToEdges(globalBestPath, FINAL_COLOR),
    iterationsToAdd: 0,
    minLength: globalBestLength,
  };
  yield finalResult;
  return finalResult;
};
