import React, { useCallback, useEffect, useState } from "react";
import Dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import GameBoardNode from "./components/GameBoardNode";
import Dashboard from "./components/dashboard/Dashboard";
import { PuzzleState, solve } from "./libs/algorithm";
import { createRandomNode } from "./libs/util";

const nodeTypes = {
  gameBoardNode: ({ data }) => {
    return <GameBoardNode {...data} />;
  },
};

const createXYFlowNode = (node) => {
  return {
    id: node.id,
    position: { x: 0, y: 0 },
    type: "gameBoardNode",
    data: {
      node: node,
    },
  };
};

const createXYFlowEdge = (source, target) => {
  return {
    id: `${source.id}-${target.id}`,
    source: source.id,
    target: target.id,
    style: { strokeDasharray: "5, 5" },
    animated: true,
  };
};

/**
 * xyflow의 노드와 엣지를 생성합니다.
 *
 * @param {PuzzleState} rootNode
 */
function createXYFlowNodesAndEdges(rootNode, depth = 0, peer = 0) {
  const currentId = rootNode.id;
  let nodes = [];
  nodes.push(createXYFlowNode(rootNode));

  let edges = [];

  for (let i = 0; i < rootNode.children.length; i++) {
    const next = rootNode.children[i];
    const nextId = next.id;
    const [nextNodes, nextEdges] = createXYFlowNodesAndEdges(
      next,
      depth + 1,
      i
    );
    nodes = [...nodes, ...nextNodes];
    edges = [
      ...edges,
      ...nextEdges,
      createXYFlowEdge({ id: currentId }, { id: nextId }),
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
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

function App() {
  const { fitView } = useReactFlow();
  const [options, setOptions] = useState({
    size: 3, // 퍼즐 사이즈
    algorithm: "", // 선택된 휴리스틱 알고리즘
    simulationState: "stop", // 시뮬레이션 상태 (stop, play, pause)
  });

  const [rootNode, setRootNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 연결 버튼 클릭 시 호출되는 함수
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 레이아웃 버튼 클릭 시 호출되는 함수
  const onLayout = useCallback(
    (direction) => {
      console.log(nodes);
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  // 초기화 버튼 클릭 시 호출되는 함수
  const onInitialize = useCallback(() => {
    const rootNode = createRandomNode(options.size);
    setRootNode(rootNode);
    setNodes([createXYFlowNode(rootNode)]);
    setEdges([]);
  }, []);

  // 퍼즐 풀기 버튼 클릭 시 호출되는 함수
  const onSolve = useCallback(() => {
    const result = solve(rootNode);
    const [nextNodes, nextEdges] = createXYFlowNodesAndEdges(rootNode);
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [rootNode]);

  // 초기 노드 생성
  useEffect(() => {
    const rootNode = createRandomNode(options.size);
    const [initialNodes, initialEdges] = createXYFlowNodesAndEdges(rootNode);
    setRootNode(rootNode);
    setNodes(initialNodes);
    setEdges(initialEdges);

    window.addEventListener("keydown", (event) => {
      // 방향키 콘솔
      if (event.key === "ArrowUp") {
        console.log("up");
      } else if (event.key === "ArrowDown") {
        console.log("down");
      } else if (event.key === "ArrowLeft") {
        console.log("left");
      } else if (event.key === "ArrowRight") {
        console.log("right");
      }
    });

    return () => {
      window.removeEventListener("keydown", (event) => {
        // 방향키 콘솔
        if (event.key === "ArrowUp") {
          console.log("up");
        } else if (event.key === "ArrowDown") {
          console.log("down");
        } else if (event.key === "ArrowLeft") {
          console.log("left");
        } else if (event.key === "ArrowRight") {
          console.log("right");
        }
      });
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => console.log("click", node)}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        maxZoom={1.5}
      >
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-right">
          <button onClick={() => onLayout("LR")}>정렬하기</button>
        </Panel>
        <MiniMap position="top-left" />
      </ReactFlow>
      <Dashboard
        options={options}
        setOptions={setOptions}
        setRootNode={setRootNode}
        onInitialize={onInitialize}
      />
    </div>
  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
