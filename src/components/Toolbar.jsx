import { FaCheck, FaCopy, FaPaste } from "react-icons/fa";
import usePuzzleCopyPaste from "../hooks/usePuzzleCopyPaste";
import useMoveTile from "../hooks/useMoveTile";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const style = {
  toolbar: {
    position: "absolute",
    top: "-50px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    display: "flex",
    justifyContent: "center",
    fontSize: 20,
    backgroundColor: "rgb(24 24 27)",
    borderRadius: "25px",
    padding: "4px 4px",
    gap: "5px",
  },
  button: {
    border: 0,
    borderRadius: "25px",
    padding: "6px 6px",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    color: "rgb(161 161 170)",
    transition: "color 0.2s",
  },
  popup: {
    fontSize: 12,
    position: "absolute",
    bottom: "85%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(24, 24, 27, 0.7)",
    color: "rgb(244 244 245)",
    padding: "4px 8px",
    borderRadius: 5,
    userSelect: "none",
    whiteSpace: "nowrap",
  },
};

export default function Toolbar({ node }) {
  const { handleMoveTileDirection, handleUpdatePuzzle } = useMoveTile(node);
  const { copyPuzzle, pastePuzzle } = usePuzzleCopyPaste();
  const [copyConfirm, setCopyConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyConfirm(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [copyConfirm]);

  return (
    <AnimatePresence>
      <motion.div style={style.toolbar}>
        <Button
          onClick={() => {
            copyPuzzle(node);
            setCopyConfirm(true);
          }}
          popUpContent="퍼즐 복사"
        >
          {copyConfirm ? <FaCheck color="lightgreen" /> : <FaCopy />}
        </Button>
        <Button
          onClick={async () => {
            const puzzle = await pastePuzzle();
            if (puzzle) handleUpdatePuzzle(puzzle);
          }}
          popUpContent="퍼즐 붙여넣기"
        >
          <FaPaste />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}

function Button({ children, onClick, props, popUpContent }) {
  const [popup, setPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  return (
    <div style={{ position: "relative" }}>
      <AnimatePresence>
        {popUpContent && showPopup && (
          <motion.div
            style={style.popup}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
           {popUpContent}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        style={style.button}
        onClick={onClick}
        onPointerEnter={(e) => {
          e.currentTarget.style.color = "rgb(244 244 245)";
          e.currentTarget.style.backgroundColor = "rgb(39 39 42)";
          setPopup(true);
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.color = "rgb(161 161 170)";
          e.currentTarget.style.backgroundColor = "transparent";
          setPopup(false);
          setShowPopup(false);
        }}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
