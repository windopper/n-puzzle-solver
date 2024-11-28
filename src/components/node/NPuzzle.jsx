import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import useMoveTile from "../../hooks/useMoveTile";

const style = {
  grid: (size) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${size}, 50px)`,
    gridTemplateRows: `repeat(${size}, 50px)`,
    gap: 5,
  }),
  correctRouteNode: (tile) => {
    return {
      position: "absolute",
      width: 50,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      backgroundColor: tile === 0 ? "#f8f9fa" : "#007bff",
      boxShadow: "0 0.5px 15px 0 rgb(0, 0, 0, 0.2)",
      color: tile === 0 ? "transparent" : "#fff",
      fontSize: 18,
      fontWeight: "bold",
    };
  },
  siblingNode: (tile, opacity) => {
    return {
      width: 50,
      height: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      backgroundColor: tile === 0 ? "#f8f9fa" : "#6B7280",
      boxShadow: "0 0.5px 15px 0 rgb(0, 0, 0, 0.2)",
      color: tile === 0 ? "transparent" : "#fff",
      fontSize: 18,
      fontWeight: "bold",
      opacity: opacity,
    };
  },
};

/**
 * 퍼즐을 렌더링합니다.
 *
 * puzzle
 */
export default function NPuzzle({ node, stack, canMoveTile = false }) {
  const { handleMoveTile } = useMoveTile(node);
  const { puzzle, correctRoute, isSiblingOfCorrectRoute, parent } = node;
  const isRootNode = !parent;
  const ref = useRef(null);

  return (
    <div style={{ padding: 5 }}>
      <div style={style.grid(puzzle.length)} ref={ref}>
        <AnimatePresence>
          {puzzle.map((row, rowIndex) =>
            row.map((tile, colIndex) =>
              correctRoute || isRootNode ? (
                <CorrectRouteNode
                  key={tile}
                  tile={tile}
                  row={rowIndex}
                  col={colIndex}
                  handleMoveTile={handleMoveTile}
                  canMoveTile={canMoveTile}
                />
              ) : (
                <SiblingNode key={tile} tile={tile} stack={stack} />
              )
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CorrectRouteNode({
  tile,
  row,
  col,
  handleMoveTile,
  canMoveTile,
}) {
  return (
    <motion.div
      initial={{
        position: "absolute",
        top: row * 55 + 5,
        left: col * 55 + 5,
        width: 50,
        height: 50,
        ...style.correctRouteNode(tile),
      }}
      animate={{
        position: "absolute",
        top: row * 55 + 5,
        left: col * 55 + 5,
        ...style.correctRouteNode(tile),
      }}
      exit={{ opacity: 0 }}
      // 드래그 시에는 퍼즐을 이동할 수 있도록 설정
      draggable={canMoveTile}
      onDragStart={(event) => {
        event.dataTransfer.setData("tileLocation", `${row}-${col}`);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        const draggedTile = event.dataTransfer.getData("tileLocation");
        const [tile1Y, tile1X] = draggedTile.split("-");
        handleMoveTile(tile1X, tile1Y, col, row);
      }}
      onMouseEnter={(event) => {
        if (!canMoveTile) return;
        event.target.style.opacity = 0.9;
      }}
      onMouseLeave={(event) => {
        if (!canMoveTile) return;
        event.target.style.opacity = 1;
      }}
    >
      {tile !== 0 ? tile : ""}
    </motion.div>
  );
}

function SiblingNode({ tile, stack }) {
  let opacity = 0.7;
  if (stack == 1) {
    opacity = 0.5;
  } else if (stack == 2) {
    opacity = 0.1;
  }

  return (
    <motion.div
      initial={style.siblingNode(tile, opacity)}
      animate={style.siblingNode(tile, opacity)}
      exit={{ opacity: 0 }}
    >
      {tile !== 0 ? tile : ""}
    </motion.div>
  );
}
