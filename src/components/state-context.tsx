import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { Algorithm } from '../utils/types';

// TODO rewrite to zustand
// https://reactflow.dev/learn/advanced-use/state-management
type StateContextType = {
  nodes: ReturnType<typeof useNodesState>[0];
  setNodes: ReturnType<typeof useNodesState>[1];
  onNodesChange: ReturnType<typeof useNodesState>[2];
  edges: ReturnType<typeof useEdgesState>[0];
  setEdges: ReturnType<typeof useEdgesState>[1];
  onEdgesChange: ReturnType<typeof useEdgesState>[2];
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  algorithm: Algorithm;
  nodesToColor: Record<string, string>;
  setNodesToColor: Dispatch<SetStateAction<Record<string, string>>>;
};

const StateContext = createContext<StateContextType | null>(null);

export const StateContextProvider = StateContext.Provider;

export const useAppState = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw Error('Missing StateContextProvider');
  }

  return context;
};
