const fs = require("fs");
const readline = require("readline");

async function processText(filename) {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    return line;
  }
}

const processSingal = (signal, distinctMessageLength) => {
  for (let index = 0; index < signal.length - distinctMessageLength; index++) {
    const currentChunk = [
      ...signal.slice(index, index + distinctMessageLength),
    ];
    
    if (isDistinct(currentChunk)) {
      return index + distinctMessageLength;
    }
  }
};

const isDistinct = (buffer) =>
  buffer.length ===
  buffer.filter((char, position) => buffer.indexOf(char) === position).length;

processText("input.txt")
  .then((signal) => processSingal(signal, 14))
  .then(console.log);
