import { Button } from "@mui/joy";

export default function AlignButton({ onLayout, solveState }) {
  return (
    <Button
      onClick={() => onLayout("LR")}
      disabled={solveState === "solving"}
      variant="soft"
    >
      정렬하기
    </Button>
  );
}
