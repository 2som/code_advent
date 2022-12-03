const fs = require("fs");
const readline = require("readline");

const processFile = async (name) => {
  const fileStream = fs.createReadStream(name);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rucsacks = [];

  for await (const rucksack of rl) {
    rucsacks.push(rucksack);
  }

  return rucsacks;
};

const organizeRucsacksInGroupsOf = (groupCount) => (rucksacks) => {
  let group = [];
  return rucksacks.reduce((groups, rucksack, position) => {
    group.push(rucksack);
    if ((position + 1) % groupCount === 0) {
      groups.push(group);
      group = [];
    }
    return groups;
  }, []);
};

const findGroupBadge = (group) => {
  const unpackedGroup = group.reduce(
    (unpacked, currentRucksack) => [...unpacked, ...currentRucksack],
    []
  ).join('');

  let badge;

  for (let index = 0; index < unpackedGroup.length; index++) {
    const char = unpackedGroup[index];
    if (group.every(group => group.includes(char))) {
        badge = char;
        break;
    }
  }

  return badge;
};


const sumOfPriorities = (badges) => {
  const weightMap = generateWeightMap();
  return badges.map((badge) => weightMap[badge]).reduce(add, 0);
};

const generateWeightMap = () =>
  [
    ...generateCharWeightArray("a", 26, 1),
    ...generateCharWeightArray("A", 26, 27),
  ].reduce((dict, entry) => ({ ...dict, [entry.character]: entry.weight }), {});

const generateCharWeightArray = (from, length, startingIndex) =>
  Array.from({ length: length }, (_, i) =>
    String.fromCharCode(from.charCodeAt(0) + i)
  ).map((char, index) => ({ character: char, weight: startingIndex + index }));

const add = (a, b) => a + b;

processFile("input.txt")
    .then(organizeRucsacksInGroupsOf(3))
    .then((groups) => groups.map(findGroupBadge))
    .then(sumOfPriorities)
    .then(console.log)
