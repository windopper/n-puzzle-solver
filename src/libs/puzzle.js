/**
 * 해결가능한 랜덤 퍼즐을 생성한다.
 * ex) generateNewPuzzle(3) => [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
 *
 * @param {number} n
 * @returns {number[][]} 2차원 배열 반환
 */
function generateNewPuzzle(n) {
  // 예시 코드 수정해주세요.
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => n * i + j)
  );
}

/**
 * 퍼즐을 이동시킨다.
 *
 * @param {number[][]} puzzle 2차원 배열
 * @param {"up" | "down" | "left" | "right"} direction 이동 방향
 * @returns {number[][]} 이동된 퍼즐을 반환
 */
function move(puzzle, direction) {}

/**
 * 퍼즐이 목표 상태인지 확인한다.
 *
 * @param {number[][]} puzzle
 */
function isGoal(puzzle) {}

export { generateNewPuzzle, move, isGoal };
