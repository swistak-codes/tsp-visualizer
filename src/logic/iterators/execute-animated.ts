import { AlgoGenerator, AlgoResult } from '../../utils/types';

let forceStop = false;

export const executeAnimated = async (
  iterator: AlgoGenerator,
  delay: number,
  callback: (data: AlgoResult) => void
) => {
  forceStop = false;
  let result: IteratorResult<AlgoResult, AlgoResult>;
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
