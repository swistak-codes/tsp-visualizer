import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from '../styles.module.scss';
import clsx from 'clsx';
import { CSSProperties } from 'react';
import { State, useAppState } from '../utils/store';

const pointNodeSelector = (state: State) => state.nodesToColor;

export const PointNode = ({ id, selected }: NodeProps) => {
  const nodesToColor = useAppState(pointNodeSelector);
  const additionalCss: CSSProperties =
    id in nodesToColor
      ? {
          backgroundColor: nodesToColor[id],
        }
      : {};

  return (
    <div
      className={clsx({
        [styles['pointNode']]: true,
        [styles['selected']]: selected,
      })}
      style={additionalCss}
    >
      <Handle type="source" position={Position.Left} isConnectable={false} />
      <Handle type="target" position={Position.Right} isConnectable={false} />
    </div>
  );
};
