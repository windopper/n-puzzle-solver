import { isSolvable, PuzzleState } from "./algorithm";

function generateSolvablePuzzle(n) {
  let puzzle = generateNewPuzzle(n);
  while (!isSolvable(puzzle, n)) {
    puzzle = generateNewPuzzle(n);
  }
  return puzzle;
}

/**
 * 랜덤 퍼즐을 생성한다.
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

/**
 * 퍼즐을 이동시킨다.
 *
 * @param {PuzzleState | number[][]} node 2차원 배열
 * @param {"up" | "down" | "left" | "right"} direction 이동 방향
 * @returns {number[][]} 이동된 퍼즐을 반환
 */
function move(node, direction) {
  let newPuzzle;
  let n;
  let blankX;
  let blankY;

  if (node instanceof PuzzleState) {
    newPuzzle = node.puzzle.map((row) => row.slice());
    n = node.puzzle.length;
    blankX = node.blankX;
    blankY = node.blankY;
  } else {
    newPuzzle = node.map((row) => row.slice());
    n = node.length;
    // 2차원 배열인 경우
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (node[i][j] === 0) {
          blankX = j;
          blankY = i;
          break;
        }
      }
    }
  }

  switch (direction) {
    case "up":
      if (blankY > 0)
        [newPuzzle[blankY][blankX], newPuzzle[blankY - 1][blankX]] = [
          newPuzzle[blankY - 1][blankX],
          newPuzzle[blankY][blankX],
        ];
      break;
    case "down":
      if (blankY < n - 1)
        [newPuzzle[blankY][blankX], newPuzzle[blankY + 1][blankX]] = [
          newPuzzle[blankY + 1][blankX],
          newPuzzle[blankY][blankX],
        ];
      break;
    case "left":
      if (blankX > 0)
        [newPuzzle[blankY][blankX], newPuzzle[blankY][blankX - 1]] = [
          newPuzzle[blankY][blankX - 1],
          newPuzzle[blankY][blankX],
        ];
      break;
    case "right":
      if (blankX < n - 1)
        [newPuzzle[blankY][blankX], newPuzzle[blankY][blankX + 1]] = [
          newPuzzle[blankY][blankX + 1],
          newPuzzle[blankY][blankX],
        ];
      break;
  }

  return newPuzzle; //이동할 수 없을 경우 원본 퍼즐 리턴
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

export { generateSolvablePuzzle, generateNewPuzzle, move, isGoal };
