import { minor, Stack } from "@mui/material";
import React, { useEffect, useRef } from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa";

export default function RouteStepper({ rootNode, solveState, onFocus }) {
  const previousRootNode = useRef(null);
  const [breadcrumbs, setBreadcrumbs] = React.useState([]);
  const directionMap = {
    up: <FaArrowUp />,
    down: <FaArrowDown />,
    left: <FaArrowLeft />,
    right: <FaArrowRight />,
  };
  let current = rootNode;

  const styles = {
    wrapper: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#F9FAFB",
      minWidth: "70vw",
      maxWidth: "70vw",
      overflow: "hidden",
      margin: "auto",
      paddingTop: "8px",
    },
    container: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "16px",
      borderRadius: "8px",
      overflowX: "scroll",
      overflowY: "hidden",
      margin: "auto",
      minWidth: "95%",
      maxWidth: "95%",
      scrollbarWidth: "none",
    },
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontSize: "18px",
      color: "#4B5563",
    },
    directionBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      backgroundColor: "#EBF5FF",
      borderRadius: "50%",
      color: "#2563EB",
      fontWeight: "800",
      fontSize: "20px",
      flexShrink: "0",
      cursor: "pointer",
    },
    separator: {
      color: "#9CA3AF",
      fontWeight: "500",
    },
  };

  useEffect(() => {
    if (previousRootNode.current !== rootNode) {
      previousRootNode.current = rootNode;
      setBreadcrumbs([]);
    }

    if (solveState === "solved") {
      const breadcrumbs = [];
      while (current) {
        const currentId = current.id;
        if (current.children.length === 0) {
          break;
        }

        for (const next of current.children) {
          if (next && next.correctRoute) {
            const nextId = next.id;
            breadcrumbs.push({
              direction: directionMap[next.direction],
              prevId: currentId,
              nextId: nextId,
              focus: () => onFocus([{ id: currentId }, { id: nextId }]),
            });
            current = next;
            break;
          }
        }
      }
      setBreadcrumbs(breadcrumbs);
    }
  }, [rootNode, solveState]);

  if (solveState === "solving" || breadcrumbs.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div>퍼즐 해결 경로</div>
      <div style={styles.container}>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <div style={styles.directionBox} onClick={() => breadcrumb.focus()}>
              {breadcrumb.direction}
            </div>
            {index < breadcrumbs.length - 1 && (
              <div style={styles.separator}>›</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
