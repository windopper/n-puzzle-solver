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
