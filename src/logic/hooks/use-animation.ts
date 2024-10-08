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
import { AlgoGenerator, AlgoResult } from '../../utils/types';
import { State, useAppState } from '../../utils/store';

const useAnimationSelector = (state: State) =>
  [
    state.isAnimating,
    state.setIsAnimating,
    state.nodes,
    state.setEdges,
    state.algorithm,
    state.setNodesToColor,
  ] as const;

export const useAnimation = () => {
  const [
    isAnimating,
    setIsAnimating,
    nodes,
    setEdges,
    algorithm,
    setNodesToColor,
  ] = useAppState(useAnimationSelector);
  const [blockedRewind, setBlockedRewind] = useState(false);
  const [fps, setFps] = useState(30);
  const [isFreshData, setIsFreshData] = useState(true);
  const [iterations, setIterations] = useState(0);
  const [stage, setStage] = useState<string | undefined>();
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

  const updateResult = useCallback(
    (result: AlgoResult) => {
      setEdges(result.edges);
      const iterations = result.iterationsToAdd ?? 1;
      setIterations((i) => i + iterations);
      setNodesToColor(result.nodesToColor || {});
      setStage(result.stage);
    },
    [setEdges, setNodesToColor, setStage]
  );

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
    updateResult(result.value);

    if (result.done) {
      setIsFreshData(true);
    }
  }, [isFreshData, startIteration, updateResult]);

  const animate = useCallback(async () => {
    if (isFreshData) {
      startIteration(false);
    }
    if (!iterator.current) {
      return;
    }
    setIsAnimating(true);

    await executeAnimated(
      iterator.current,
      Math.round(1000 / fps),
      updateResult
    );

    setIsAnimating((isAnimating) => {
      if (isAnimating) {
        setIsFreshData(true);
        return false;
      }
      return isAnimating;
    });
  }, [fps, isFreshData, setIsAnimating, startIteration, updateResult]);

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
    setEdges(result.edges);
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
    stage,
  };
};
