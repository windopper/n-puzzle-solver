import { isSolvable } from "../libs/algorithm";

export default function usePuzzleCopyPaste() {
  const copyPuzzle = (node) => {
    navigator.clipboard.writeText(JSON.stringify(node.puzzle));
  };

  const pastePuzzle = async () => {
    const text = await navigator.clipboard.readText();
    const puzzle = JSON.parse(text);

    if (isSolvable(puzzle, puzzle.length)) {
        return puzzle;
    }

    return null;
  };

  return { copyPuzzle, pastePuzzle };
}