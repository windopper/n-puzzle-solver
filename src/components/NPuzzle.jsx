/**
 * 퍼즐을 렌더링합니다.
 *
 * puzzle
 */
export default function NPuzzle({ node }) {
  const { puzzle, correctRoute, isSiblingOfCorrectRoute, parent } = node;
  const isRootNode = !parent;

  return (
    <div style={{ padding: 30 }}>
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
              <SiblingNode key={`${rowIndex}-${colIndex}`} tile={tile} />
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

function SiblingNode({ tile }) {
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
      }}
    >
      {tile !== 0 ? tile : ""}
    </div>
  );
}
