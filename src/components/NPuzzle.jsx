/**
 * 퍼즐을 렌더링합니다.
 *
 * puzzle
 */
export default function NPuzzle({ node, stack }) {
  const { puzzle, correctRoute, isSiblingOfCorrectRoute, parent } = node;
  const isRootNode = !parent;

  return (
    <div style={{ padding: 5 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${puzzle[0].length}, 50px)`,
          gap: 5,
        }}
      >
        {puzzle.map((row, rowIndex) =>
          row.map((tile, colIndex) =>
            correctRoute || isRootNode ? (
              <CorrectRouteNode key={`${rowIndex}-${colIndex}`} tile={tile} />
            ) : (
              <SiblingNode
                key={`${rowIndex}-${colIndex}`}
                tile={tile}
                stack={stack}
              />
            )
          )
        )}
      </div>
    </div>
  );
}

function CorrectRouteNode({ tile }) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        backgroundColor: tile === 0 ? "#f8f9fa" : "#007bff",
        color: tile === 0 ? "transparent" : "#fff",
        fontSize: 18,
        fontWeight: "bold",
      }}
    >
      {tile !== 0 ? tile : ""}
    </div>
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
    <div
      style={{
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        backgroundColor: tile === 0 ? "#f8f9fa" : "#6B7280",
        color: tile === 0 ? "transparent" : "#fff",
        fontSize: 18,
        fontWeight: "bold",
        opacity,
      }}
    >
      {tile !== 0 ? tile : ""}
    </div>
  );
}
