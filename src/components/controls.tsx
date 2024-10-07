import styles from '../styles.module.scss';
import { usePointControls } from '../logic/hooks/use-point-controls';
import { useAnimation } from '../logic/hooks/use-animation';
import { useAppState } from './state-context';

export const Controls = () => {
  const { handleAddPoint, handleRestart, handleDelete, showDeleteButton } =
    usePointControls();
  const {
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
  } = useAnimation();

  return (
    <>
      <div className={styles['controlsContainer']}>
        <button onClick={handleAddPoint} disabled={isAnimating}>
          Dodaj punkt
        </button>
        <button onClick={handleRestart}>Restart</button>
        {showDeleteButton && <button onClick={handleDelete}>Usuń</button>}
      </div>
      <div className={styles['controlsContainer']}>
        <button
          disabled={!canExecuteIteration || isAnimating}
          onClick={goToNext}
        >
          Następny krok
        </button>
        <label>
          Prędkość animacji:{' '}
          <input
            min={1}
            max={60}
            type="number"
            value={fps}
            onChange={handleFpsChange}
            disabled={!canExecuteIteration || isAnimating}
          />
        </label>
        {!isAnimating ? (
          <button disabled={!canExecuteIteration} onClick={animate}>
            Odtwórz animację
          </button>
        ) : (
          <button disabled={!canExecuteIteration} onClick={stopPlaying}>
            Pauza
          </button>
        )}
        <button
          disabled={
            blockedRewind || !canExecuteIteration || isAnimating || tooManyNodes
          }
          onClick={fastForward}
        >
          Przewiń do końca
        </button>
      </div>
      {stage && <div className={styles['controlsContainer']}>{stage}</div>}
      <div className={styles['controlsContainer']}>
        Liczba iteracji: {iterations}
      </div>
    </>
  );
};
