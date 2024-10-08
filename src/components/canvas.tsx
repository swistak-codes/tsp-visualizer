import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from '@xyflow/react';
import styles from '../styles.module.scss';
import '@xyflow/react/dist/style.css';

import { POINT } from '../utils/consts';
import { PointNode } from './point-node';
import { State, useAppState } from '../utils/store';

const canvasStoreSelector = (state: State) =>
  [
    state.nodes,
    state.edges,
    state.onNodesChange,
    state.onEdgesChange,
    state.isAnimating,
  ] as const;

export const Canvas = () => {
  const [nodes, edges, onNodesChange, onEdgesChange, isAnimating] =
    useAppState(canvasStoreSelector);

  return (
    <div className={styles['canvasContainer']}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={{
          [POINT]: PointNode,
        }}
        elementsSelectable={!isAnimating}
      >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
};
