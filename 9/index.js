const processFile = require("../processFile");

const lines = [];

const positions = new Array(10).fill(0).map(() => ({ x: 0, y: 0 }));

const tailVisited = new Set();

const simulateMovement = (positions, instructions) =>
  instructions.reduce((positions, instruction) => {
    const formattedInstruction = formatInstruction(instruction);
    const updatedPositions = interpretInstruction(
      formattedInstruction,
      positions
    );
    return updatedPositions;
  }, positions);

const formatInstruction = (line) => {
  const [direction, steps] = line.split(" ");
  return { direction, steps: parseInt(steps) };
};

const moveRight = (position) => ({ ...position, x: position.x + 1 });
const moveLeft = (position) => ({ ...position, x: position.x - 1 });
const moveTop = (position) => ({ ...position, y: position.y + 1 });
const moveBottom = (position) => ({ ...position, y: position.y - 1 });

const directions = {
  D: moveBottom,
  U: moveTop,
  L: moveLeft,
  R: moveRight,
};

const interpretInstruction = (instruction, positions) => {
  const tmpPositions = [...positions];
  const { direction, steps } = instruction;
  const move = directions[direction];

  for (let step = 0; step < steps; step++) {
    tmpPositions[0] = move(tmpPositions[0]);

    for (let index = 1; index < tmpPositions.length; index++) {
      if (!isTouching(tmpPositions[index -1], tmpPositions[index])) {
        tmpPositions[index] = moveKnot(tmpPositions[index -1], tmpPositions[index])
      }
      
    }
    tailVisited.add(`${tmpPositions[tmpPositions.length - 1].x}, ${tmpPositions[tmpPositions.length - 1].y}`)
  }

  return tmpPositions;
};

const isTouching = (knot1, knot2) => {
  let xDiff = Math.abs(knot1.x - knot2.x);
  let yDiff = Math.abs(knot1.y - knot2.y);
  return xDiff <= 1 && yDiff <= 1;
};

const moveKnot = (knot1, knot2) => {
  let newPos = { ...knot2 };
  let xDiff = knot2.x - knot1.x;
  let yDiff = knot2.y - knot1.y;

  if (xDiff > 0) newPos.x--;
  else if (xDiff < 0) newPos.x++;
  if (yDiff > 0) newPos.y--;
  else if (yDiff < 0) newPos.y++;

  return newPos;
};

processFile("input.txt", (line) => lines.push(line))
  .then(() => simulateMovement(positions, lines))
  .then(console.log)
  .then(() => console.log(tailVisited.size, "SIZE"))

