import { Handle, Position } from "@xyflow/react";
import NPuzzle from "./NPuzzle";

/**
 * 퍼즐 노드를 렌더링합니다
 */
export default function GameBoardNode({ data }) {
  const { node, stack } = data;
  const { isSiblingOfCorrectRoute, correctRoute, children, parent } = node;

  return (
    <>
      {parent && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: "white",
          }}
        />
      )}
      <NPuzzle node={node} stack={stack} />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "white",
        }}
      />
      {/* {children.length !== 0 && (
      )} */}
    </>
  );
}
