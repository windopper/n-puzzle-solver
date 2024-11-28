import { Button } from "@mui/material";
import { style } from "./Dashboard";

/**
 * 퍼즐 시뮬레이션을 제어하는 컴포넌트
 *
 * simulationState: 시뮬레이션 상태 (stop, play, pause)
 * changeSimulationState: 시뮬레이션 상태 변경 함수 ex) changeSimulationState("play")
 */
export default function PuzzleSimulationControl({
  simulationState,
  changeSimulationState,
  canSolve,
}) {
  return (
    <div style={style.dashboardMenuItem}>
      <div style={style.dashboardMenuItemTitle}>시뮬레이션 제어</div>
      <div style={style.dashboardMenuItemContent}>
          <Button
            onClick={() => changeSimulationState("play")}
            disabled={simulationState === "play" || !canSolve}
            variant="contained"
            color="primary"
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
      </div>
    </div>
  );
}
