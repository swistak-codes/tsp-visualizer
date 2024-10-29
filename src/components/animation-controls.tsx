import { useAnimation } from '../logic/hooks/use-animation';
import styles from '../styles.module.scss';

export const AnimationControls = () => {
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
    currentLength,
    minLength,
  } = useAnimation();

  return (
    <>
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
      <div className={styles['controlsContainer']}>
        {minLength != null && (
          <span>Najlepsza trasa: {minLength.toFixed(2)}</span>
        )}
        {currentLength != null && (
          <span>Aktualna trasa: {currentLength.toFixed(2)}</span>
        )}
      </div>
    </>
  );
};
