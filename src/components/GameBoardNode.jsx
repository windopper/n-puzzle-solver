import { Handle, Position } from "@xyflow/react";
import NPuzzle from "./NPuzzle";

/**
 * 퍼즐 노드를 렌더링합니다
 */
export default function GameBoardNode({ node }) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <NPuzzle node={node} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}
