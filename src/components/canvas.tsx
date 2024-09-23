import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from '@xyflow/react';
import styles from '../styles.module.scss';
import '@xyflow/react/dist/style.css';
import { useAppState } from './state-context';

import { POINT } from '../utils/consts';
import { PointNode } from './point-node';

export const Canvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, isAnimating } =
    useAppState();

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
