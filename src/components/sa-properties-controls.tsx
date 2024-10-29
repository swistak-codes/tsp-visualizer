import { useSaPropertiesControls } from '../logic/hooks/use-sa-properties-controls';
import styles from '../styles.module.scss';
import { SearchStrategy, TemperatureFunction } from '../utils/types';
import { temperatureInputSettings } from '../utils/consts';

export const SaPropertiesControls = () => {
  const {
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
  } = useSaPropertiesControls();

  return showSaProperties ? (
    <div className={styles['controlsContainer']}>
      <details>
        <summary>Ustawienia</summary>
        <div className={styles['controlsContainer']}>
          <label>
            Funkcja temperatury:{' '}
            <select
              value={temperatureFunction}
              onChange={handleTemperatureFunctionChange}
            >
              <option value={TemperatureFunction.linear}>Liniowa</option>
              <option value={TemperatureFunction.logarithmic}>
                Logarytmiczna
              </option>
              <option value={TemperatureFunction.exponential}>
                Wykładnicza
              </option>
              <option value={TemperatureFunction.power}>Potęgowa</option>
            </select>
          </label>
          <label>
            Początkowa temperatura:{' '}
            <input
              type="number"
              value={initialTemperature}
              onChange={handleInitialTemperatureChange}
              step={10}
              min={0}
              max={100000}
            />
          </label>
          {showAlpha && (
            <label>
              Współczynnik chłodzenia:{' '}
              <input
                type="number"
                value={temperatureAlpha}
                onChange={handleTemperatureAlphaChange}
                step={temperatureInputSettings[temperatureFunction].step}
                min={temperatureInputSettings[temperatureFunction].min}
                max={temperatureInputSettings[temperatureFunction].max}
              />
            </label>
          )}
          <label>
            Limit iteracji:{' '}
            <input
              type="number"
              value={maxIterations}
              onChange={handleMaxIterationsChange}
              step={10}
              min={0}
              max={100000}
            />
          </label>
          <label>
            Strategia:{' '}
            <select
              value={searchStrategy}
              onChange={handleSearchStrategyChange}
            >
              <option value={SearchStrategy.random}>Losowy sąsiad</option>
              <option value={SearchStrategy.breakOnFirstAccepted}>
                Przerwij po akceptacji
              </option>
              <option value={SearchStrategy.checkAll}>
                Sprawdź wszystkich
              </option>
            </select>
          </label>
        </div>
      </details>
    </div>
  ) : null;
};
