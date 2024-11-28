import { move } from "../../libs/puzzle";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa";
import GameBoardNode from "./GameBoardNode";
import { useReactFlow } from "@xyflow/react";
import { useContext, useEffect } from "react";
import { AppContext } from "../../App";
import useMoveTile from "../../hooks/useMoveTile";

export default function GameBoardInitialNode(param) {
  const { rootNode } = useContext(AppContext);
  const { data } = param;
  const { node } = data;
  const { handleMoveTileDirection } = useMoveTile(node);

  const canControl = rootNode.children.length === 0;

  const handleKeyDown = (e) => {
    if (!canControl) return;
    if (e.key === "ArrowUp") handleMoveTileDirection("up");
    if (e.key === "ArrowDown") handleMoveTileDirection("down");
    if (e.key === "ArrowLeft") handleMoveTileDirection("left");
    if (e.key === "ArrowRight") handleMoveTileDirection("right");
  };

  useEffect(() => {
    if (!canControl) return;
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [node, canControl]);

  return (
    <>
      <div style={{ position: "relative", margin: 5 }}>
        {canControl && (
          <Arrow direction="up" onClick={() => handleMoveTileDirection("up")} />
        )}
        {canControl && (
          <Arrow direction="down" onClick={() => handleMoveTileDirection("down")} />
        )}
        {canControl && (
          <Arrow direction="left" onClick={() => handleMoveTileDirection("left")} />
        )}
        {canControl && (
          <Arrow direction="right" onClick={() => handleMoveTileDirection("right")} />
        )}
        <GameBoardNode canMoveTile {...param} />
      </div>
    </>
  );
}

function Arrow({ direction, onClick }) {
  const styles = {
    wrapper: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    arrow: {
      borderRadius: "25px",
      padding: "6px 6px",
      background: "#f8f8f8",
      boxShadow: "0 0.1px 15px 0 rgb(0, 0, 0, 0.4)",
      color: "black",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  if (direction === "up") {
    styles.wrapper.top = "-30px";
    styles.wrapper.width = "100%";
  } else if (direction === "down") {
    styles.wrapper.bottom = "-30px";
    styles.wrapper.width = "100%";
  } else if (direction === "left") {
    styles.wrapper.left = "-30px";
    styles.wrapper.height = "100%";
    styles.wrapper.flexDirection = "column";
  } else if (direction === "right") {
    styles.wrapper.right = "-30px";
    styles.wrapper.height = "100%";
    styles.wrapper.flexDirection = "column";
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.arrow} onClick={onClick}>
        {direction === "up" && <FaArrowUp />}
        {direction === "down" && <FaArrowDown />}
        {direction === "left" && <FaArrowLeft />}
        {direction === "right" && <FaArrowRight />}
      </div>
    </div>
  );
}
