import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa";

export default function RouteEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}) {
  const { route } = data;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            background: "linear-gradient(to right, #006FEE, #4C9EFF)",
            color: "white",
            padding: "4px 6px",
            aspectRatio: "1",
            borderRadius: "100px",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            cursor: "default",
            pointerEvents: "all",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            transition: "all 0.2s ease",
            userSelect: "none",
          }}
        >
          {route === "up" && <FaArrowUp size={20} />}
          {route === "down" && <FaArrowDown size={20} />}
          {route === "right" && <FaArrowRight size={20} />}
          {route === "left" && <FaArrowLeft size={20} />}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
