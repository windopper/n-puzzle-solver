import { Handle, Position } from "@xyflow/react";
import NPuzzle from "./NPuzzle";
import React from "react";

/**
 * 퍼즐 노드를 렌더링합니다
 */
function GameBoardNode({ data, canMoveTile = false }) {
  const { node, stack } = data;
  const { isSiblingOfCorrectRoute, correctRoute, children, parent } = node;

  return (
    <>
      {parent && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: "transparent",
            border: 0,
          }}
        />
      )}
      <NPuzzle node={node} stack={stack} canMoveTile={canMoveTile} />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "transparent",
          border: 0,
        }}
      />
    </>
  );
}

export default React.memo(GameBoardNode);