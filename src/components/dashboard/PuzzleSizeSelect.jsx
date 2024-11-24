/**
 * 퍼즐 사이즈 선택 컴포넌트
 *
 * size: 현재 선택된 퍼즐 사이즈
 * changeSize: 퍼즐 사이즈 변경 함수. ex) changeSize(3)
 */
export default function PuzzleSizeSelect({ size, changeSize }) {
  const handleSizeChange = (event) => {
    const selectedSize = parseInt(event.target.value, 10);
    changeSize(selectedSize);
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <label htmlFor="puzzle-size-select" style={{ marginRight: 10, fontSize: 16 }}>
        퍼즐 사이즈 선택:
      </label>
      <select
        id="puzzle-size-select"
        value={size}
        onChange={handleSizeChange}
        style={{ padding: 5, fontSize: 16 }}
      >
        <option value={3}>3 x 3</option>
        <option value={4}>4 x 4</option>
        <option value={5}>5 x 5</option>
        <option value={6}>6 x 6</option>
        <option value={7}>7 x 7</option>
      </select>
    </div>
  );
}
