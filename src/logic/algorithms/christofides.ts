/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { distance } from '../helpers/distance';
import { Node, Edge } from '@xyflow/react';
import { AlgoFunction, AlgoResult } from '../../utils/types';
import { pathToEdges } from '../mappers/path-to-edges';
import {
  BRIGHTER_NODE,
  CURRENT_MIN_COLOR,
  CURRENT_TESTED_COLOR,
  DARKER_NODE,
  FINAL_COLOR,
} from '../../utils/consts';
import { nanoid } from 'nanoid';
import { pathDistance } from '../helpers/path-distance';

type EdgeType = {
  from: Node;
  to: Node;
  weight: number;
};

let omit = false;

function edgesToRfEdges(edges: EdgeType[], color: string): Edge[] {
  return edges.map((x) => ({
    id: nanoid(),
    source: x.from.id,
    target: x.to.id,
    style: {
      stroke: color,
    },
    type: 'straight',
    reconnectable: false,
  }));
}

function getGrayscaleColor(current: number, all: number) {
  const min = 10;
  const max = 255;
  const t = current / all;
  const value = Math.trunc((1 - t) * min + t * max);
  const hexValue = value.toString(16).padStart(2, '0');
  return `#${hexValue.repeat(3)}`;
}

function getTransparentColor(color: string, current: number, all: number) {
  const min = 10;
  const max = 255;
  const t = current / all;
  const value = Math.trunc((1 - t) * min + t * max);
  const hexValue = value.toString(16).padStart(2, '0');
  return `${color}${hexValue}`;
}

function* mst(nodes: Node[]): Generator<AlgoResult, EdgeType[], AlgoResult> {
  const edges: EdgeType[] = [];
  let iterations = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      iterations++;
      const newEdge: EdgeType = {
        from: nodes[i],
        to: nodes[j],
        weight: distance(nodes[i], nodes[j]),
      };
      if (omit) {
        yield { edges: [] };
      } else {
        yield {
          edges: [
            ...edgesToRfEdges(edges, FINAL_COLOR),
            ...edgesToRfEdges([newEdge], CURRENT_TESTED_COLOR),
          ],
          stage: 'Algorytm Kruskala — tworzenie listy krawędzi',
        };
      }
      edges.push(newEdge);
    }
  }
  iterations = 0;
  edges.sort((a, b) => {
    iterations++;
    return a.weight - b.weight;
  });
  const coloredSortedEdges = edges.flatMap((x, i) =>
    edgesToRfEdges([x], getGrayscaleColor(i, edges.length))
  );
  yield {
    edges: coloredSortedEdges,
    stage: 'Algorytm Kruskala — sortowanie krawędzi wg wagi',
    iterationsToAdd: iterations,
  };
  const parent = new Map<Node, Node>();
  const rank = new Map<Node, number>();

  function find(node: Node) {
    if (parent.get(node) !== node) {
      parent.set(node, find(parent.get(node)!));
    }
    return parent.get(node)!;
  }
  function union(node1: Node, node2: Node) {
    const root1 = find(node1);
    const root2 = find(node2);
    if (root1 !== root2) {
      if (rank.get(root1)! > rank.get(root2)!) {
        parent.set(root2, root1);
      } else if (rank.get(root1)! < rank.get(root2)!) {
        parent.set(root1, root2);
      } else {
        parent.set(root2, root1);
        rank.set(root1, rank.get(root1)! + 1);
      }
    }
  }
  for (const node of nodes) {
    parent.set(node, node);
    rank.set(node, 0);
    if (omit) {
      yield { edges: [] };
    } else {
      yield {
        edges: coloredSortedEdges,
        nodesToColor: Object.fromEntries([
          ...[...rank.keys()].map((oldNode) => [oldNode.id, DARKER_NODE]),
          [node.id, CURRENT_TESTED_COLOR],
        ]),
        stage: 'Algorytm Kruskala — inicjalizacja lasu',
      };
    }
  }
  if (!omit) {
    yield {
      edges: coloredSortedEdges,
      nodesToColor: Object.fromEntries(
        [...rank.keys()].map((oldNode) => [oldNode.id, DARKER_NODE])
      ),
      iterationsToAdd: 0,
      stage: 'Algorytm Kruskala — inicjalizacja lasu',
    };
  }
  const mst: EdgeType[] = [];
  for (const edge of edges) {
    if (omit) {
      yield { edges: [] };
    } else {
      yield {
        edges: [
          ...edgesToRfEdges(mst, FINAL_COLOR),
          ...edgesToRfEdges([edge], CURRENT_TESTED_COLOR),
        ],
        stage: 'Algorytm Kruskala — konstrukcja MST',
      };
    }
    if (find(edge.from) !== find(edge.to)) {
      mst.push(edge);
      union(edge.from, edge.to);
    }
  }
  if (!omit) {
    yield {
      edges: edgesToRfEdges(mst, FINAL_COLOR),
      stage: 'Algorytm Kruskala — rezultat',
      iterationsToAdd: 0,
    };
  }
  return mst;
}

