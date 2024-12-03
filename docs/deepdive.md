# Deep Dive

## 개요
본 문서는 n-puzzle-solver의 구성 요소에 대해 서술합니다.

## App.js
`App.js` 파일은 애플리케이션의 메인 엔트리 포인트로, 주요 컴포넌트와 컨텍스트를 초기화합니다. 주요 구성 요소는 다음과 같습니다:
- `ReactFlowProvider`: React Flow 라이브러리의 컨텍스트를 제공
- `AppContext`: 애플리케이션 전반에서 사용되는 컨텍스트
- `RouteStepper`: n-puzzle 해결 방법을 표기하는 컴포넌트. 
- `WarningUnsolvablePuzzle`: 퍼즐 해결 불가 시 토스트 스타일로 알리는 컴포넌트
- `Dashboard`: 퍼즐 시뮬레이션 제어 대시보드

## 주요 라이브러리 및 유틸리티
### algorithm.js
[libs/algorithm.js](../src/libs/algorithm.js) 파일은 퍼즐을 해결하기 위한 알고리즘을 포함합니다. 주요 함수는 다음과 같습니다:
- `backTrackCorrectRouteAndSibling`: 퍼즐의 올바른 경로와 형제 노드를 추적합니다.
- `isSolvable`: 퍼즐이 해결 가능한지 여부를 판단합니다.
- `SolveState`: 퍼즐의 현재 상태를 나타내는 클래스입니다.
- `PuzzleState`: 퍼즐의 상태를 나타내는 클래스입니다.
- `solve`: 퍼즐을 해결하는 함수입니다.

### puzzle.js
[libs/puzzle.js](../src/libs/puzzle.js) 파일은 퍼즐을 생성하고 이동하는 함수를 포함합니다.
- `generateSolvablePuzzle`: 해결 가능한 무작위 퍼즐을 생성합니다
- `generateNewPuzzle`: 무작위 퍼즐을 생성합니다
- `move`: 퍼즐을 이동합니다
- `isGoal`: 퍼즐이 목표 상태인지 확인합니다

### flow.js
[libs/flow.js](../src/libs/flow.js) 파일은 `react-flow` 노드와 엣지를 생성하는 함수들을 포함합니다:
- `createInitialXYFlowNode`: 초기 `react-flow` 노드를 생성합니다.
- `createXYFlowNodesAndEdges`: `rootNode`의 자식 노드들을 따라 `react-flow` 노드와 엣지를 생성합니다.

## 주요 컴포넌트
### Dashboard
[components/dashboard/Dashboard.js](../src/components/dashboard/Dashboard.js) 파일은 대시보드 컴포넌트를 정의합니다.

### RouteStepper
[components/RouteStepper.jsx](../src/components/RouteStepper.jsx) 파일은 경로 단계를 시각화하는 컴포넌트를 정의합니다.

### WarningUnsolvablePuzzle
[components/WarningUnsolvablePuzzle.jsx](../src/components/WarningUnsolvablePuzzle.jsx) 파일은 해결 불가능한 퍼즐에 대한 경고를 표시하는 컴포넌트를 정의합니다.

## 커스텀 훅
### useLayout
[hooks/useLayout.js](../src/hooks/useLayout.js) 파일은 레이아웃 관련 커스텀 훅을 정의합니다.

[hooks/useMoveTile.js](../src/hooks/useMoveTile.js) 파일은 대상 노드의 타일을 움직일 수 있는 훅을 정의합니다

[hooks/usePuzzleCopyPaste.js](../src/hooks/usePuzzleCopyPaste.js) 파일은 대상 노드를 복사하고 클립보드에서 값을 가져올 수 있는 훅을 정의합니다

[hooks/useSolvable](../src/hooks/useSolvable.js) 파일은 `rootNode`에 대해 해결 할 수 있는 퍼즐인지 판별하는 훅을 정의합니다

## 테스트
### puzzle.test.js
[test/puzzle.test.js](../test/puzzle.test.js) 파일은 퍼즐 관련 테스트를 포함합니다.

### algorithm.test.js
[test/algorithm.test.js](../test/algorithm.test.js) 파일은 알고리즘 관련 테스트를 포함합니다.