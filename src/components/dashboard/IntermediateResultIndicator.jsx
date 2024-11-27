import { Chip } from "@mui/material";

export default function IntermediateResultIndicator({ intermediateResults }) {
  const { attempts, currentDepth, queueSize, visited, least_attempts } =
    intermediateResults;

  return (
    <div
      style={{
        fontWeight: 600,
        gap: 5,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Chip
        label={`${attempts ?? 0}번의 시도`}
        color="success"
        variant="outlined"
      />
      {least_attempts && (
        <Chip label={`최소 시도 횟수 ${least_attempts ?? 0} `} color="info" />
      )} */}
      <div style={{ fontSize: "20px" }}>{attempts ?? 0}번의 시도</div>
      {least_attempts && (
        <div style={{ fontSize: "12px", color: "gray" }}>
          최소 시도 횟수 {least_attempts ?? 0}
        </div>
      )}
      {/* <div>Attempts: {attempts}</div>
      <div>Current Depth: {currentDepth}</div>
      <div>Queue Size: {queueSize}</div>
      <div>Visited: {visited}</div> */}
    </div>
  );
}
