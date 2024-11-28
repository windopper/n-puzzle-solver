import { useReactFlow } from "@xyflow/react";
import { move } from "../libs/puzzle";

export default function useMoveTile(node) {
  const { updateNodeData } = useReactFlow();

  const handleMoveTile = (tile1X, tile1Y, tile2X, tile2Y) => {
    const newPuzzle = node.puzzle.map((row) => [...row]);
    const temp = newPuzzle[tile1Y][tile1X];
    newPuzzle[tile1Y][tile1X] = newPuzzle[tile2Y][tile2X];
    newPuzzle[tile2Y][tile2X] = temp;
    node.setPuzzle(newPuzzle);
    updateNodeData(node.id, { ...node });
  };

  const handleMoveTileDirection = (direction) => {
    const movedPuzzle = move(node.puzzle, direction);
    node.setPuzzle(movedPuzzle);
    updateNodeData(node.id, { ...node });
  }

  return { handleMoveTile, handleMoveTileDirection };
}
