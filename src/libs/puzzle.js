/**
 * 해결가능한 랜덤 퍼즐을 생성한다.
 * ex) generateNewPuzzle(3) => [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
 *
 * @param {number} n
 * @returns {number[][]} 2차원 배열 반환
 */
function generateNewPuzzle(n) {
  const puzzleArray = Array.from({ length: n * n }, (_, i) => i);
  
  for (let i = puzzleArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); //랜덤으로 순서를 뽑아서 숫자바꾸기
    [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
  }

  // 2차원 배열로 변환
  const puzzle = Array.from({ length: n }, (_, i) =>
    puzzleArray.slice(i * n, i * n + n)
  );

  return puzzle;
}

/*최악의 경우의 수
function generateWorstPuzzle(n) {
  // 숫자를 반대로 배치하고 빈칸을 마지막에 추가
  const puzzleArray = Array.from({ length: n * n - 1 }, (_, i) => n * n - 1 - i).concat(0);

  // 2차원 배열로 변환
  const puzzle = Array.from({ length: n }, (_, i) =>
    puzzleArray.slice(i * n, i * n + n)
  );

  return puzzle;
}
*/

/**
 * 퍼즐을 이동시킨다.
 *
 * @param {number[][]} puzzle 2차원 배열
 * @param {"up" | "down" | "left" | "right"} direction 이동 방향
 * @returns {number[][]} 이동된 퍼즐을 반환
 */
function move(puzzle, direction) {
  const n = puzzle.length;
  let x, y;

  // 0(빈칸) 위치 찾기
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (puzzle[i][j] === 0) { //x가 가로, y가 세로
        y = i;
        x = j;
      }
    }
  }

  // 이동 로직
  const newPuzzle = puzzle.map(row => row.slice());
  switch (direction) {
    case 'up':
      if (y > 0) [newPuzzle[y][x], newPuzzle[y - 1][x]] = [newPuzzle[y - 1][x], newPuzzle[y][x]];  //
      break;
    case 'down':
      if (y < n - 1) [newPuzzle[y][x], newPuzzle[y + 1][x]] = [newPuzzle[y + 1][x], newPuzzle[y][x]];
      break;
    case 'left':
      if (x > 0) [newPuzzle[y][x], newPuzzle[y][x - 1]] = [newPuzzle[y][x - 1], newPuzzle[y][x]]; //
      break;
    case 'right':
      if (x < n - 1) [newPuzzle[y][x], newPuzzle[y][x + 1]] = [newPuzzle[y][x + 1], newPuzzle[y][x]];
      break;
  }

  return newPuzzle;  //이동할 수 없을 경우 원본 퍼즐 리턴

}

/**
 * 퍼즐이 목표 상태인지 확인한다.
 *
 * @param {number[][]} puzzle
 */
function isGoal(puzzle) {
  const n = puzzle.length;
  let targetValue = 1;

  // 각 퍼즐의 숫자가 오름차순인지 확인, 마지막 칸은 0이어야 함
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // 마지막 칸이 아닌 경우 목표 값을 비교
      if (i === n - 1 && j === n - 1) {
        if (puzzle[i][j] !== 0) return false;
      } else {
        if (puzzle[i][j] !== targetValue) return false;
        targetValue++;
      }
    }
  }

  return true;
}

export { generateNewPuzzle, move, isGoal };


