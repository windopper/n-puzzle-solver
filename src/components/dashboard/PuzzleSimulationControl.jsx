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
    <div style={{ padding: 20, textAlign: "center" }}>
      <h3>시뮬레이션 상태: {simulationState}</h3>
      <div style={{ marginTop: 10 }}>
        <button
          style={{ padding: "10px 20px", margin: "0 5px", fontSize: 16 }}
          onClick={() => changeSimulationState("play")}
          disabled={simulationState === "play"}
        >
          ▶ Play
        </button>
        <button
          style={{ padding: "10px 20px", margin: "0 5px", fontSize: 16 }}
          onClick={() => changeSimulationState("pause")}
          disabled={simulationState === "pause"}
        >
          ⏸ Pause
        </button>
        <button
          style={{ padding: "10px 20px", margin: "0 5px", fontSize: 16 }}
          onClick={() => changeSimulationState("stop")}
          disabled={simulationState === "stop"}
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}
