import { AlgoGenerator, AlgoResult } from '../../utils/types';

export const getFinalTourFromIterator = (
  iterator: AlgoGenerator,
  currentIterations = 0
) => {
  let iterations = currentIterations;
  let itResult: IteratorResult<AlgoResult, AlgoResult>;
  do {
    itResult = iterator.next();
    iterations += itResult.value.iterationsToAdd ?? 1;
  } while (!itResult.done);
  const result = itResult.value;
  return { result, iterations };
};
