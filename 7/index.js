const fs = require("fs");
const readline = require("readline");

async function processText(filename) {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentPath = "";
  const files = [];
  const directories = [];

  for await (const line of rl) {
    if (line.startsWith("$ cd")) {
      const newDestination = line.split(" ")[2];
      if (newDestination === "/") {
        currentPath = "";
      } else if (newDestination === "..") {
        currentPath = currentPath.slice(0, currentPath.lastIndexOf("/"));
      } else {
        currentPath += `/${newDestination}`;
      }
    } else if (!line.startsWith("$") && !line.startsWith("dir")) {
      const [size, name] = line.split(" ");
      const absPath = `${currentPath}/${name}`;
      if (!Object.keys(files).includes(absPath)) {
        files.push({ path: `${currentPath}/${name}`, size });
      }
    } else if (line.startsWith("dir")) {
      const [_, name] = line.split(" ");
      const absPath = `${currentPath}/${name}`;
      if (!directories.includes(absPath)) {
        directories.push(`${currentPath}/${name}`);
      }
    }
  }

  const sizePerDirectory = directories.reduce((allDirs, dir) => {
    const totalSize = files
      .filter(({ path }) => path.startsWith(dir))
      .reduce(
        (totalSize, currentFile) => totalSize + parseInt(currentFile.size),
        0
      );
    return {...allDirs, [dir]: totalSize }
  }, {});

  const maxSpace = 70_000_000;
  const spaceTaken = files.map(f => f.size).reduce((a, b) => a+ parseInt(b), 0);
  const availableSpace = maxSpace - spaceTaken;
  const toFree = 30000000;
  const targetToDelete = toFree - availableSpace;
  console.log(Object.entries(sizePerDirectory).filter(([dir, size]) => size >= targetToDelete).sort((a, b) => a-b));
}

processText("input.txt");
