import React, {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import Dashboard from "./components/dashboard/Dashboard";
import {
  backTrackCorrectRouteAndSibling,
  isSolvable,
  SolveState,
  PuzzleState,
  solve,
} from "./libs/algorithm";
import { generateNewPuzzle } from "./libs/puzzle";
import RouteStepper from "./components/RouteStepper";
import RouteEdge from "./components/edge/RouteEdge";
import GameBoardInitialNode from "./components/node/GameBoardInitialNode";
import {
  createInitialXYFlowNode,
  createXYFlowNodesAndEdges,
} from "./libs/flow";
import GameBoardNodeWithTool from "./components/node/GameBoardNodeWithTool";
import WarningUnsolvablePuzzle from "./components/WarningUnsolvablePuzzle";
import useLayout from "./hooks/useLayout";

const nodeTypes = {
  gameBoardNode: GameBoardNodeWithTool,
  gameBoardInitialNode: GameBoardInitialNode,
};

const edgeTypes = {
  routeEdge: RouteEdge,
};

export const AppContext = createContext(null);

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

  const [history, setHistory] = useState([]);

  // idle | solving | solved
  // idle 퍼즐 풀이 대기 중
  // solving 퍼즐 풀이 중
  // solved 문제를 해결 한 후 레이아웃 업데이트
  const [solveState, setSolveState] = useState("idle");

  // 중간 결과
  const [intermediateResults, setIntermediateResults] = useState({});

  // 레이아웃 업데이트가 필요한지 여부
  const {
    layoutUpdateRequired,
    onLayout,
    onLayoutSpecificNode,
    setLayoutUpdateRequired,
  } = useLayout(nodes, edges, setNodes, setEdges );

  // 초기화 버튼 클릭 시 호출되는 함수
  const onInitialize = useCallback(
    (puzzle = null) => {
      setOptions((prev) => ({ ...prev, simulationState: "stop" }));

      const initialPuzzle = puzzle || generateNewPuzzle(options.size);

      let rootNode = new PuzzleState(initialPuzzle, null);
      while (!isSolvable(rootNode.puzzle, options.size)) {
        rootNode = new PuzzleState(generateNewPuzzle(options.size), null);
      }
      rootNode.id = "root";
      setRootNode(rootNode);
      setNodes([createInitialXYFlowNode(rootNode)]);
      setEdges([]);
      setSolveState("idle");
      setIntermediateResults({});
      setTimeout(() => {
        fitView();
      }, 200);
    },
    [
      options,
      setEdges,
      setNodes,
      setSolveState,
      setIntermediateResults,
      fitView,
    ]
  );

  // 퍼즐 풀기 버튼 클릭 시 호출되는 함수
  const onSolve = useCallback(async () => {
    setSolveState("solving");
    try {
      const solver = solve(rootNode, options.algorithm);
      let result;

      while (true) {
        const { done, value } = await solver.next();
        setIntermediateResults(value);
        if (done) {
          result = value;
          break;
        }
      }

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
      const newOptions = { ...options, simulationState: "stop" };
      setOptions(newOptions);
      addHistory(nextNodes, nextEdges, result, newOptions, rootNode, "solved");
      setLayoutUpdateRequired(true);

      return result;
    } catch (error) {
      console.error("해결 실패: ", error);
      setSolveState("idle");
      setOptions((prev) => ({ ...prev, simulationState: "stop" }));
    }
  }, [rootNode, setEdges, setNodes, options]);

  const addHistory = useCallback(
    (nodes, edges, intermediateResults, options, rootNode, solveState) => {
      const hist = {
        solveState: solveState,
        nodes: [...nodes],
        edges: [...edges],
        result: intermediateResults,
        options: { ...options },
        rootNode: rootNode,
      };

      setHistory((prev) => [...prev, hist]);
    },
    [setHistory]
  );

  const applyHistory = useCallback(
    (index) => {
      const hist = history[index];

      const clonedNodes = hist.nodes.map((node) => ({
        ...node,
        data: { ...node.data },
        position: { ...node.position },
      }));

      const clonedEdges = hist.edges.map((edge) => ({
        ...edge,
        data: { ...edge.data },
      }));

      setSolveState(hist.solveState);
      setNodes(clonedNodes);
      setEdges(clonedEdges);
      setIntermediateResults(hist.result);
      setOptions(hist.options);
      setRootNode(hist.rootNode);
      setLayoutUpdateRequired(true);
    },
    [
      setNodes,
      setEdges,
      setIntermediateResults,
      setOptions,
      setRootNode,
      setLayoutUpdateRequired,
      setSolveState,
      history,
    ]
  );

  // 시뮬레이션 상태 변경에 따른 처리
  useEffect(() => {
    const handleAsync = async () => {
      if (options.simulationState === "play") {
        SolveState.isPaused = false;
        SolveState.isStopped = false;
        if (solveState === "idle") {
          await onSolve();
        }
      } else if (options.simulationState === "pause") {
        SolveState.isPaused = true;
        SolveState.isStopped = false;
      } else if (options.simulationState === "stop") {
        SolveState.isStopped = true;
        SolveState.isPaused = false;
      }
    };

    handleAsync();
  }, [options.simulationState, solveState]);

  // 초기 노드 생성
  useLayoutEffect(() => {
    onInitialize();
  }, []);

  return (
    <AppContext.Provider
      value={{
        rootNode,
        setRootNode,
        options,
        setOptions,
        onLayout,
        onInitialize,
        onLayoutSpecificNode,
        solveState,
        intermediateResults,
        history,
        applyHistory,
      }}
    >
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(event, node) => console.log("click", node)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          nodesDraggable={false}
          onlyRenderVisibleElements
          // solveState가 idle 상태가 아닐 때는 드래그 금지
          panOnDrag={solveState !== "idle"}
          zoomOnScroll={solveState !== "idle"}
          maxZoom={1.5}
          minZoom={0.01}
        >
          <Background variant="dots" gap={12} size={1} />
          <Panel position="top-center">
            <WarningUnsolvablePuzzle />
          </Panel>
          <Panel position="top-right">
            <Dashboard />
          </Panel>
          <Panel position="bottom-center">
            <RouteStepper
              rootNode={rootNode}
              solveState={solveState}
              onFocus={onLayoutSpecificNode}
            />
          </Panel>
          <MiniMap position="top-left" />
        </ReactFlow>
      </div>
    </AppContext.Provider>
  );
}

export default function () {
  return (
    <>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </>
  );
}
