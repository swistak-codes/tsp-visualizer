import { useAppState } from '../../components/state-context';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { executeAnimated, stopAnimation } from '../iterators/execute-animated';
import { algorithmToIterator } from '../iterators/algorithm-to-iterator';
import { getFinalTourFromIterator } from '../iterators/get-final-tour-from-iterator';
import { nodeLimits } from '../../utils/consts';
import { AlgoGenerator } from '../../utils/types';

export const useAnimation = () => {
  const { isAnimating, setIsAnimating, nodes, setEdges, algorithm } =
    useAppState();
  const [blockedRewind, setBlockedRewind] = useState(false);
  const [fps, setFps] = useState(30);
  const [isFreshData, setIsFreshData] = useState(true);
  const [iterations, setIterations] = useState(0);
  const iterator = useRef<AlgoGenerator>();

  const compute = useMemo(() => algorithmToIterator[algorithm], [algorithm]);

  const tooManyNodes = useMemo(
    () => nodes.length > nodeLimits[algorithm],
    [algorithm, nodes.length]
  );

  const canExecuteIteration = useMemo(() => nodes.length > 0, [nodes.length]);

  const reset = useCallback(() => {
    setIsAnimating(false);
    setBlockedRewind(false);
    setIsFreshData(true);
    setIterations(0);
    setEdges([]);
    iterator.current = undefined;
  }, [setEdges, setIsAnimating]);

  useEffect(() => {
    reset();
  }, [nodes, reset]);

  const handleFpsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFps(e.currentTarget.valueAsNumber);
    },
    [setFps]
  );

  const startIteration = useCallback(
    (omitIntermediate: boolean) => {
      iterator.current = compute(structuredClone(nodes), omitIntermediate);
      setIsFreshData(false);
      setIterations(0);
    },
    [compute, nodes]
  );

  const goToNext = useCallback(() => {
    if (isFreshData) {
      startIteration(false);
    }
    if (!iterator.current) {
      return;
    }
    const result = iterator.current.next();
    setEdges(result.value);
    setIterations((i) => i + 1);

    if (result.done) {
      setIsFreshData(true);
    }
  }, [isFreshData, setEdges, startIteration]);

  const animate = useCallback(async () => {
    if (isFreshData) {
      startIteration(false);
    }
    if (!iterator.current) {
      return;
    }
    setIsAnimating(true);

    await executeAnimated(iterator.current, Math.round(1000 / fps), (edges) => {
      setIterations((i) => i + 1);
      setEdges(edges);
    });

    setIsAnimating((isAnimating) => {
      if (isAnimating) {
        setIsFreshData(true);
        return false;
      }
      return isAnimating;
    });
  }, [fps, isFreshData, setEdges, setIsAnimating, startIteration]);

  const stopPlaying = useCallback(() => {
    stopAnimation();
    setIsAnimating(false);
  }, [setIsAnimating]);

  const fastForward = useCallback(() => {
    let currentIt = iterations;
    if (isFreshData) {
      startIteration(true);
      currentIt = 0;
    }
    if (!iterator.current) {
      return;
    }
    const { result, iterations: itResult } = getFinalTourFromIterator(
      iterator.current,
      currentIt
    );
    setEdges(result);
    setIterations(itResult);
    setIsFreshData(true);
  }, [isFreshData, iterations, setEdges, startIteration]);

  return {
    isAnimating,
    canExecuteIteration,
    fps,
    blockedRewind,
    handleFpsChange,
    goToNext,
    animate,
    stopPlaying,
    fastForward,
    tooManyNodes,
    iterations,
  };
};
