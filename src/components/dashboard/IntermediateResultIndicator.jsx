const style = {
  container: {
    fontWeight: 600,
    gap: 5,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default function IntermediateResultIndicator({ intermediateResults }) {
  const { attempts, currentDepth, queueSize, visited, least_attempts, time } =
    intermediateResults;

  return (
    <div style={style.container}>
      <div style={{ fontSize: "20px" }}>{visited ?? 0}번의 시도</div>
      {least_attempts && (
        <div style={{ fontSize: "12px", color: "gray" }}>
          최소 시도 횟수 {least_attempts ?? 0}
        </div>
      )}
      {time && (
        <div style={{ fontSize: "12px", color: "gray" }}>
          경과 시간 {time ? Math.round(time * 100) / 100 : 0}ms
        </div>
      )}
    </div>
  );
}
