import {
  Edge,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { generateInitialNodes } from './logic/generate-initial-nodes';
import { useState } from 'react';
import { StateContextProvider } from './components/state-context';
import { Canvas } from './components/canvas';
import { Algorithm } from './utils/types';
import { Controls } from './components/controls';
import styles from './styles.module.scss';
import { algorithmsMap } from './utils/consts';

export interface PresentationsTspProps {
  algorithms: Algorithm[];
}

export function PresentationsTsp({ algorithms }: PresentationsTspProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    generateInitialNodes()
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithms[0]);
  const [nodesToColor, setNodesToColor] = useState<Record<string, string>>({});

  if (algorithms.length === 0) {
    throw new Error(
      'Przynajmniej jeden algorytm powinien zostać podany w liście'
    );
  }

  return (
    <StateContextProvider
      value={{
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        isAnimating,
        setIsAnimating,
        algorithm: currentAlgorithm,
        nodesToColor,
        setNodesToColor,
      }}
    >
      {/*TODO split to separate component*/}
      {algorithms.length > 1 && (
        <div className={styles['controlsContainer']}>
          <label>
            Algorytm:{' '}
            <select
              value={currentAlgorithm}
              onChange={(x) => setCurrentAlgorithm(x.target.value as Algorithm)}
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
    </StateContextProvider>
  );
}
