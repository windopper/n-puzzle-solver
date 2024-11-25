import { isSolvable, PuzzleState, Result, solve } from "../src/libs/algorithm";

describe("8-퍼즐 알고리즘 테스트", () => {
  test("초기 상태가 이미 목표 상태인 경우", async () => {
    const goalState = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ];

    const initialNode = new PuzzleState(goalState, null);
    const solver = solve(initialNode);
    let result;

    while (true) {
      const { done, value } = await solver.next();
      if (done) {
        result = value;
        break;
      }
    }

    expect(result).toBeInstanceOf(Result);
    expect(result.attempts).toBe(1);
    expect(result.least_attempts).toBe(0);
  });

  test("한 번의 이동으로 해결 가능한 케이스", async () => {
    const initialPuzzle = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 0, 8],
    ];

    const initialNode = new PuzzleState(initialPuzzle, null);
    const solver = solve(initialNode);
    let result;

    while (true) {
      const { done, value } = await solver.next();
      if (done) {
        result = value;
        break;
      }
    }

    expect(result.attempts).toBeGreaterThanOrEqual(1);
    expect(result.least_attempts).toBe(1);
  });

  test("여러 번의 이동이 필요한 복잡한 케이스", async () => {
    const initialPuzzle = [
      [1, 2, 3],
      [4, 0, 6],
      [7, 5, 8],
    ];

    const initialNode = new PuzzleState(initialPuzzle, null);
    const solver = solve(initialNode);
    let result;

    while (true) {
      const { done, value } = await solver.next();
      if (done) {
        result = value;
        break;
      }
    }

    expect(result.attempts).toBeGreaterThanOrEqual(1);
    expect(result.least_attempts).toBeGreaterThan(1);
  });

  test("해결 불가능한 케이스", async () => {
    const unsolvablePuzzle = [
      [1, 2, 3],
      [5, 6, 4],
      [8, 7, 0],
    ];

    const initialNode = new PuzzleState(unsolvablePuzzle, null);
    const solver = solve(initialNode);
    let result;

    while (true) {
      const { done, value } = await solver.next();
      if (done) {
        result = value;
        break;
      }
    }

    expect(result).toBeInstanceOf(Result);
    expect(result.attempts).toBe(1);
    expect(result.least_attempts).toBe(-1);
  });
});
