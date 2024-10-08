import { ReactFlowProvider } from '@xyflow/react';
import { Canvas } from './components/canvas';
import { Algorithm } from './utils/types';
import { Controls } from './components/controls';
import { AlgorithmChooser } from './components/algorithm-chooser';
import { createStore, StateProvider } from './utils/store';

export interface PresentationsTspProps {
  algorithms: Algorithm[];
}
export function PresentationsTsp({ algorithms }: PresentationsTspProps) {
  if (algorithms.length === 0) {
    throw new Error(
      'Przynajmniej jeden algorytm powinien zostać podany w liście'
    );
  }
  return (
    <StateProvider createStore={createStore(algorithms[0])}>
      <AlgorithmChooser algorithms={algorithms} />
      <ReactFlowProvider>
        <Canvas />
        <Controls />
      </ReactFlowProvider>
    </StateProvider>
  );
}
