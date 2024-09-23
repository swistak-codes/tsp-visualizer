import { Edge } from '@xyflow/react';
import { AlgoGenerator } from '../../utils/types';

export const getFinalTourFromIterator = (
  iterator: AlgoGenerator,
  currentIterations = 0
) => {
  let iterations = currentIterations;
  let itResult: IteratorResult<Edge[], Edge[]>;
  // for (const partial of iterator) {
  //   console.log('iterate', partial);
  //   result = partial;
  //   iterations++;
  // }
  do {
    itResult = iterator.next();
    iterations++;
  } while (!itResult.done);
  const result = itResult.value;
  return { result, iterations };
};
