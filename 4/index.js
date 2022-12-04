const fs = require("fs");
const readline = require("readline");

const processFile = async (name) => {
  const fileStream = fs.createReadStream(name);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const assignemnts = [];

  for await (const pair of rl) {
    const [first, second] = pair.split(",");

    const firstElvenAssignment = range(
      ...first.split("-").map((val) => parseInt(val))
    );
    const secondElvenAssignment = range(
      ...second.split("-").map((val) => parseInt(val))
    );

    areIntersecting(firstElvenAssignment, secondElvenAssignment)
      ? assignemnts.push({
          firstElven: first,
          secondElven: second,
          isOverlapping: true,
        })
      : assignemnts.push({
          firstElven: first,
          secondElven: second,
          isOverlapping: false,
        });
  }

  return assignemnts;
};

const areIntersecting = (array1, array2) =>
    isIntersecting(array1, array2) || isIntersecting(array2, array1);

const isIntersecting = (array, subArray) =>
  array.some((val) => subArray.includes(val));

const range = (from, to) => [...Array(to + 1 - from)].map((_, i) => i + from);

const countOverlapping = (assignments) => assignments.filter(({ isOverlapping }) => isOverlapping).length;

processFile("input.txt")
    .then(countOverlapping)
    .then(console.log);
