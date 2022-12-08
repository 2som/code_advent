const fs = require("fs");
const readline = require("readline");

const processFile = async (filename, onReadLine) => {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    onReadLine(line);
  }
}

module.exports = processFile