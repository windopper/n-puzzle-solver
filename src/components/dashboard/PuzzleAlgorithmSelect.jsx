import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

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
    { label: "changeAlgorithm", value: "astar" },
    { label: "changeAlgorithm", value: "greedy" },
    { label: "changeAlgorithm", value: "random" },
  ];

  const handleAlgorithmChange = (value) => {
    changeAlgorithm(value);
  };

  return (
    <Box
      sx={{
        gap: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {algorithms.map((algo) => (
        <Chip
          key={algo.value}
          onClick={() => handleAlgorithmChange(algo.value)}
          label={algo.value}
          variant={algorithm === algo.value ? "filled" : "outlined"}
          color="primary"
        />
      ))}
    </Box>
  );
}
