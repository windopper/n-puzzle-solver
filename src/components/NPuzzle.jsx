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
      <p>퍼즐 표시 하는 기능 만들어주세요</p>
      <p>{puzzle}</p>
    </div>
  );
}
