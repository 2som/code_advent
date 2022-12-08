const processFile = require("../processFile");

const getVisibleTrees = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const tree = grid[row][col];

      const scenicScore =
        lookUp(grid, row, col, tree.height) *
        lookLeft(grid, row, col, tree.height) *
        lookRight(grid, row, col, tree.height) *
        lookBottom(grid, row, col, tree.height);

      tree.scenicScore = scenicScore;
    }
  }

  return grid;
};

const getLargestScenicScore = (grid) => grid.flat().reduce((bestScore, tree) => bestScore > tree.scenicScore ? bestScore : tree.scenicScore, 0)

const countVisibleTrees = (grid) =>
  grid
    .map((v) => v.filter((t) => t.visible))
    .reduce((count, row) => count + row.length, 0);

const isOnEdge = (grid, row, col) =>
  !grid[row - 1] ||
  !grid[row + 1] ||
  !grid[row][col - 1] ||
  !grid[row][col + 1];

const lookUp = (grid, row, col, treeHeight) => {
  let screnicCount = 0;
  for (let topTraverse = row - 1; topTraverse >= 0; topTraverse--) {
    screnicCount++;
    const searchedTree = grid[topTraverse][col];
    if (searchedTree.height >= treeHeight) {
      break;
    }
  }
  return screnicCount;
};

const lookBottom = (grid, row, col, treeHeight) => {
  let screnicCount = 0;
  for (let topTraverse = row + 1; topTraverse < grid.length; topTraverse++) {
    screnicCount++;
    const searchedTree = grid[topTraverse][col];
    if (searchedTree.height >= treeHeight) {
      break;
    }
  }
  return screnicCount;
};

const lookLeft = (grid, row, col, treeHeight) => {
  let screnicCount = 0;
  for (let topTraverse = col - 1; topTraverse >= 0; topTraverse--) {
    screnicCount++;
    const searchedTree = grid[row][topTraverse];
    if (searchedTree.height >= treeHeight) {
      break;
    }
  }
  return screnicCount;
};

const lookRight = (grid, row, col, treeHeight) => {
  let screnicCount = 0;
  for (
    let topTraverse = col + 1;
    topTraverse < grid[row].length;
    topTraverse++
  ) {
    screnicCount++;
    const searchedTree = grid[row][topTraverse];
    if (searchedTree.height >= treeHeight) {
      break;
    }
  }
  return screnicCount;
};

const grid = [];

processFile("input2.txt", (line) =>
  grid.push(
    line
      .split("")
      .map((height) => ({ height: parseInt(height), visible: false }))
  )
)
  .then(() => getVisibleTrees(grid))
  .then(getLargestScenicScore)
  .then(console.log);
