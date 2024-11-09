/**
 * 상태 트리 노드를 정의합니다.
 *
 * 알고리즘의 경로를 추적하기 위해 사용하는 퍼즐 상태 클래스입니다.
 * children 배열에 이동 가능한 상태들을 추가하여 트리를 구성합니다.
 */
class PuzzleState {
  // 노드의 고유 ID
  id = Math.random().toString(16).slice(2);

  /**
   * @param {number[][]} puzzle 퍼즐의 초기 상태
   */

  /**
   * @param {PuzzleState} parent 부모 노드
   */
  parent;

  /**
   * @param {PuzzleState[]} children 해당 퍼즐 상태에서 이동 가능한 상태들
   */
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
  /**
   * @param {number} total_attempts 전체 시도 횟수
   */
  total_attempts;

  /**
   * @param {number} least_attempts 최소 시도 횟수
   */
  least_attempts;

  constructor(total_attempts, least_attempts) {
    this.total_attempts = total_attempts;
    this.least_attempts = least_attempts;
  }

  /**
   * 해결 불가능한 경우를 반환합니다.
   * @returns {Result} 해결 불가능한 경우 반환
   */
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
function solve(initialNode) {}

export { PuzzleState, Result, solve };
