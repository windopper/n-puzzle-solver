/**
 * 퍼즐을 렌더링합니다.
 *
 * puzzle
 */
export default function NPuzzle({ node }) {
  const { puzzle } = node;

  return (
    <div style={{ padding: 30 }}>
      <p style={{ width: "100%", textAlign: "center" }}>N Puzzle</p>
      <p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${puzzle[0].length}, 50px)`, gap: 5 }}>
        {puzzle.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
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
          ))
        )}
      </div>

      </p>
      <p>{puzzle}</p>
    </div>
  );
}
