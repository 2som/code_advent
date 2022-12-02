const fs = require("fs");
const readline = require("readline");

const processFile = async () => {
  const fileStream = fs.createReadStream("input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const calories = [];

  for await (const line of rl) {
    calories.push(line);
  }

  return calories;
};

const processCaloriesByElf = (calories) =>
  calories.reduce(
    (caloriesByElf, calory) => {
      if (calory === "") {
        return [...caloriesByElf, { calories: 0 }];
      }

      const currentElf = caloriesByElf[caloriesByElf.length - 1];

      return [
        ...caloriesByElf.slice(0, -1),
        { calories: currentElf.calories + parseInt(calory) },
      ];
    },
    [{ calories: 0 }]
  );

const getElvesWithMaxCalories = (elves, elvesCount) =>
  elves
    .map(({ calories }) => calories)
    .sort((a, b) => b - a)
    .slice(0, elvesCount);

const sumArray = (arr) => arr.reduce((total, curr) => total + curr, 0);

processFile()
  .then(processCaloriesByElf)
  .then((calories) => getElvesWithMaxCalories(calories, 3))
  .then(sumArray)
  .then(console.log);
