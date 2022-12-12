const Monkey = require("./Monkey");
const Item = require("./Item");

const processFile = require("../processFile");
const MonkeyMadness = require("./MonkeyMadness");

const operation = (type, number) => {
  switch (type) {
    case "*":
      return (x) => (isNaN(number) ? x * x : x * number);
    case "+":
      return (x) => (isNaN(number) ? x + x : x + number);
    default:
      throw `Undefined operation type ${type}`;
  }
};

const test = (trueTarget, falseTarget, divisibleCheck) => {
  return (x) => (x % divisibleCheck === 0 ? trueTarget : falseTarget);
};

const monkeys = [];

let currentMonkey = {};

processFile("input.txt", (line) => {
  if (line.startsWith("Monkey")) {
    currentMonkey.id = parseInt(line.slice(0, -1).split(" ")[1]);
  }

  if (line.trim().startsWith("Starting items")) {
    currentMonkey.items = line
      .replace("Starting items: ", "")
      .split(",")
      .map((item) => parseInt(item));
  }

  if (line.trim().startsWith("Operation")) {
    const [type, number] = line.split(" ").slice(-2);
    currentMonkey.operation = operation(type, parseInt(number));
  }

  if (line.trim().startsWith("Test")) {
    currentMonkey.divisibleCheck = parseInt(line.slice(-2));
  }

  if (line.trim().startsWith("If true")) {
    currentMonkey.truthyTarget = parseInt(line.slice(-1));
  }

  if (line.trim().startsWith("If false")) {
    currentMonkey.falsyTarget = parseInt(line.slice(-1));
  }

  if (line.trim().length === 0) {
    monkeys.push(currentMonkey);
    currentMonkey = {};
  }
})
  .then(() => {
    return monkeys.map((monke) => {
      return new Monkey(
        monke.id,
        monke.items.map((value) => new Item(value)),
        monke.operation,
        test(monke.truthyTarget, monke.falsyTarget, monke.divisibleCheck),
        monkeys.reduce((a, b) => a * b.divisibleCheck, 1)
      );
    });
  })
  .then((monkeys) => {
    const maxRounds = 10_000;
    const activeMonkeysCount = 2;
    const madness = new MonkeyMadness(monkeys);
    madness.foolAround(maxRounds);
    const mostActive = madness.getMostActiveMonkeys(activeMonkeysCount);
    console.log(mostActive.map(m => m.inspectionCount));

    console.log(mostActive.reduce((a, b) => a * b.inspectionCount, 1));
  });
