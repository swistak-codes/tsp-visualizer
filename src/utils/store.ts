import { Dispatch, SetStateAction } from 'react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import {
  Algorithm,
  SearchStrategy,
  StartType,
  TemperatureFunction,
} from './types';
import { create, StoreApi } from 'zustand';
import { generateInitialNodes } from '../logic/helpers/generate-initial-nodes';
import { isFunction } from 'lodash';
import { createContext } from 'zustand-utils';
import { defaultTemperatureAlpha } from './consts';

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

  startType: StartType;
  setStartType: (startType: StartType) => void;

  maxIterations: number;
  setMaxIterations: (maxIterations: number) => void;

  temperatureFunction: TemperatureFunction;
  setTemperatureFunction: (temperatureFunction: TemperatureFunction) => void;

  temperatureAlpha: number;
  setTemperatureAlpha: (temperatureAlpha: number) => void;

  searchStrategy: SearchStrategy;
  setSearchStrategy: (searchStrategy: SearchStrategy) => void;

  initialTemperature: number;
  setInitialTemperature: (initialTemperature: number) => void;
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
      setStateToZustand(nodes, 'nodes', set);
    },
    setEdges: (edges) => {
      setStateToZustand(edges, 'edges', set);
    },

    isAnimating: false,
    setIsAnimating: (isAnimating) => {
      setStateToZustand(isAnimating, 'isAnimating', set);
    },

    algorithm: initialAlgorithm,
    setAlgorithm: (algorithm) => {
      set({ algorithm });
    },

    nodesToColor: {},
    setNodesToColor: (nodesToColor) => {
      set({ nodesToColor });
    },

    startType: StartType.initial,
    setStartType: (startType) => set({ startType }),

    maxIterations: 1000,
    setMaxIterations: (maxIterations) => set({ maxIterations }),

    temperatureFunction: TemperatureFunction.linear,
    setTemperatureFunction: (temperatureFunction) =>
      set({
        temperatureFunction,
        temperatureAlpha: defaultTemperatureAlpha[temperatureFunction],
      }),

    temperatureAlpha: defaultTemperatureAlpha[TemperatureFunction.linear],
    setTemperatureAlpha: (temperatureAlpha) => set({ temperatureAlpha }),

    searchStrategy: SearchStrategy.random,
    setSearchStrategy: (searchStrategy) => set({ searchStrategy }),

    initialTemperature: 100,
    setInitialTemperature: (initialTemperature) => set({ initialTemperature }),
  }));

const setStateToZustand = <T>(
  setter: SetStateAction<T>,
  propertyName: keyof State,
  set: StoreApi<State>['setState']
) => {
  set((state) => ({
    [propertyName]: isFunction(setter)
      ? setter(state[propertyName] as T)
      : setter,
  }));
};

const { Provider, useStore } = createContext<StoreApi<State>>();

export const useAppState = useStore;
export const StateProvider = Provider;
