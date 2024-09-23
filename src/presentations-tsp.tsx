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

export interface PresentationsTspProps {
  algorithm: Algorithm;
}

export function PresentationsTsp({ algorithm }: PresentationsTspProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    generateInitialNodes()
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [isAnimating, setIsAnimating] = useState(false);

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
        algorithm,
      }}
    >
      <ReactFlowProvider>
        <Canvas />
        <Controls />
      </ReactFlowProvider>
    </StateContextProvider>
  );
}
