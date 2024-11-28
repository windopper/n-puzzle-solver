import { useCallback, useContext, useEffect } from "react";
import InitializePuzzleButton from "./InitializePuzzleButton";
import PuzzleAlgorithmSelect from "./PuzzleAlgorithmSelect";
import PuzzleSimulationControl from "./PuzzleSimulationControl";
import { Box, Grid2, Paper } from "@mui/material";
import IntermediateResultIndicator from "./IntermediateResultIndicator";
import { AppContext } from "../../App";
import History from "./History";
import AlignButton from "./AlignButton";
import useSolvable from "../../hooks/useSolvable";

export const style = {
  dashboardMenuItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
    width: "100%",
    marginTop: 5,
    padding: "0 10px",
    boxSizing: "border-box",
  },
  dashboardMenuItemTitle: {
    fontSize: "12px",
    fontWeight: 200,
    color: "gray",
    marginLeft: "5px",
  },
  dashboardMenuItemContent: {
    display: "flex",
    gap: 5,
    width: "100%",
  },
};

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
    changeSimulationState,
  } = useContext(AppContext);

  const { size, algorithm, simulationState } = options;

  const solvable = useSolvable(solveState, rootNode);

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

  const handleKeyDown = useCallback(
    (e) => {
      // 스페이스로 시뮬레이션 제어
      if (e.key === " ") {
        changeSimulationState(simulationState === "play" ? "pause" : "play");
      }
    },
    [changeSimulationState, simulationState]
  );

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
        gap: 3,
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
        <IntermediateResultIndicator
          intermediateResults={intermediateResults}
        />
      </Grid2>
      <DashboardDivider />
      <PuzzleAlgorithmSelect
        algorithm={algorithm}
        changeAlgorithm={changeAlgorithm}
      />
      <div style={style.dashboardMenuItem}>
        <div style={style.dashboardMenuItemTitle}>액션</div>
        <div style={style.dashboardMenuItemContent}>
          <InitializePuzzleButton initialize={onInitialize} />
          <AlignButton solveState={solveState} onLayout={onLayout} />
        </div>
      </div>
      <PuzzleSimulationControl
        simulationState={simulationState}
        changeSimulationState={changeSimulationState}
        canSolve={solvable}
      />
      <DashboardDivider />
      {/* <Advanced /> */}
      <History history={history} applyHistory={applyHistory} />
    </Paper>
  );
}

function DashboardDivider() {
  return (
    <hr
      style={{
        width: "85%",
        padding: 0,
        margin: 8,
        boxSizing: "border-box",
        border: "0.01px solid rgba(0, 0, 0, 0.1)",
      }}
    />
  );
}
