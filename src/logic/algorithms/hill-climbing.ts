import { AlgoFunction } from '../../utils/types';
import { pathToEdges } from '../mappers/path-to-edges';
import {
  CURRENT_MIN_COLOR,
  CURRENT_TESTED_COLOR,
  FINAL_COLOR,
} from '../../utils/consts';
import { pathDistance } from '../helpers/path-distance';
import { getNeighbors } from '../helpers/get-neighbors';
import { getInitialTour } from '../helpers/get-initial-tour';

export const hillClimbing = (isSimple: boolean): AlgoFunction =>
  function* (nodes, omitIntermediate, startType) {
    let currentPath = getInitialTour(nodes, startType);
    let currentLength = pathDistance(currentPath, false);
    let hasImproved = true;
    if (!omitIntermediate) {
      yield {
        edges: pathToEdges([...currentPath, currentPath[0]], FINAL_COLOR),
        iterationsToAdd: 0,
        minLength: currentLength,
      };
    } else {
      yield { edges: [] };
    }
    while (hasImproved) {
      hasImproved = false;
      const neighbors = getNeighbors(currentPath);
      for (const neighbor of neighbors) {
        const newDistance = pathDistance(neighbor, false);
        if (!omitIntermediate) {
          yield {
            edges: [
              ...pathToEdges(
                [...currentPath, currentPath[0]],
                CURRENT_MIN_COLOR
              ),
              ...pathToEdges([...neighbor, neighbor[0]], CURRENT_TESTED_COLOR),
            ],
            minLength: currentLength,
            currentLength: newDistance,
          };
        } else {
          yield { edges: [] };
        }
        if (newDistance < currentLength) {
          currentPath = neighbor;
          currentLength = newDistance;
          hasImproved = true;
          if (isSimple) {
            break;
          }
        }
      }
    }
    currentPath.push(currentPath[0]);
    const finalResult = {
      edges: pathToEdges(currentPath, FINAL_COLOR),
      iterationsToAdd: 0,
      minLength: currentLength,
    };
    yield finalResult;
    return finalResult;
  };
