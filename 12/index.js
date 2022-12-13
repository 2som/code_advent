const processFile = require("../processFile");

const grid = [];

const generateCharWeightArray = (from, length, startingIndex) =>
  Array.from({ length: length }, (_, i) =>
    String.fromCharCode(from.charCodeAt(0) + i)
  ).map((char, index) => ({ character: char, weight: startingIndex + index }));

const weightChar = generateCharWeightArray("a", 26, 1).reduce(
  (acc, curr) => ({ ...acc, [curr.character]: curr.weight }),
  { S: 1, E: 26 }
);


const findStartingPoint = (grid, staringSymbol) => {
  for (let rows = 0; rows < grid.length; rows++) {
    for (let columns = 0; columns < grid[rows].length; columns++) {
      const node = grid[rows][columns];
      if (node === staringSymbol) {
        return {
          x: columns,
          y: rows,
          symbol: node,
        };
      }
    }
  }
};

processFile("input.large.txt", (line) => grid.push(line.split(""))).then(() =>
  climbing(findStartingPoint(grid, 'E'), grid, ['a', 'S'], 'down')
);

const climbing = (startingPoint, grid, endPointSymbols, type) => {
  let queue = [];
  let path = [];
  const { x, y, symbol } = startingPoint;
  queue.push({
    x,
    y,
    parent: null,
    pathLength: 0,
    symbol,
  });

  path.push({
    x,
    y,
    parent: null,
    pathLength: 0,
    symbol,
  })

  let end;

  while (queue.length && !end) {
    const { x, y, pathLength, symbol } = queue.shift();
    const nodeWeight = weightChar[symbol];
    [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].forEach((direction) => {
      const [x1, y1] = direction;
      if (!grid?.[y1]?.[x1]) {
        return;
      }

      const distance = weightChar[grid[y1][x1]] - nodeWeight;
      const isReachable = type == 'down' ? distance >= -1 : distance <=1;

      if ((isReachable) ) {
        const discoveredNode = {
          x: x1,
          y: y1,
          parent: { x, y, symbol, pathLength },
          pathLength: pathLength + 1,
          symbol: grid[y1][x1],
        };

        if (endPointSymbols.includes(discoveredNode.symbol)) {
            end = discoveredNode;
            return;
        }
        

        if (!path.find(({ x, y }) => x1 === x && y1 === y)) {
          queue.push(discoveredNode);
          path.push(discoveredNode);
        }
      }
    });
  }

  console.log(end);
};
