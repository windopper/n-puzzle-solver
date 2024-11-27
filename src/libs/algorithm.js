import PriorityQueue from "./PriorityQueue";
import { move, isGoal } from "./puzzle";
import {
  createGoalMapping,
  createGoalState,
  isEqualPuzzle,
  linearConflict,
  manhattanDistance,
  priorityEnqueue,
} from "./util";

export const SolveState = {
  _isPaused: false,
  _isStopped: false,

  get isPaused() {
    return this._isPaused;
  },
  set isPaused(value) {
    this._isPaused = value;
  },

  get isStopped() {
    return this._isStopped;
  },
  set isStopped(value) {
    this._isStopped = value;
  },
};

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
  depth = 0;
  direction = "";

  // 문제 해결 후 경로를 추적하기 위한 추가 필드
  // true시에 경로에 포함되는 노드
  correctRoute = false;

  // true시에 현재 노드의 부모 노드가 경로에 포함되는 노드
  isSiblingOfCorrectRoute = false;

  constructor(puzzle, parent, direction = "") {
    this.puzzle = puzzle;
    this.id = puzzle.flat().join("-");
    this.parent = parent;
    this.direction = direction;

    // find blank position
    const n = puzzle.length;
    this.blankX = 0;
    this.blankY = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (puzzle[i][j] === 0) {
          this.blankX = j;
          this.blankY = i;
        }
      }
    }
  }

  clearChildren() {
    this.children = [];
  }

  setPuzzle(puzzle) {
    this.puzzle = puzzle;
  }
}

/**
 * 알고리즘 실행 결과를 정의합니다.
 *
 * unsolvable() 메서드를 사용하여 해결 불가능한 경우를 반환합니다.
 */
class Result {
  attempts;
  least_attempts;
  last_node;

  constructor(total_attempts, least_attempts) {
    this.attempts = total_attempts;
    this.least_attempts = least_attempts;
  }

  static unsolvable() {
    return new Result(1, -1);
  }
}

const directions = ["up", "down", "left", "right"];
const getOppositeDirection = (direction) => {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      throw new Error("Invalid direction");
  }
};
/**
 * 퍼즐을 해결하기 위한 알고리즘을 구현합니다.
 *
 * @param {PuzzleState} initialNode 초기 상태 트리 노드
 * @param {"bfs" | "dfs" | "astar" | "astarclosedset" | "greedy" | "random"} algorithm 알고리즘 종류 (bfs, dfs, astar, greedy, random)
 * @returns {Result} 알고리즘 실행 결과를 나타내는 객체입니다.
 * 해결 불가능한 경우 Result.unsolvable()을 반환합니다.
 */
