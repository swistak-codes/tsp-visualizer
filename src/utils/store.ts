import { Dispatch, SetStateAction } from 'react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react';
import { Algorithm } from './types';
import { create, StoreApi } from 'zustand';
import { generateInitialNodes } from '../logic/generate-initial-nodes';
import { isFunction } from 'lodash';
import { createContext } from 'zustand-utils';

export type State = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
  nodesToColor: Record<string, string>;
  setNodesToColor: (nodesToColor: Record<string, string>) => void;
};

export const createStore = (initialAlgorithm: Algorithm) => () =>
  create<State>((set, get) => ({
    nodes: generateInitialNodes(),
    edges: [],
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    setNodes: (nodes) => {
      setStateToZustand(nodes, 'nodes', set, get);
    },
    setEdges: (edges) => {
      setStateToZustand(edges, 'edges', set, get);
    },
    isAnimating: false,
    setIsAnimating: (isAnimating) => {
      setStateToZustand(isAnimating, 'isAnimating', set, get);
    },
    algorithm: initialAlgorithm,
    setAlgorithm: (algorithm) => {
      set({ algorithm });
    },
    nodesToColor: {},
    setNodesToColor: (nodesToColor) => {
      set({ nodesToColor });
    },
  }));

const setStateToZustand = <T>(
  setter: SetStateAction<T>,
  propertyName: keyof State,
  set: StoreApi<State>['setState'],
  get: StoreApi<State>['getState']
) => {
  set({
    [propertyName]: isFunction(setter)
      ? setter(get()[propertyName] as T)
      : setter,
  });
};

const { Provider, useStore } = createContext<StoreApi<State>>();

export const useAppState = useStore;
export const StateProvider = Provider;
