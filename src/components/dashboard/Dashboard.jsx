import { useCallback } from "react";
import InitializePuzzleButton from "./InitializePuzzleButton";
import PuzzleSizeSelect from "./PuzzleSizeSelect";
import { PuzzleState } from "../../libs/algorithm";
import { generateNewPuzzle } from "../../libs/puzzle";
import PuzzleAlgorithmSelect from "./PuzzleAlgorithmSelect";
import PuzzleSimulationControl from "./PuzzleSimulationControl";

/**
 * 대시보드 컴포넌트
 */
export default function Dashboard({ options, setOptions, onInitialize }) {
  const { size, algorithm, simulationState } = options;

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
      setOptions((prev) => ({ ...prev, simulationState: newSimulationState }));
    },
    [setOptions]
  );

  return (
    <footer
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        paddingBottom: "2rem",
        paddingTop: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PuzzleSizeSelect size={size} changeSize={changeSize} />
      <PuzzleAlgorithmSelect
        algorithm={algorithm}
        changeAlgorithm={changeAlgorithm}
      />
      <PuzzleSimulationControl
        simulationState={simulationState}
        changeSimulationState={changeSimulationState}
      />
      <InitializePuzzleButton initialize={onInitialize} />
    </footer>
  );
}
