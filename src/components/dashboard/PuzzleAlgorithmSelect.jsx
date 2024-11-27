import { Button } from "@mui/joy";
import { style } from "./Dashboard";

/**
 * 퍼즐 알고리즘 선택 컴포넌트
 *
 * algorithm: 현재 선택된 알고리즘
 * changeAlgorithm: 알고리즘 변경 함수 ex) changeAlgorithm("아무거나")
 */
export default function PuzzleAlgorithmSelect({ algorithm, changeAlgorithm }) {
  const algorithms = [
    { label: "changeAlgorithm", value: "bfs" },
    // { label: "changeAlgorithm", value: "dfs" },
    { label: "changeAlgorithm", value: "astar" },
    // { label: "changeAlgorithm", value: "astarclosedset" },
    { label: "changeAlgorithm", value: "greedy" },
    // { label: "changeAlgorithm", value: "random" },
  ];

  const handleAlgorithmChange = (value) => {
    console.log(value);
    changeAlgorithm(value);
  };

  return (
    <div style={style.dashboardMenuItem}>
      <div style={style.dashboardMenuItemTitle}>알고리즘 선택</div>
      <div style={style.dashboardMenuItemContent}>
        {algorithms.map((al) => (
          <Button
            key={al.value}
            variant="soft"
            color="neutral"
            sx={{
              fontSize: "12px",
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor:
                al.value === algorithm
                  ? "rgba(0, 123, 255, 0.1)"
                  : "transparent",
            }}
            onClick={() => handleAlgorithmChange(al.value)}
          >
            {al.value.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
