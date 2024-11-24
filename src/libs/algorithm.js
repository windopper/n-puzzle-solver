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

  if (!isSolvable(initialNode.puzzle, initialNode.puzzle.length)) {
    return Result.unsolvable();
  }

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

/**
 *
 * @param {number[][]} puzzle
 * @param {number} n
 * @returns
 */
function isSolvable(puzzle, n) {
  puzzle = puzzle.flat();
  // 입력 유효성 검사 추가
  if (!Array.isArray(puzzle) || puzzle.length !== n * n) {
    throw new Error("Invalid puzzle input");
  }

  // 숫자 범위 검사 (0부터 n*n-1까지의 숫자만 허용)
  const validNumbers = puzzle.every((num) => num >= 0 && num < n * n);
  if (!validNumbers) {
    throw new Error("Invalid numbers in puzzle");
  }

  let inversions = 0;
  let blankRow = 0;

  // 빈 칸(0)을 제외한 숫자들의 순서쌍을 확인하여 inversion 계산
  for (let i = 0; i < puzzle.length - 1; i++) {
    if (puzzle[i] === 0) {
      blankRow = Math.floor(i / n);
      continue;
    }

    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[j] !== 0 && puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }

  // N이 홀수인 경우
  if (n % 2 === 1) {
    return inversions % 2 === 0;
  }
  // N이 짝수인 경우
  else {
    // 빈 칸의 행 번호를 아래에서부터 카운트
    const blankRowFromBottom = n - blankRow;
    return (inversions + blankRowFromBottom) % 2 === 0;
  }
}

export { PuzzleState, Result, solve, isSolvable };
