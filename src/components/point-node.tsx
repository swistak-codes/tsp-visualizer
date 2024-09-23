import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from '../styles.module.scss';
import clsx from 'clsx';

export const PointNode = ({ selected }: NodeProps) => {
  return (
    <div
      className={clsx({
        [styles['pointNode']]: true,
        [styles['selected']]: selected,
      })}
    >
      <Handle type="source" position={Position.Left} isConnectable={false} />
      <Handle type="target" position={Position.Right} isConnectable={false} />
    </div>
  );
};