function generateNodesToColorEntriesForDegreeMap(
  degree: Map<Node, number>,
  color: string
) {
  const max = Math.max(...degree.values());
  return [...degree.entries()].map(([node, degree]) => [
    node.id,
    getTransparentColor(color, degree, max),
  ]);
}

function* getOddDegreeNodes(
  edges: EdgeType[]
): Generator<AlgoResult, Node[], AlgoResult> {
  const degree = new Map<Node, number>();
  const rfEdges = edgesToRfEdges(edges, FINAL_COLOR);
  for (const edge of edges) {
    degree.set(edge.from, (degree.get(edge.from) || 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) || 0) + 1);
    if (omit) {
      yield { edges: [] };
    } else {
      yield {
        edges: rfEdges,
        nodesToColor: Object.fromEntries([
          ...generateNodesToColorEntriesForDegreeMap(degree, DARKER_NODE),
          [edge.from, CURRENT_TESTED_COLOR],
          [edge.to, CURRENT_TESTED_COLOR],
        ]),
        stage:
          'Szukanie wierzchołków nieparzystego stopnia — zliczanie sąsiadów',
      };
    }
  }
  const coloredNodes = generateNodesToColorEntriesForDegreeMap(
    degree,
    BRIGHTER_NODE
  );
  if (!omit) {
    yield {
      edges: rfEdges,
      nodesToColor: Object.fromEntries(coloredNodes),
      stage: 'Szukanie wierzchołków nieparzystego stopnia — zliczanie sąsiadów',
      iterationsToAdd: 0,
    };
  }
  const result: Node[] = [];
  for (const [node, value] of degree) {
    if (omit) {
      yield { edges: [] };
    } else {
      yield {
        edges: rfEdges,
        nodesToColor: Object.fromEntries([
          ...coloredNodes,
          ...result.map((oldNode) => [oldNode.id, DARKER_NODE]),
          [node.id, CURRENT_TESTED_COLOR],
        ]),
        stage:
          'Szukanie wierzchołków nieparzystego stopnia — sprawdzanie stopnia wierzchołka',
      };
    }
    if (value % 2 !== 0) {
      result.push(node);
    }
  }
  if (!omit) {
    yield {
      edges: rfEdges,
      nodesToColor: Object.fromEntries(
        result.map((oldNode) => [oldNode.id, DARKER_NODE])
      ),
      iterationsToAdd: 0,
      stage:
        'Szukanie wierzchołków nieparzystego stopnia — sprawdzanie stopnia wierzchołka',
    };
  }
  return result;
}

