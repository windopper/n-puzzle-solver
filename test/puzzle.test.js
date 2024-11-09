import { generateNewPuzzle, move, isGoal } from "../src/libs/puzzle";

describe("퍼즐 게임 테스트", () => {
  describe("generateNewPuzzle", () => {
    test("3 x 3 크기의 퍼즐을 생성한다", () => {
      const n = 3;
      const puzzle = generateNewPuzzle(n);

      // 배열 크기 검증
      expect(puzzle.length).toBe(n);
      puzzle.forEach((row) => expect(row.length).toBe(n));

      // 1부터 n*n-1까지의 숫자와 0이 모두 포함되어 있는지 검증
      const numbers = puzzle.flat();
      expect(numbers.sort((a, b) => a - b)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
      ]);
    });

    test("4 x 4 크기의 퍼즐을 생성한다", () => {
      const n = 4;
      const puzzle = generateNewPuzzle(n);

      // 배열 크기 검증
      expect(puzzle.length).toBe(n);
      puzzle.forEach((row) => expect(row.length).toBe(n));

      // 1부터 n*n-1까지의 숫자와 0이 모두 포함되어 있는지 검증
      const numbers = puzzle.flat();
      expect(numbers.sort((a, b) => a - b)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]);
    });
  });

  describe("move", () => {
    let puzzle;

    beforeEach(() => {
      puzzle = [
        [1, 2, 3],
        [4, 0, 6],
        [7, 5, 8],
      ];
    });

    test("빈 칸을 위로 이동", () => {
      const result = move(puzzle, "up");
      // 원본 퍼즐은 변경되지 않아야 함
      expect(puzzle).toEqual([
        [1, 2, 3],
        [4, 0, 6],
        [7, 5, 8],
      ]);
      // 새로운 퍼즐 배열이 반환되어야 함
      expect(result).toEqual([
        [1, 0, 3],
        [4, 2, 6],
        [7, 5, 8],
      ]);
    });

    test("빈 칸을 아래로 이동", () => {
      const result = move(puzzle, "down");
      expect(puzzle).toEqual([
        [1, 2, 3],
        [4, 0, 6],
        [7, 5, 8],
      ]);
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 0, 8],
      ]);
    });

    test("빈 칸을 왼쪽으로 이동", () => {
      const result = move(puzzle, "left");
      expect(puzzle).toEqual([
        [1, 2, 3],
        [4, 0, 6],
        [7, 5, 8],
      ]);
      expect(result).toEqual([
        [1, 2, 3],
        [0, 4, 6],
        [7, 5, 8],
      ]);
    });

    test("빈 칸을 오른쪽으로 이동", () => {
      const result = move(puzzle, "right");
      expect(puzzle).toEqual([
        [1, 2, 3],
        [4, 0, 6],
        [7, 5, 8],
      ]);
      expect(result).toEqual([
        [1, 2, 3],
        [4, 6, 0],
        [7, 5, 8],
      ]);
    });

    test("이동할 수 없는 경우 원본과 동일한 새 퍼즐 반환", () => {
      const initialPuzzle = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ];
      const result = move(initialPuzzle, "up");

      // 원본 퍼즐이 변경되지 않아야 함
      expect(initialPuzzle).toEqual([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ]);
      // 새로운 배열이지만 내용은 동일해야 함
      expect(result).toEqual(initialPuzzle);
    });
  });
});

// ... existing code ...

describe("isGoal", () => {
  test("3x3 퍼즐이 목표 상태인 경우 true를 반환", () => {
    const puzzle = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ];
    expect(isGoal(puzzle)).toBe(true);
  });

  test("3x3 퍼즐이 목표 상태가 아닌 경우 false를 반환", () => {
    const puzzle = [
      [1, 2, 3],
      [4, 0, 6],
      [7, 5, 8],
    ];
    expect(isGoal(puzzle)).toBe(false);
  });

  test("4x4 퍼즐이 목표 상태인 경우 true를 반환", () => {
    const puzzle = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 0],
    ];
    expect(isGoal(puzzle)).toBe(true);
  });

  test("4x4 퍼즐이 목표 상태가 아닌 경우 false를 반환", () => {
    const puzzle = [
      [1, 2, 3, 4],
      [5, 6, 0, 8],
      [9, 10, 7, 12],
      [13, 14, 11, 15],
    ];
    expect(isGoal(puzzle)).toBe(false);
  });
});
