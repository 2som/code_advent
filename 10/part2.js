const processFile = require("../processFile");

let cycles = 0;
let registerX = 1;

const rows = [];
let currentRow = "";

const spriteIsVisible = (cycle, registerX) => {
  const currentDrawingPosition = (cycle - 1) % 40;
  isVisible = [
    currentDrawingPosition - 1,
    currentDrawingPosition,
    currentDrawingPosition + 1,
  ].includes(parseInt(registerX));
  return isVisible;
};

processFile("input1.large.txt", (line) => {
  if (line === "noop") {
    cycles++;
    if (spriteIsVisible(cycles, registerX)) {
      currentRow += "#";
    } else {
      currentRow += ".";
    }
    if (currentRow.length === 40) {
      rows.push(currentRow);
      currentRow = "";
    }
    return;
  }

  const [_, value] = line.split(" ");
  cycles++;
  if (spriteIsVisible(cycles, registerX)) {
    currentRow += "#";
  } else {
    currentRow += ".";
  }
  if (currentRow.length === 40) {
    rows.push(currentRow);
    currentRow = "";
  }
  cycles++;
  if (spriteIsVisible(cycles, registerX)) {
    currentRow += "#";
  } else {
    currentRow += ".";
  }
  if (currentRow.length === 40) {
    rows.push(currentRow);
    currentRow = "";
  }
  registerX += parseInt(value);
}).then(() => {
  console.log(rows);
});
