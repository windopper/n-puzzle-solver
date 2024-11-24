import { Handle, Position } from "@xyflow/react";
import NPuzzle from "./NPuzzle";

/**
 * 퍼즐 노드를 렌더링합니다
 */
export default function GameBoardNode({ node }) {
  const { isSiblingOfCorrectRoute, correctRoute, children, parent } = node;

  return (
    <>
      {parent && <Handle type="target" position={Position.Left} />}
      <NPuzzle node={node} />
      {children.length !== 0 && (
        <Handle type="source" position={Position.Right} />
      )}
    </>
  );
}
