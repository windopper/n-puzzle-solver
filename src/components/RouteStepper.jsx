import { minor, Stack } from "@mui/material";
import React, { useEffect, useRef } from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa";

const styles = {
  wrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#F9FAFB",
    minWidth: "400px",
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
    position: "relative",
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

export default function RouteStepper({ rootNode, solveState, onFocus }) {
  const previousRootNode = useRef(null);
  const [currentBreadcrumbIndex, setCurrentBreadcrumbIndex] = React.useState(0);
  const [breadcrumbs, setBreadcrumbs] = React.useState([]);
  const directionMap = {
    up: <FaArrowUp />,
    down: <FaArrowDown />,
    left: <FaArrowLeft />,
    right: <FaArrowRight />,
  };
  let current = rootNode;

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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      if (currentBreadcrumbIndex < breadcrumbs.length - 1) {
        breadcrumbs[currentBreadcrumbIndex + 1].focus();
        setCurrentBreadcrumbIndex(currentBreadcrumbIndex + 1);
        // scorll into view
        const breadcrumb = document.querySelector(
          `.breadcrumb-${currentBreadcrumbIndex + 1}`
        );
        breadcrumb?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    } else if (e.key === "ArrowLeft") {
      if (currentBreadcrumbIndex > 0) {
        breadcrumbs[currentBreadcrumbIndex - 1].focus();
        setCurrentBreadcrumbIndex(currentBreadcrumbIndex - 1);
        const breadcrumb = document.querySelector(
          `.breadcrumb-${currentBreadcrumbIndex - 1}`
        );
        breadcrumb?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (solveState === "solving" || breadcrumbs.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div>퍼즐 해결 경로</div>
      <div style={styles.container}>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                ...styles.directionBox,
                backgroundColor:
                  index === currentBreadcrumbIndex ? "#2563EB" : "#EBF5FF",
                color: index === currentBreadcrumbIndex ? "#EBF5FF" : "#2563EB",
              }}
              className={`breadcrumb-${index}`}
              onClick={() => {
                breadcrumb.focus();
                setCurrentBreadcrumbIndex(index);
              }}
            >
              {breadcrumb.direction}
              {(index + 1) % 5 === 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    fontWeight: "lighter",
                    color: "#A9A9A9",
                  }}
                >
                  {index + 1}
                </div>
              )}
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
