/**
 * 퍼즐 알고리즘 선택 컴포넌트
 *
 * algorithm: 현재 선택된 알고리즘
 * changeAlgorithm: 알고리즘 변경 함수 ex) changeAlgorithm("아무거나")
 */
export default function PuzzleAlgorithmSelect({ algorithm, changeAlgorithm }) {
  const algorithms = [
    { label: "changeAlgorithm", value: "bfs" },
    { label: "changeAlgorithm", value: "dfs" },
    { label: "changeAlgorithm" },
    { label: "changeAlgorithm", value: "greedy" },
    { label: "changeAlgorithm", value: "random" },
  ];

  const handleAlgorithmChange = (event) => {
    changeAlgorithm(event.target.value);
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <label htmlFor="algorithm-select" style={{ marginRight: 10, fontSize: 16 }}>
        퍼즐 알고리즘 선택:
      </label>
      <select
        id="algorithm-select"
        value={algorithm}
        onChange={handleAlgorithmChange}
        style={{ padding: 5, fontSize: 16 }}
      >
        {algorithms.map((algo) => (
          <option key={algo.value} value={algo.value}>
            {algo.label}
          </option>
        ))}
      </select>
    </div>
  );
}
