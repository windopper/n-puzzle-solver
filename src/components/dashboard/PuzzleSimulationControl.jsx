import { Button, Grid2 } from "@mui/material";

/**
 * 퍼즐 시뮬레이션을 제어하는 컴포넌트
 *
 * simulationState: 시뮬레이션 상태 (stop, play, pause)
 * changeSimulationState: 시뮬레이션 상태 변경 함수 ex) changeSimulationState("play")
 */
export default function PuzzleSimulationControl({
  simulationState,
  changeSimulationState,
}) {
  return (
    <Grid2 container spacing={2}>
      <Button
        onClick={() => changeSimulationState("play")}
        disabled={simulationState === "play"}
        variant="contained"
      >
        ▶ Solve
      </Button>
      <Button
        onClick={() => changeSimulationState("pause")}
        disabled={simulationState === "pause"}
      >
        ⏸ Pause
      </Button>
      <Button
        onClick={() => changeSimulationState("stop")}
        disabled={simulationState === "stop"}
      >
        ⏹ Stop
      </Button>
    </Grid2>
  );
}
