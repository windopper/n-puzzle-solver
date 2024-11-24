import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import {
  backTrackCorrectRouteAndSibling,
  isPaused,
  isSolvable,
  SolveState,
  PuzzleState,
  solve,
} from "./libs/algorithm";
import { createRandomNode } from "./libs/util";
import { generateNewPuzzle } from "./libs/puzzle";

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
    style: { strokeDasharray: "5, 5", strokeWidth: 1, stroke: "black" },
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
 */
function createXYFlowNodesAndEdges(rootNode, depth = 0, peer = 0) {
  const currentId = rootNode.id;
  let nodes = [];
  nodes.push(createXYFlowNode(rootNode));

  let edges = [];

  if (!rootNode.correctRoute) return [nodes, edges];

  for (let i = 0; i < rootNode.children.length; i++) {
    const next = rootNode.children[i];
    const nextId = next.id;
    const isSibling = next.isSiblingOfCorrectRoute;

    const [nextNodes, nextEdges] = createXYFlowNodesAndEdges(
      next,
      depth + 1,
      i
    );

    nodes = [...nodes, ...nextNodes];
    edges = [
      ...edges,
      ...nextEdges,
      isSibling
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
    algorithm: "bfs", // 선택된 휴리스틱 알고리즘
    simulationState: "stop", // 시뮬레이션 상태 (stop, play, pause)
  });

  const [rootNode, setRootNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // idle | solving | solved
  // idle 퍼즐 풀이 대기 중
  // solving 퍼즐 풀이 중
  // solved 문제를 해결 한 후 레이아웃 업데이트
  const [solveState, setSolveState] = useState("idle");

  // 레이아웃 업데이트가 필요한지 여부
  const layoutUpdateRequired = useRef(false);

  // 연결 버튼 클릭 시 호출되는 함수
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 정렬 버튼 클릭 시 호출되는 함수
  const onLayout = useCallback(
    (direction) => {
      if (!nodes.length) {
        console.log("레이아웃 계산을 위한 노드가 없습니다.");
        return;
      }

      try {
        console.log("노드 레이아웃 계산 시작", nodes.length);
        const layouted = getLayoutedElements(nodes, edges, { direction });

        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);

        // Use RAF for smoother layout transition
        window.requestAnimationFrame(() => {
          fitView();
        });

        console.log("레이아웃 계산 완료");
      } catch (error) {
        console.error("레이아웃 계산 실패", error);
      }
    },
    [nodes, edges, fitView]
  );

  // 초기화 버튼 클릭 시 호출되는 함수
  const onInitialize = useCallback(() => {
    setOptions((prev) => ({ ...prev, simulationState: "stop" }));
    let rootNode = new PuzzleState(generateNewPuzzle(options.size), null);
    while (!isSolvable(rootNode.puzzle, options.size)) {
      rootNode = new PuzzleState(generateNewPuzzle(options.size), null);
    }
    setRootNode(rootNode);
    setNodes([createXYFlowNode(rootNode)]);
    setEdges([]);
    setSolveState("idle");
    fitView();
  }, [options, setEdges, setNodes]);

  // 퍼즐 풀기 버튼 클릭 시 호출되는 함수
  const onSolve = useCallback(async () => {
    setSolveState("solving");
    try {
      const result = await solve(rootNode, options.algorithm);

      if (result.least_attempts === -1) {
        console.log("해결 불가능한 퍼즐입니다.");
        setSolveState("idle");
        setOptions((prev) => ({ ...prev, simulationState: "stop" }));
        return;
      }

      backTrackCorrectRouteAndSibling(result.last_node);
      const [nextNodes, nextEdges] = createXYFlowNodesAndEdges(rootNode);

      setNodes(nextNodes);
      setEdges(nextEdges);
      setSolveState("solved");
      setOptions((prev) => ({ ...prev, simulationState: "stop" }));

      layoutUpdateRequired.current = true;

      return result;
    } catch (error) {
      console.error("해결 실패: ", error);
      setSolveState("idle");
      setOptions((prev) => ({ ...prev, simulationState: "stop" }));
    }
  }, [rootNode, setEdges, setNodes, options]);

  // 초기 노드 생성
  useEffect(() => {
    onInitialize();
  }, []);

  // 시뮬레이션 상태 변경에 따른 처리
  useEffect(() => {
    const handleAsync = async () => {
      if (options.simulationState === "play") {
        SolveState.isPaused = false;
        if (solveState === "idle") {
          const result = await onSolve();
          console.log(result);
        }
      } else if (options.simulationState === "pause") {
        SolveState.isPaused = true;
      } else if (options.simulationState === "stop") {
        SolveState.isStopped = true;
        SolveState.isPaused = false;
      }
    };

    handleAsync();
  }, [options.simulationState, solveState]);

  // 레이아웃 업데이트가 필요한 경우 레이아웃 업데이트
  useEffect(() => {
    if (solveState === "solved" && layoutUpdateRequired.current) {
      // 렌더링이 완료된 후 150ms 후에 레이아웃 업데이트
      const timer = setTimeout(() => {
        console.log("레이아웃 업데이트 시작");
        onLayout("LR");
        setSolveState("idle");
        layoutUpdateRequired.current = false;

        // 왜 두번 호출해야 하는지 모르겠지만, 한번만 호출하면 레이아웃이 업데이트 되지 않음
        setTimeout(() => {
          onLayout("LR");
        }, 200);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [solveState, onLayout]);

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
        minZoom={0.1}
      >
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-right">
          <button
            onClick={() => onLayout("LR")}
            disabled={solveState === "solving"}
          >
            정렬하기
          </button>
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