function* perfectMatch(
  oddNodes: Node[]
): Generator<AlgoResult, EdgeType[], AlgoResult> {
  const result: EdgeType[] = [];
  const used = new Set<Node>();
  const oddNodesColored = oddNodes.map((oddNode) => [
    oddNode.id,
    BRIGHTER_NODE,
  ]);
  for (let i = 0; i < oddNodes.length; i++) {
    if (!used.has(oddNodes[i])) {
      let bestMatch = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let j = i + 1; j < oddNodes.length; j++) {
        if (!used.has(oddNodes[j])) {
          const d = distance(oddNodes[i], oddNodes[j]);
          if (omit) {
            yield { edges: [] };
          } else {
            yield {
              edges: [
                ...edgesToRfEdges(result, FINAL_COLOR),
                ...(bestMatch
                  ? pathToEdges([oddNodes[i], bestMatch], CURRENT_MIN_COLOR)
                  : []),
                ...pathToEdges(
                  [oddNodes[i], oddNodes[j]],
                  CURRENT_TESTED_COLOR
                ),
              ],
              nodesToColor: Object.fromEntries([
                ...oddNodesColored,
                [oddNodes[i].id, DARKER_NODE],
                [oddNodes[j].id, CURRENT_TESTED_COLOR],
              ]),
              stage: 'Szukanie skojarzeń doskonałych',
            };
          }
          if (d < bestDistance) {
            bestDistance = d;
            bestMatch = oddNodes[j];
          }
        }
      }
      if (bestMatch !== null) {
        result.push({
          from: oddNodes[i],
          to: bestMatch,
          weight: bestDistance,
        });
        used.add(oddNodes[i]);
        used.add(bestMatch);
      }
    }
  }
  if (!omit) {
    yield {
      edges: edgesToRfEdges(result, FINAL_COLOR),
      nodesToColor: Object.fromEntries(oddNodesColored),
      stage: 'Szukanie skojarzeń doskonałych',
      iterationsToAdd: 0,
    };
  }
  return result;
}

function getEdgeId(node1: Node, node2: Node) {
  return node1.id < node2.id
    ? `${node1.id}-${node2.id}`
    : `${node2.id}-${node1.id}`;
}

function* getEulerianCircuit(
  multigraph: EdgeType[]
): Generator<AlgoResult, Node[], AlgoResult> {
  const adjList = new Map<Node, Node[]>();
  const visitedEdges = new Set<string>();
  const rfMultigraph = edgesToRfEdges(multigraph, CURRENT_MIN_COLOR);
  const adjListVisited: EdgeType[] = [];
  for (const edge of multigraph) {
    if (!adjList.has(edge.from)) {
      adjList.set(edge.from, []);
    }
    if (!adjList.has(edge.to)) {
      adjList.set(edge.to, []);
    }
    adjList.get(edge.from)!.push(edge.to);
    adjList.get(edge.to)!.push(edge.from);
    if (omit) {
      yield { edges: [] };
    } else {
      yield {
        edges: [
          ...rfMultigraph,
          ...edgesToRfEdges(adjListVisited, FINAL_COLOR),
          ...edgesToRfEdges([edge], CURRENT_TESTED_COLOR),
        ],
        stage: "Algorytm Fleury'ego — budowanie listy sąsiedztwa",
      };
    }
    adjListVisited.push(edge);
  }
  if (!omit) {
    yield {
      edges: edgesToRfEdges(adjListVisited, FINAL_COLOR),
      stage: "Algorytm Fleury'ego — budowanie listy sąsiedztwa",
      iterationsToAdd: 0,
    };
  }
  const result: Node[] = [];
  const stack = [multigraph[0].from];
  const visitedEdgesList: EdgeType[] = [];
  while (stack.length > 0) {
    const node = stack.at(-1)!;
    let hasVisited = false;
    const neighbors = adjList.get(node)!;
    for (const next of neighbors) {
      const edgeId = getEdgeId(node, next);
      if (omit) {
        yield { edges: [] };
      } else {
        yield {
          edges: [
            ...pathToEdges(result, FINAL_COLOR),
            ...edgesToRfEdges(visitedEdgesList, CURRENT_MIN_COLOR),
          ],
          nodesToColor: Object.fromEntries([
            ...stack.map((oldNode) => [oldNode.id, BRIGHTER_NODE]),
            [node.id, DARKER_NODE],
            [next.id, CURRENT_TESTED_COLOR],
          ]),
          stage: "Algorytm Fleury'ego — budowa cyklu Eulera",
        };
      }
      if (!visitedEdges.has(edgeId)) {
        visitedEdges.add(edgeId);
        visitedEdgesList.push({ from: node, to: next, weight: 0 });
        stack.push(next);
        hasVisited = true;
        break;
      }
    }
    if (!hasVisited) {
      result.push(stack.pop()!);
    }
  }
  if (!omit) {
    yield {
      edges: pathToEdges(result, FINAL_COLOR), // result final,
      stage: "Algorytm Fleury'ego — budowa cyklu Eulera",
      iterationsToAdd: 0,
    };
  }
  return result;
}

