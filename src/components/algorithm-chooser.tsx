import { State, useAppState } from '../utils/store';
import styles from '../styles.module.scss';
import { Algorithm } from '../utils/types';
import { algorithmsMap } from '../utils/consts';
import type { PresentationsTspProps } from '../presentations-tsp';

type Props = Pick<PresentationsTspProps, 'algorithms'>;

const algorithmChooserSelector = (state: State) =>
  [state.algorithm, state.setAlgorithm] as const;

export function AlgorithmChooser({ algorithms }: Props) {
  const [algorithm, setAlgorithm] = useAppState(algorithmChooserSelector);

  return (
    <div className={styles['controlsContainer']}>
      <label>
        Algorytm:{' '}
        <select
          value={algorithm}
          onChange={(x) => setAlgorithm(x.target.value as Algorithm)}
        >
          {algorithms.map((x) => (
            <option key={x} value={x}>
              {algorithmsMap[x]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
