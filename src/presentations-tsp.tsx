import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/canvas';
import { Algorithm } from './utils/types';
import { Controls } from './components/controls';
import styles from './styles.module.scss';
import { algorithmsMap } from './utils/consts';
import { createStore, State, StateProvider, useAppState } from './utils/store';

export interface PresentationsTspProps {
  algorithms: Algorithm[];
}

const tspSelector = (state: State) =>
  [state.algorithm, state.setAlgorithm] as const;

export function Tsp({ algorithms }: PresentationsTspProps) {
  const [algorithm, setAlgorithm] = useAppState(tspSelector);

  return (
    <>
      {/*TODO split to separate component*/}
      {algorithms.length > 1 && (
        <div className={styles['controlsContainer']}>
          <label>
            Algorytm:{' '}
            <select
              value={algorithm}
              onChange={(x) => setAlgorithm(x.target.value as Algorithm)}
            >
              {algorithms.map((x) => (
                <option value={x}>{algorithmsMap[x]}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <ReactFlowProvider>
        <Canvas />
        <Controls />
      </ReactFlowProvider>
    </>
  );
}

export function PresentationsTsp(props: PresentationsTspProps) {
  if (props.algorithms.length === 0) {
    throw new Error(
      'Przynajmniej jeden algorytm powinien zostać podany w liście'
    );
  }
  return (
    <StateProvider createStore={createStore(props.algorithms[0])}>
      <Tsp {...props} />
    </StateProvider>
  );
}
