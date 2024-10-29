import { ChangeEvent, useCallback } from 'react';
import { State, useAppState } from '../../utils/store';
import { algorithmsWithStartControls } from '../../utils/consts';

const useStartTypeControlsSelector = (state: State) =>
  [state.algorithm, state.startType, state.setStartType] as const;

export const useStartTypeControls = () => {
  const [algorithm, startType, setStartType] = useAppState(
    useStartTypeControlsSelector
  );

  const handleStartTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setStartType(Number(e.target.value));
    },
    [setStartType]
  );

  const showStartType = algorithmsWithStartControls[algorithm];

  return { handleStartTypeChange, startType, showStartType };
};
