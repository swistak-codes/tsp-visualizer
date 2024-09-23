import { Edge } from '@xyflow/react';

import { AlgoGenerator } from '../../utils/types';

let forceStop = false;

export const executeAnimated = async (
  iterator: AlgoGenerator,
  delay: number,
  callback: (data: Edge[]) => void
) => {
  forceStop = false;
  let result: IteratorResult<Edge[], Edge[]>;
  do {
    if (forceStop) {
      break;
    }
    result = iterator.next();
    callback(result.value);
    if (forceStop) {
      break;
    }
    await new Promise<void>((resolve) => setTimeout(() => resolve(), delay));
  } while (!result.done && !forceStop);
};

export const stopAnimation = () => {
  forceStop = true;
};
