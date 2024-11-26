import { useCallback, useContext, useEffect } from "react";
import InitializePuzzleButton from "./InitializePuzzleButton";
import PuzzleSizeSelect from "./PuzzleSizeSelect";
import { PuzzleState } from "../../libs/algorithm";
import { generateNewPuzzle } from "../../libs/puzzle";
import PuzzleAlgorithmSelect from "./PuzzleAlgorithmSelect";
import PuzzleSimulationControl from "./PuzzleSimulationControl";
import { Box, Button, Card, Divider, Grid2, Paper } from "@mui/material";
import IntermediateResultIndicator from "./IntermediateResultIndicator";
import { AppContext } from "../../App";
import Advanced from "./Advanced";
import History from "./History";

/**
 * 대시보드 컴포넌트
 */
export default function Dashboard({ children }) {
  const {
    rootNode,
    solveState,
    onLayout,
    options,
    setOptions,
    onInitialize,
    intermediateResults,
    history,
    applyHistory,
  } = useContext(AppContext);

  const { size, algorithm, simulationState } = options;

  let status;
  let statusBackgroundColor = "white";
  if (simulationState === "play") {
    status = "Solving...";
    statusBackgroundColor = "#00cc00";
  } else if (simulationState === "pause") {
    status = "Paused";
    statusBackgroundColor = "#ffcc00";
  } else {
    status = "Stopped";
    statusBackgroundColor = "white";
  }

  const changeSize = useCallback(
    (newSize) => {
      setOptions((prev) => ({ ...prev, size: newSize }));
    },
    [setOptions]
  );

  const changeAlgorithm = useCallback(
    (newAlgorithm) => {
      setOptions((prev) => ({ ...prev, algorithm: newAlgorithm }));
    },
    [setOptions]
  );

  const changeSimulationState = useCallback(
    (newSimulationState) => {
      if (newSimulationState === "stop") {
        onInitialize(rootNode.puzzle)
      }

      setOptions((prev) => ({ ...prev, simulationState: newSimulationState }));
    },
    [setOptions]
  );

  const handleKeyDown = useCallback((e) => {
    // 스페이스로 시뮬레이션 제어
    if (e.key === " ") {
      changeSimulationState(
        simulationState === "play" ? "pause" : "play"
      );
    }
  }, [changeSimulationState, simulationState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Paper
      elevation={1}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10,
        gap: 10,
      }}
    >
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        display="flex"
        width={"100%"}
      >
        <Box
          width={"100%"}
          sx={{
            fontWeight: 700,
            fontSize: "32px",
            backgroundColor: statusBackgroundColor,
          }}
          padding={3}
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          {status}
        </Box>
      </Grid2>
      <Grid2 container spacing={2} paddingX={2}>
        {/* <PuzzleSizeSelect size={size} changeSize={changeSize} /> */}
        <PuzzleAlgorithmSelect
          algorithm={algorithm}
          changeAlgorithm={changeAlgorithm}
        />
      </Grid2>
      <IntermediateResultIndicator intermediateResults={intermediateResults} />
      <Divider variant="inset" />
      <Grid2 container spacing={2}>
        <InitializePuzzleButton initialize={onInitialize} />
        <Button
          onClick={() => onLayout("LR")}
          disabled={solveState === "solving"}
        >
          정렬하기
        </Button>
      </Grid2>
      <PuzzleSimulationControl
        simulationState={simulationState}
        changeSimulationState={changeSimulationState}
      />
      {/* <Advanced /> */}
      <History history={history} applyHistory={applyHistory} />
    </Paper>
  );
}