async function* solve(initialNode, algorithm = "bfs") {
  console.log(`알고리즘: ${algorithm} 으로 퍼즐 해결 시도 중...`);

  if (!isSolvable(initialNode.puzzle, initialNode.puzzle.length)) {
    return Result.unsolvable();
  }

  let solver;
  switch (algorithm) {
    case "bfs":
      solver = solveWithBFS(initialNode);
      break;
    case "dfs":
      solver = solveWithDFS(initialNode);
      break;
    case "astar":
      solver = solveWithAStarClosedSet(initialNode);
      break;
    case "greedy":
      solver = solveWithGreedy(initialNode);
      break;
    case "random":
      solver = solveWithRandomWalk(initialNode);
      break;
    default:
      throw new Error("Unsupported algorithm");
  }

  while (true) {
    const { value, done } = await solver.next();
    if (done) {
      return value;
    }

    if (value === "paused") {
      while (SolveState.isPaused) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } else {
      // promise per 100 attempts
      if (value.attempts % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    yield value;
  }
}

async function* solveWithBFS(initialNode) {
  const openSet = [];
  const closedSet = {};
  let attempts = 0;

  openSet.push({ node: initialNode });

  while (openSet.length > 0) {
    const { node } = openSet.shift();
    attempts++;

    if (isGoal(node.puzzle)) {
      const result = new Result(attempts, node.depth);
      result.last_node = node;
      return result;
    }

    closedSet[JSON.stringify(node.puzzle)] = 1;

    for (const direction of directions) {
      const newPuzzle = move(node.puzzle, direction);
      const puzzleKey = JSON.stringify(newPuzzle);

      if (closedSet[puzzleKey]) {
        continue;
      }

      const childNode = new PuzzleState(newPuzzle, node, direction);
      childNode.depth = node.depth + 1;
      node.children.push(childNode);
      openSet.push({ node: childNode });
    }

    // 100번마다 상태를 반환
    if (attempts % 100 === 0) {
      yield {
        attempts,
        currentDepth: node.depth,
        queueSize: openSet.length,
        visited: Object.keys(closedSet).length,
      };
    }

    if (SolveState.isPaused) {
      yield "paused";
    }

    // 사용자가 중지를 요청한 경우
    if (SolveState.isStopped) {
      throw new Error("사용자가 중지를 요청했습니다.");
    }
  }

  return Result.unsolvable();
}

async function* solveWithDFS(initialNode) {
  const stack = [];
  const visited = new Set();
  let attempts = 0;

  stack.push({ node: initialNode });
  visited.add(JSON.stringify(initialNode.puzzle));

  while (stack.length > 0) {
    const { node } = stack.pop();
    attempts++;

    if (isGoal(node.puzzle)) {
      const result = new Result(attempts, node.depth);
      result.last_node = node;
      return result;
    }

    for (const direction of directions) {
      const newPuzzle = move(node.puzzle, direction);
      const puzzleKey = JSON.stringify(newPuzzle);

      if (!visited.has(puzzleKey)) {
        visited.add(puzzleKey);
        const childNode = new PuzzleState(newPuzzle, node, direction);
        childNode.depth = node.depth + 1;
        node.children.push(childNode);
        stack.push({ node: childNode });
      }
    }

    if (attempts % 100 === 0) {
      yield {
        attempts,
        currentDepth: node.depth,
        queueSize: stack.length,
        visited: visited.size,
      };
    }

    if (SolveState.isPaused) {
      yield "paused";
    }

    // 사용자가 중지를 요청한 경우
    if (SolveState.isStopped) {
      throw new Error("사용자가 중지를 요청했습니다.");
    }
  }

  return Result.unsolvable();
}

async function* solveWithAStarClosedSet(initialNode) {
  const goalState = createGoalState(initialNode.puzzle.length);
  const goalMapping = createGoalMapping(goalState);

  const h = (node) => {
    return node.depth + manhattanDistance(node.puzzle, goalMapping);
  };

  const openList = [];
  const closedSet = {};
  let attempts = 0;

  priorityEnqueue(openList, initialNode, h(initialNode));

  while (!(openList.length === 0)) {
    const { node, cost } = openList.shift();
    attempts++;

    if (isGoal(node.puzzle)) {
      const result = new Result(attempts, node.depth);
      result.last_node = node;
      return result;
    }

    closedSet[JSON.stringify(node.puzzle)] = 1;

    for (const direction of directions) {
      const newPuzzle = move(node, direction);
      const puzzleKey = JSON.stringify(newPuzzle);

      if (closedSet[puzzleKey]) {
        continue;
      }

      if (node.parent && direction === getOppositeDirection(node.direction)) {
        continue;
      }

      const openNeighborIndex = openList.findIndex((item) =>
        isEqualPuzzle(item.node.puzzle, newPuzzle)
      );
      const childNode = new PuzzleState(newPuzzle, node, direction);
      childNode.depth = node.depth + 1;

      if (openNeighborIndex !== -1) {
        const openNeighbor = openList[openNeighborIndex];
        if (openNeighbor.node.depth > childNode.depth) {
          openList.splice(openNeighborIndex, 1);
          node.children.push(childNode);

          priorityEnqueue(openList, childNode, h(childNode));
        }
      } else {
        node.children.push(childNode);
        priorityEnqueue(openList, childNode, h(childNode));
      }
    }

    if (attempts % 100 === 0) {
      yield {
        attempts,
        currentDepth: node.depth,
        queueSize: openList.length,
        // visited: closedSet
      };
    }

    if (SolveState.isPaused) {
      yield "paused";
    }

    // 사용자가 중지를 요청한 경우
    if (SolveState.isStopped) {
      throw new Error("사용자가 중지를 요청했습니다.");
    }
  }

  return Result.unsolvable();
}

async function* solveWithAStar(initialNode) {
  const goalState = createGoalState(initialNode.puzzle.length);
  const goalMapping = createGoalMapping(goalState);

  const h = (node) => {
    return node.depth + manhattanDistance(node.puzzle, goalMapping);
  };

  const openList = [];
  // const closedSet = {};
  let attempts = 0;

  priorityEnqueue(openList, initialNode, h(initialNode));

  while (openList.length > 0) {
    const { node, cost } = openList.shift();
    attempts++;

    if (isGoal(node.puzzle)) {
      const result = new Result(attempts, node.depth);
      result.last_node = node;
      return result;
    }

    // closedSet[JSON.stringify(node.puzzle)] = 1;

    for (const direction of directions) {
      const newPuzzle = move(node, direction);
      const puzzleKey = JSON.stringify(newPuzzle);

      // if (closedSet[puzzleKey]) {
      //   continue;
      // }

      if (node.parent && direction === getOppositeDirection(node.direction)) {
        continue;
      }

      const openNeighborIndex = openList.findIndex((item) =>
        isEqualPuzzle(item.node.puzzle, newPuzzle)
      );

      if (openNeighborIndex !== -1) {
        const openNeighbor = openList[openNeighborIndex];
        if (openNeighbor.node.depth > node.depth + 1) {
          openList.splice(openNeighborIndex, 1);

          // 기존 부모-자식 관계 정리
          if (openNeighbor.node.parent) {
            openNeighbor.node.parent.children =
              openNeighbor.node.parent.children.filter(
                (child) => child.id !== openNeighbor.node.id
              );
          }

          // 새로운 부모-자식 관계 설정
          openNeighbor.node.parent = node;
          openNeighbor.node.direction = direction;
          openNeighbor.node.depth = node.depth + 1;
          node.children.push(openNeighbor.node);
          priorityEnqueue(openList, openNeighbor.node, h(openNeighbor.node));
        }
      } else {
        const childNode = new PuzzleState(newPuzzle, node, direction);
        const checkDuplicate = openList.find(
          (item) => item.node.id === childNode.id
        );

        if (checkDuplicate) continue;

        childNode.depth = node.depth + 1;
        node.children.push(childNode);
        priorityEnqueue(openList, childNode, h(childNode));
      }
    }

    if (attempts % 100 === 0) {
      yield {
        attempts,
        currentDepth: node.depth,
        queueSize: openList.length,
        // visited: closedSet
      };
    }

    if (SolveState.isPaused) {
      yield "paused";
    }

    // 사용자가 중지를 요청한 경우
    if (SolveState.isStopped) {
      throw new Error("사용자가 중지를 요청했습니다.");
    }
  }

  return Result.unsolvable();
}

async function* solveWithGreedy(initialNode) {
  const goalState = createGoalState(initialNode.puzzle.length);
  const goalMapping = createGoalMapping(goalState);

  const h = (node) => {
    return manhattanDistance(node.puzzle, goalMapping);
  };

  const openList = [];
  const closedSet = {};

  let attempts = 0;

  priorityEnqueue(openList, initialNode, h(initialNode));

  while (openList.length > 0) {
    const { node } = openList.shift();
    attempts++;

    if (isGoal(node.puzzle)) {
      const result = new Result(attempts, node.depth);
      result.last_node = node;
      return result;
    }

    closedSet[JSON.stringify(node.puzzle)] = 1;

    for (const direction of directions) {
      const newPuzzle = move(node.puzzle, direction);
      const puzzleKey = JSON.stringify(newPuzzle);

      if (closedSet[puzzleKey]) {
        continue;
      }

      const childNode = new PuzzleState(newPuzzle, node, direction);
      childNode.depth = node.depth + 1;
      node.children.push(childNode);
      priorityEnqueue(openList, childNode, h(childNode));
    }

    if (attempts % 100 === 0) {
      yield {
        attempts,
        currentDepth: node.depth,
        queueSize: openList.length,
        visited: Object.keys(closedSet).length,
      };
    }

    if (SolveState.isPaused) {
      yield "paused";
    }

    // 사용자가 중지를 요청한 경우
    if (SolveState.isStopped) {
      throw new Error("사용자가 중지를 요청했습니다.");
    }
  }

  return Result.unsolvable();
}

async function* solveWithRandomWalk(initialNode) {
  let currentNode = initialNode;
  let depth = 0;
  let attempts = 0;
  const maxAttempts = 200000; // 무한 루프 방지를 위한 최대 시도 횟수

  if (!isSolvable(initialNode.puzzle, initialNode.puzzle.length)) {
    return Result.unsolvable();
  }

  while (attempts < maxAttempts) {
    attempts++;

    if (isGoal(currentNode.puzzle)) {
      const result = new Result(attempts, depth);
      result.last_node = currentNode;
      return result;
    }

    // 랜덤한 방향 선택
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    const newPuzzle = move(currentNode.puzzle, randomDirection);

    if (newPuzzle) {
      const childNode = new PuzzleState(
        newPuzzle,
        currentNode,
        randomDirection
      );
      currentNode.children.push(childNode);
      currentNode = childNode;
      depth++;
    }

    if (attempts % 100 === 0) {
      yield {
        attempts,
        currentDepth: depth,
      };
    }

    if (SolveState.isPaused) {
      yield "paused";
    }

    // 사용자가 중지를 요청한 경우
    if (SolveState.isStopped) {
      throw new Error("사용자가 중지를 요청했습니다.");
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

  // 숫자 중복 검사
  const uniqueNumbers = new Set(puzzle).size === n * n;
  if (!uniqueNumbers) {
    throw new Error("Duplicated numbers in puzzle");
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

// 경로 추적을 위한 함수
function backTrackCorrectRouteAndSibling(node) {
  let current = node;
  while (current) {
    current.correctRoute = true;
    if (current.parent) {
      for (const sibling of current.parent.children) {
        if (sibling !== current) {
          sibling.isSiblingOfCorrectRoute = true;
        }
      }
    }
    current = current.parent;
  }
}

export {
  PuzzleState,
  Result,
  solve,
  isSolvable,
  backTrackCorrectRouteAndSibling,
};
