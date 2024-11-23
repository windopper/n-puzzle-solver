import { move, isGoal } from "./puzzle";

/**
 * 상태 트리 노드를 정의합니다.
 *
 * 알고리즘의 경로를 추적하기 위해 사용하는 퍼즐 상태 클래스입니다.
 * children 배열에 이동 가능한 상태들을 추가하여 트리를 구성합니다.
 */
class PuzzleState {
  id = Math.random().toString(16).slice(2);
  parent;
  children = [];

  constructor(puzzle, parent) {
    this.puzzle = puzzle;
    this.parent = parent;
  }
}

/**
 * 알고리즘 실행 결과를 정의합니다.
 *
 * unsolvable() 메서드를 사용하여 해결 불가능한 경우를 반환합니다.
 */
class Result {
  total_attempts;
  least_attempts;

  constructor(total_attempts, least_attempts) {
    this.total_attempts = total_attempts;
    this.least_attempts = least_attempts;
  }

  static unsolvable() {
    return new Result(1, -1);
  }
}

/**
 * 퍼즐을 해결하기 위한 알고리즘을 구현합니다.
 *
 * @param {PuzzleState} initialNode 초기 상태 트리 노드
 * @returns {Result} 알고리즘 실행 결과를 나타내는 객체입니다.
 * 해결 불가능한 경우 Result.unsolvable()을 반환합니다.
 */
function solve(initialNode) {
  const queue = [];
  const visited = new Set();
  let attempts = 0;

  queue.push({ node: initialNode, depth: 0 });
  visited.add(JSON.stringify(initialNode.puzzle));

  while (queue.length > 0) {
    const { node, depth } = queue.shift();
    attempts++;

    if (isGoal(node.puzzle)) {
      return new Result(attempts, depth);
    }

    const directions = ["up", "down", "left", "right"];
    for (const direction of directions) {
      const newPuzzle = move(node.puzzle, direction);
      const puzzleKey = JSON.stringify(newPuzzle);

      if (!visited.has(puzzleKey)) {
        visited.add(puzzleKey);
        const childNode = new PuzzleState(newPuzzle, node);
        node.children.push(childNode);
        queue.push({ node: childNode, depth: depth + 1 });
      }
    }
  }

  return Result.unsolvable();
}

export { PuzzleState, Result, solve };
