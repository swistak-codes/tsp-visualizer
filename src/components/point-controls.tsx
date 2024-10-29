import { usePointControls } from '../logic/hooks/use-point-controls';
import styles from '../styles.module.scss';

export const PointControls = () => {
  const { handleAddPoint, handleRestart, handleDelete, showDeleteButton } =
    usePointControls();

  return (
    <div className={styles['controlsContainer']}>
      <button onClick={handleAddPoint}>Dodaj punkt</button>
      <button onClick={handleRestart}>Restart</button>
      {showDeleteButton && <button onClick={handleDelete}>Usuń</button>}
    </div>
  );
};
