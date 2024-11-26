import { Button } from "@mui/material";

/**
 * 퍼즐 초기화 버튼 컴포넌트
 *
 * initialize 함수는 퍼즐을 초기화하는 함수입니다.
 * ex) initialize()
 */
export default function InitializePuzzleButton({ initialize }) {
  // 구현 필요
  return <Button onClick={() => initialize()}>랜덤 초기화</Button>;
}
