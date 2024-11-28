import { AnimatePresence, motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../App";
import { IoIosWarning } from "react-icons/io";
import useSolvable from "../hooks/useSolvable";

const style = {
  warning: {
    background: "#e23f32",
    color: "white",
    borderRadius: 5,
    position: "relative",
    top: "-80px",
    width: "100%",
    fontSize: "16px",
    fontWeight: "800",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 0.5px 15px 0px rgb(0, 0, 0, 0.2)",
    userSelect: "none",
  },
};

export default function WarningUnsolvablePuzzle() {
  const { solveState, rootNode } = useContext(AppContext);
  const solvable = useSolvable(solveState, rootNode);

  return (
    <AnimatePresence>
      {!solvable ? (
        <motion.div animate={{ y: 100 }} exit={{ y: 0 }}>
          <div style={style.warning}>
            <IoIosWarning size={"24px"} /> 해결 할 수 없는 퍼즐입니다
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
