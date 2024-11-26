import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
    <Box sx={{ flexGrow: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="puzzle-size-select-label">Puzzle Size</InputLabel>
        <Select
          labelId="puzzle-size-select-label"
          id="puzzle-size-select"
          value={size}
          onChange={handleSizeChange}
        >
          <MenuItem value={3}>3 x 3</MenuItem>
          <MenuItem value={4}>4 x 4</MenuItem>
          <MenuItem value={5}>5 x 5</MenuItem>
          <MenuItem value={6}>6 x 6</MenuItem>
          <MenuItem value={7}>7 x 7</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
