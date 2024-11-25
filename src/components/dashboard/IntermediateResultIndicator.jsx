import { Chip } from "@mui/material";

export default function IntermediateResultIndicator({ intermediateResults }) {
  const { attempts, currentDepth, queueSize, visited, least_attempts } =
    intermediateResults;

  return (
    <div style={{ fontWeight: 600, gap: 5, display: "flex" }}>
      <Chip
        label={`${attempts ?? 0}번의 시도`}
        color="success"
        variant="outlined"
      />
      {least_attempts && (
        <Chip label={`최소 시도 횟수 ${least_attempts ?? 0} `} color="info" />
      )}
      {/* <div>Attempts: {attempts}</div>
      <div>Current Depth: {currentDepth}</div>
      <div>Queue Size: {queueSize}</div>
      <div>Visited: {visited}</div> */}
    </div>
  );
}
