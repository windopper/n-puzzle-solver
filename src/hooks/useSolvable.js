import { useMemo } from "react";
import { isSolvable } from "../libs/algorithm";

export default function useSolvable(solveState, rootNode) {
    const solvable = useMemo(() => {
        if (rootNode === null) return true;
        if (solveState !== "idle") return true;
        return isSolvable(rootNode?.puzzle, rootNode?.puzzle.length);
      }, [solveState, rootNode?.puzzle]);

    return solvable;
}