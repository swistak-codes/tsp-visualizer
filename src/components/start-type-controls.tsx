import { useStartTypeControls } from '../logic/hooks/use-start-type-controls';
import styles from '../styles.module.scss';
import { StartType } from '../utils/types';

export const StartTypeControls = () => {
  const { showStartType, startType, handleStartTypeChange } =
    useStartTypeControls();

  return showStartType ? (
    <div className={styles['controlsContainer']}>
      <label>
        Trasa początkowa:{' '}
        <select value={startType} onChange={handleStartTypeChange}>
          <option value={StartType.initial}>Kolejność dodania</option>
          <option value={StartType.random}>Losowa</option>
          <option value={StartType.rnn}>Z algorytmu RNN</option>
        </select>
      </label>
    </div>
  ) : null;
};
