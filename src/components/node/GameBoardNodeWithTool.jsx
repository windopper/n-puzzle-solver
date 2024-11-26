import { Button, ButtonGroup } from "@mui/joy";
import { NodeToolbar } from "@xyflow/react";
import GameBoardNode from "./GameBoardNode";
import { useContext } from "react";
import { AppContext } from "../../App";

export default function GameBoardNodeWithTool(params) {
    const { data } = params;
    const { node } = data;
    const { onInitialize } = useContext(AppContext);

  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <ButtonGroup variant="solid" size="sm">
          <Button onClick={() => onInitialize(node.puzzle)}>초기 지점 설정</Button>
        </ButtonGroup>
      </NodeToolbar>
      <GameBoardNode {...params} />
    </>
  );
}
