import { isSolvable, PuzzleState, Result, solve } from "../src/libs/algorithm";
import { generateNewPuzzle, generateSolvablePuzzle } from "../src/libs/puzzle";

jest.setTimeout(30000);

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

  test("ASTAR 알고리즘 테스트 케이스", async () => {
    const initialNode = new PuzzleState(generateSolvablePuzzle(3), null);
    const solver = solve(initialNode, "astar");
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

  test("BFS 알고리즘 테스트 케이스", async () => {
    const initialNode = new PuzzleState(generateSolvablePuzzle(3), null);
    const solver = solve(initialNode, "bfs");
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

  test("GREEDY 알고리즘 테스트 케이스", async () => {
    const initialNode = new PuzzleState(generateSolvablePuzzle(3), null);
    const solver = solve(initialNode, "greedy");
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
