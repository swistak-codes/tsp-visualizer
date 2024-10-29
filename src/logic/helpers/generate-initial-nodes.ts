import { Node } from '@xyflow/react';
import { createPointNode } from '../mappers/create-point-node';

export const generateInitialNodes = () => {
  const result: Node[] = [];
  for (let i = 0; i < 6; i++) {
    result.push(createPointNode());
  }
  return result;
};
