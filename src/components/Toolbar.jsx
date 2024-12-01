import { FaCheck, FaPaste } from "react-icons/fa";
import usePuzzleCopyPaste from "../hooks/usePuzzleCopyPaste";
import useMoveTile from "../hooks/useMoveTile";
import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BsThreeDots } from "react-icons/bs";
import { AppContext } from "../App";
import { LuGitBranch } from "react-icons/lu";
import { HiClipboardCopy } from "react-icons/hi";
import { useViewport } from "@xyflow/react";

const style = {
  toolbar: {
    position: "absolute",
    top: "-50px",
    left: "50%",
    transform: "translate(-50%, -50%) scale(1)",
    width: "fit-content",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(24 24 27)",
    borderRadius: "25px",
    padding: "4px 4px",
    gap: "5px",
    width: "20px",
    height: "10px",
    color: "rgb(161 161 170)",
    zIndex: 999,
  },
  button: {
    position: "relative",
    border: 0,
    borderRadius: "25px",
    padding: "3px 3px",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    color: "rgb(161 161 170)",
    transition: "color 0.2s",
    width: "100%",
    height: "100%",
    overflow: "hidden",
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
    zIndex: -1,
  },
};

export default function Toolbar({
  node,
  disabled = false,
  disabledCopy = false,
  disabledPaste = false,
  disabledInitialize = false,
}) {
  const { zoom } = useViewport();
  const scale = 1 / zoom;
  const { handleMoveTileDirection, handleUpdatePuzzle } = useMoveTile(node);
  const { onInitialize } = useContext(AppContext);
  const { copyPuzzle, pastePuzzle } = usePuzzleCopyPaste();
  const [copyConfirm, setCopyConfirm] = useState(false);
  const [hover, setHover] = useState(false);
  const toolBarHoverDebounce = useRef(null);

  const hoverWidth =
    27 *
    [disabledCopy, disabledInitialize, disabledPaste].filter((v) => !v).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyConfirm(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [copyConfirm]);

  return (
    <AnimatePresence>
      {!disabled && (
        <motion.div
          style={style.toolbar}
          initial={{ opacity: 0, width: "2px", height: "2px" }}
          animate={{
            opacity: 1,
            width: `${20 * scale}px`,
            height: `${10 * scale}px`,
            borderRadius: `${25 * scale}px`,
            padding: `${4 * scale}px ${4 * scale}px`,
            gap: `${4 * scale}px`,
          }}
          exit={{ opacity: 0, width: "2px", height: "2px" }}
          whileHover={{
            width: `${hoverWidth * scale}px`,
            height: `${25 * scale}px`,
          }}
          onHoverStart={() => {
            setHover(true);
          }}
          onHoverEnd={() => {
            setHover(false);
          }}
          transition={{
            type: "spring",
            bounce: 0.05,
            duration: 0.35,
          }}
        >
          {!hover && (
            <motion.div
              style={{ display: "flex", alignItems: "center" }}
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
              <BsThreeDots size={`${20 * scale}px`} />
            </motion.div>
          )}
          {hover && (
            <>
              {!disabledCopy && (
                <Button
                  onClick={() => {
                    copyPuzzle(node);
                    setCopyConfirm(true);
                  }}
                  popUpContent="퍼즐 복사"
                  scale={scale}
                >
                  {copyConfirm ? (
                    <FaCheck color="lightgreen" size="100%" />
                  ) : (
                    <HiClipboardCopy size={`${20 * scale}px`} />
                  )}
                </Button>
              )}
              {!disabledInitialize && (
                <Button
                  onClick={() => {
                    onInitialize(node.puzzle);
                  }}
                  popUpContent="초기 지점 설정"
                  scale={scale}
                >
                  <LuGitBranch size={`${20 * scale}px`} />
                </Button>
              )}
              {!disabledPaste && (
                <Button
                  onClick={async () => {
                    const puzzle = await pastePuzzle();
                    if (puzzle) handleUpdatePuzzle(puzzle);
                  }}
                  popUpContent="퍼즐 붙여넣기"
                  scale={scale}
                >
                  <FaPaste size={`${20 * scale}px`} />
                </Button>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Button({ children, onClick, popUpContent, scale, ...props }) {
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
    <>
      <AnimatePresence>
        {popUpContent && showPopup && (
          <motion.div
            style={{
              ...style.popup,
              fontSize: 12 * scale,
              padding: `${4 * scale}px ${8 * scale}px`,
              borderRadius: `${5 * scale}px`,
            }}
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
      <div
        style={{
          position: "relative",
          height: "100%",
          aspectRatio: 1,
          overflow: "hidden",
        }}
      >
        <button
          style={style.button}
          onClick={onClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgb(244 244 245)";
            e.currentTarget.style.backgroundColor = "rgb(39 39 42)";
            setPopup(true);
          }}
          onMouseLeave={(e) => {
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
    </>
  );
}
