import { PuzzleState } from "./algorithm";

/**
 * 랜덤 노드를 생성하는 함수입니다.
 *
 * @param {number} size 생성할 노드의 크기입니다.
 *
 * @returns {PuzzleState} 생성된 랜덤 노드의 상태를 반환합니다.
 */
export function createRandomNode(size = 3) {
  const createNxNArray = (n) =>
    Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => n * i + j)
    );

  let rootNode = new PuzzleState(createNxNArray(size), null);

  let node1 = new PuzzleState(createNxNArray(size), rootNode);

  let node2 = new PuzzleState(createNxNArray(size), rootNode);

  rootNode.children = [node1, node2];

  let node1_1 = new PuzzleState(createNxNArray(size), node1);

  node1.children = [node1_1];

  return rootNode;
}

/**
 *
 * @param {number[][]} goal_state
 * @returns 목표 상태의 위치 정보를 담은 맵을 생성합니다.
 */
export const createGoalMapping = (goal_state) => {
  const map = {};
  for (let row = 0; row < goal_state.length; row++) {
    for (let col = 0; col < goal_state[row].length; col++) {
      map[goal_state[row][col]] = { row, col };
    }
  }
  return map;
};

/**
 *
 * @param {number} n
 * @returns n x n 크기의 목표 상태를 생성합니다.
 */
export const createGoalState = (n) => {
  const goal_state = [];
  let num = 1;
  for (let row = 0; row < n; row++) {
    const row_array = [];
    for (let col = 0; col < n; col++) {
      row_array.push(num++);
    }
    goal_state.push(row_array);
  }

  return goal_state;
};

/**
 *
 * @param {number[][]} puzzle
 * @param {number} mapping 목표 상태의 위치 정보 @see createGoalMapping
 */
export function manhattanDistance(puzzle, mapping) {
  const n = puzzle.length;
  let distance = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (puzzle[i][j]) {
        const goalPos = mapping[puzzle[i][j]];
        distance += Math.abs(i - goalPos.row) + Math.abs(j - goalPos.col);
      }
    }
  }

  return distance;
}

export function linearConflict(puzzle) {
  let conflict = 0;
  const size = Math.sqrt(puzzle.length);

  // 행에서의 선형 충돌 검사
  for (let row = 0; row < size; row++) {
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        const pos1 = row * size + i;
        const pos2 = row * size + j;

        if (puzzle[pos1] !== 0 && puzzle[pos2] !== 0) {
          const goalRow1 = Math.floor((puzzle[pos1] - 1) / size);
          const goalRow2 = Math.floor((puzzle[pos2] - 1) / size);

          if (
            goalRow1 === goalRow2 &&
            goalRow1 === row &&
            puzzle[pos1] > puzzle[pos2]
          ) {
            conflict += 2;
          }
        }
      }
    }
  }

  return conflict;
}

export const priorityEnqueue = (openList, node, cost) => {
  for (let i = 0; i < openList.length; i++) {
    if (openList[i].cost > cost) {
      openList.splice(i, 0, { node, cost });
      return;
    }
  }
  openList.push({ node, cost });
};

export const isEqualPuzzle = (puzzle1, puzzle2) => {
  return puzzle1.every((row, i) =>
    row.every((tile, j) => tile === puzzle2[i][j])
  );
};