function* convertToHamiltonianPath(
  nodes: Node[]
): Generator<AlgoResult, Node[], AlgoResult> {
  const visited = new Set<Node>();
  const result: Node[] = [];
  const oldPath = pathToEdges(nodes, CURRENT_MIN_COLOR);
  for (const node of nodes) {
    if (omit) {
      yield { edges: [] };
    } else {
      yield {
        edges: [...oldPath, ...pathToEdges(result, FINAL_COLOR)],
        nodesToColor: Object.fromEntries([
          ...[...visited.values()].map((oldNode) => [
            oldNode.id,
            BRIGHTER_NODE,
          ]),
          [node.id, CURRENT_TESTED_COLOR],
        ]),
        stage: 'Budowa ścieżki Hamiltona',
      };
    }
    if (!visited.has(node)) {
      result.push(node);
      visited.add(node);
    }
  }
  return result;
}

export const christofides: AlgoFunction = function* (
  nodes: Node[],
  omitIntermediate
) {
  omit = omitIntermediate;
  // creating MST
  let tree: EdgeType[] = [];
  const mstIterator = mst(nodes);
  let mstResult: IteratorResult<AlgoResult, EdgeType[]>;
  do {
    mstResult = mstIterator.next();
    if (mstResult.done) {
      tree = mstResult.value;
    } else {
      yield mstResult.value;
    }
  } while (!mstResult.done);

  // finding odd degree nodes
  let oddDegreeNodes: Node[] = [];
  const oddDegreeNodesIterator = getOddDegreeNodes(tree);
  let oddDegreeNodesResult: IteratorResult<AlgoResult, Node[]>;
  do {
    oddDegreeNodesResult = oddDegreeNodesIterator.next();
    if (oddDegreeNodesResult.done) {
      oddDegreeNodes = oddDegreeNodesResult.value;
    } else {
      yield oddDegreeNodesResult.value;
    }
  } while (!oddDegreeNodesResult.done);

  // finding perfect matching
  let perfectMatching: EdgeType[] = [];
  const perfectMatchingIterator = perfectMatch(oddDegreeNodes);
  let perfectMatchingResult: IteratorResult<AlgoResult, EdgeType[]>;
  do {
    perfectMatchingResult = perfectMatchingIterator.next();
    if (perfectMatchingResult.done) {
      perfectMatching = perfectMatchingResult.value;
    } else {
      yield perfectMatchingResult.value;
    }
  } while (!perfectMatchingResult.done);

  // create multigraph
  const multigraph = [...tree, ...perfectMatching];
  yield {
    edges: edgesToRfEdges(multigraph, FINAL_COLOR),
    stage: 'Konstrukcja multigrafu',
    iterationsToAdd: 0,
  };

  // find eulerian circuit
  let eulerianCircuit: Node[] = [];
  const eulerianCircuitIterator = getEulerianCircuit(multigraph);
  let eulerianCircuitResult: IteratorResult<AlgoResult, Node[]>;
  do {
    eulerianCircuitResult = eulerianCircuitIterator.next();
    if (eulerianCircuitResult.done) {
      eulerianCircuit = eulerianCircuitResult.value;
    } else {
      yield eulerianCircuitResult.value;
    }
  } while (!eulerianCircuitResult.done);

  // construct hamiltonian path
  let hamiltonianPath: Node[] = [];
  const hamiltonianPathIterator = convertToHamiltonianPath(eulerianCircuit);
  let hamiltonianPathResult: IteratorResult<AlgoResult, Node[]>;
  do {
    hamiltonianPathResult = hamiltonianPathIterator.next();
    if (hamiltonianPathResult.done) {
      hamiltonianPath = hamiltonianPathResult.value;
    } else {
      yield hamiltonianPathResult.value;
    }
  } while (!hamiltonianPathResult.done);

  // final result
  const path = [...hamiltonianPath, hamiltonianPath[0]];
  const finalResult: AlgoResult = {
    edges: pathToEdges(path, FINAL_COLOR),
    iterationsToAdd: 0,
    minLength: pathDistance(path),
  };
  yield finalResult;
  return finalResult;
};
