import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { getLayoutedElements } from "../libs/flow";

/**
 * 레이아웃을 계산하는 훅
 * @param {Array} nodes - 노드 목록
 * @param {Array} edges - 엣지 목록
 * @param {Function} setNodes - 노드 목록 업데이트 함수
 * @param {Function} setEdges - 엣지 목록 업데이트 함수
 * @returns {{
 *  onLayout: Function,
 *  onLayoutSpecificNode: Function,
 *  layoutUpdateRequired: boolean,
 *  setLayoutUpdateRequired: Function
 * }} - 레이아웃 계산 함수
 */
export default function useLayout(nodes, edges, setNodes, setEdges) {
  const { fitView } = useReactFlow();
  const [layoutUpdateRequired, setLayoutUpdateRequired] = useState(false);

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

        setTimeout(() => {
          window.requestAnimationFrame(() => {
            fitView();
          });
        }, 200);

        console.log("레이아웃 계산 완료");
      } catch (error) {
        console.error("레이아웃 계산 실패", error);
      }
    },
    [nodes, edges, fitView]
  );

  // 특정 노드에 포커스를 맞추는 함수
  const onLayoutSpecificNode = useCallback(
    (nodes) => {
      window.requestAnimationFrame(() => {
        fitView({ nodes, minZoom: 0.1, duration: 400, padding: 0.1 });
      });
    },
    [fitView]
  );

  // 레이아웃 업데이트가 필요한 경우 레이아웃 업데이트
  useLayoutEffect(() => {
    if (layoutUpdateRequired) {
      console.log("레이아웃 업데이트 시작");
      onLayout("LR");
      setLayoutUpdateRequired(false);
    }
  }, [onLayout, layoutUpdateRequired, setLayoutUpdateRequired]);

  useEffect(() => {
    // 브라우저 사이즈 변경 시 레이아웃 업데이트
    const handleResize = () => {
      setLayoutUpdateRequired(true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    onLayout,
    onLayoutSpecificNode,
    layoutUpdateRequired,
    setLayoutUpdateRequired,
  };
}
