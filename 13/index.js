const processFile = require("../processFile");

const leftEntries = [];
const rightEntries = [];
let count = 0;

processFile("input.large.txt", (line) => {
  count++;
  if (count % 3 === 0) {
    return;
  }

  if (count % 3 === 1) {
    return leftEntries.push(JSON.parse(line));
  }

  rightEntries.push(JSON.parse(line));
}).then(() => {
  const indicies = [];
  leftEntries.forEach((entry, index) => {
    const result = compare(entry, rightEntries[index]);
    if (!result) {
      console.log("RESULT UNDEFINED", index + 1);
    }
    if (result === RIGHT_ORDER) {
      indicies.push(index + 1);
    }
  });

  console.log(indicies.reduce((a, b) => a + b, 0));
});

const WRONG_ORDER = 2;
const RIGHT_ORDER = 1;

const compare = (left, right) => {
  // console.log("COMPARE " + JSON.stringify(left) + ' vs ' + JSON.stringify(right))
  if (typeof left === "number" && typeof right === "number") {
    if (left < right) {
      // console.log("  --Left side is smaller, so inputs are in the right order")
      return RIGHT_ORDER;
    }

    if (left > right) {
      // console.log("  --Right side is smaller, so inputs are not in the right order")
      return WRONG_ORDER;
    }
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    const length = right.length > left.length ? right.length : left.length;

    for (let index = 0; index < length; index++) {
      const result = compare(left[index], right[index]);
      if (result) {
        return result;
      }
    }
  }
  if (Array.isArray(left) && !Array.isArray(right)) {
    // console.log("Mixed types; convert right to " + JSON.stringify([right]) + " and retry comparison");
    return compare(left, [right]);
  }
  if (!Array.isArray(left) && Array.isArray(right)) {
    // console.log("Mixed types; convert left to " + JSON.stringify([left]) + " and retry comparison");
    return compare([left], right);
  }
  if (left && !right) {
    // console.log("  --right side ran out of items, so inputs are NOT in the right order")
    return WRONG_ORDER;
  }
  if (right && !left) {
    // console.log("  --Left side ran out of items, so inputs are in the right order")
    return RIGHT_ORDER;
  }
};

// console.log(compare([[8],[2,[8]]], [[],[[0,[0,10,6]],[6]],[7],[[2,[7,2,9,1,4],[8,8,0,2,6]],[3],10,2,[6]],[]]))
