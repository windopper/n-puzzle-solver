import { Button, ButtonGroup } from "@mui/joy";
import { NodeToolbar } from "@xyflow/react";
import GameBoardNode from "./GameBoardNode";
import { useContext } from "react";
import { AppContext } from "../../App";
import { AnimatePresence, motion } from "motion/react";
import Toolbar from "../Toolbar";

const style = {
  button: {
    background: "rgb(0, 0, 0, 0.6)",
    border: 0,
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 5,
    padding: 8,
    top: 200,
  },
};

export default function GameBoardNodeWithTool(params) {
  const { data, selected } = params;
  const { node } = data;
  const { onInitialize } = useContext(AppContext);

  return (
    <>
      <Toolbar node={node} disabled={!selected} disabledPaste />
      <NodeToolbar></NodeToolbar>
      {/* <NodeToolbar>
        <motion.button
          style={style.button}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onInitialize(node.puzzle)}
        >
          초기 지점 설정
        </motion.button>
      </NodeToolbar> */}
      <GameBoardNode {...params} />
    </>
  );
}
