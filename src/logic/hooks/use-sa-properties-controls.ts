import { ChangeEvent, useCallback } from 'react';
import { State, useAppState } from '../../utils/store';
import { TemperatureFunction } from '../../utils/types';

const useSaPropertiesControlsSelector = (state: State) =>
  [
    state.algorithm,
    state.initialTemperature,
    state.setInitialTemperature,
    state.temperatureFunction,
    state.setTemperatureFunction,
    state.temperatureAlpha,
    state.setTemperatureAlpha,
    state.maxIterations,
    state.setMaxIterations,
    state.searchStrategy,
    state.setSearchStrategy,
  ] as const;

export const useSaPropertiesControls = () => {
  const [
    algorithm,
    initialTemperature,
    setInitialTemperature,
    temperatureFunction,
    setTemperatureFunction,
    temperatureAlpha,
    setTemperatureAlpha,
    maxIterations,
    setMaxIterations,
    searchStrategy,
    setSearchStrategy,
  ] = useAppState(useSaPropertiesControlsSelector);

  const handleSearchStrategyChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSearchStrategy(Number(e.target.value));
    },
    [setSearchStrategy]
  );

  const handleInitialTemperatureChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInitialTemperature(e.target.valueAsNumber);
    },
    [setInitialTemperature]
  );

  const handleTemperatureFunctionChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setTemperatureFunction(Number(e.target.value));
    },
    [setTemperatureFunction]
  );

  const handleTemperatureAlphaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTemperatureAlpha(e.target.valueAsNumber);
    },
    [setTemperatureAlpha]
  );

  const handleMaxIterationsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMaxIterations(e.target.valueAsNumber);
    },
    [setMaxIterations]
  );

  const showSaProperties = algorithm === 'sa';
  const showAlpha = temperatureFunction !== TemperatureFunction.linear;

  return {
    showSaProperties,
    showAlpha,
    handleSearchStrategyChange,
    searchStrategy,
    handleInitialTemperatureChange,
    initialTemperature,
    handleTemperatureFunctionChange,
    temperatureFunction,
    handleTemperatureAlphaChange,
    temperatureAlpha,
    handleMaxIterationsChange,
    maxIterations,
  };
};
