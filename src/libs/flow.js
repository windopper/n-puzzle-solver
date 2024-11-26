import Dagre from "@dagrejs/dagre";

const createXYFlowNode = (node, stack) => {
  return {
    id: node.id,
    position: { x: node.depth * 220, y: 0 },
    type: "gameBoardNode",
    data: {
      node: node,
      stack: stack,
    },
  };
};

const createInitialXYFlowNode = (node) => {
  return {
    id: node.id,
    position: { x: 0, y: 0 },
    type: "gameBoardInitialNode",
    data: {
      node: node,
      stack: 0,
    },
  };
};

const createXYFlowEdge = (source, target) => {
  return {
    id: `${source.id}-${target.id}`,
    source: source.id,
    target: target.id,
    style: { strokeDasharray: "5, 5", strokeWidth: 3, stroke: "black" },
    type: "routeEdge",
    data: {
      route: target.direction,
    },
    animated: true,
  };
};

const createXYFlowSiblingEdge = (source, target) => {
  return {
    id: `${source.id}-${target.id}`,
    source: source.id,
    target: target.id,
    style: { strokeDasharray: "5, 5", strokeWidth: 1, stroke: "gray" },
    animated: true,
  };
};

/**
 * xyflow의 노드와 엣지를 생성합니다.
 *
 * @param {PuzzleState} rootNode
 * @param {number} depth
 * @param {number} stack 올바른 경로가 아닌 경우 증가하는 스택
 */
function createXYFlowNodesAndEdges(rootNode, depth = 0, stack = 0) {
  const currentId = rootNode.id;
  let nodes = [];
  nodes.push(createXYFlowNode(rootNode, stack));

  let edges = [];

  if (!rootNode.correctRoute && stack == 1) return [nodes, edges];

  for (let i = 0; i < rootNode.children.length; i++) {
    const next = rootNode.children[i];
    const nextId = next.id;
    const isSibling = next.isSiblingOfCorrectRoute;

    const [nextNodes, nextEdges] = createXYFlowNodesAndEdges(
      next,
      depth + 1,
      !rootNode.correctRoute ? stack + 1 : 0
    );

    nodes = [...nodes, ...nextNodes];
    edges = [
      ...edges,
      ...nextEdges,
      isSibling || !rootNode.correctRoute
        ? createXYFlowSiblingEdge(rootNode, next)
        : createXYFlowEdge(rootNode, next),
    ];
  }

  return [nodes, edges];
}

const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: 250,
      height: 250,
      // width: node.measured?.width ?? 0,
      // height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - 250 / 2;
      const y = position.y - 250 / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};


export { createXYFlowNodesAndEdges, getLayoutedElements, createInitialXYFlowNode, createXYFlowEdge, createXYFlowSiblingEdge };