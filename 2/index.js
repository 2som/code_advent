const fs = require("fs");
const readline = require("readline");

const processFile = async (name) => {
  const fileStream = fs.createReadStream(name);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const playHistory = [];

  for await (const line of rl) {
    const [play1, play2] = line.split(" ");
    playHistory.push({ play1, play2 });
  }
  return playHistory;
};

const expectedResultMap = {
    "X": 'lose',
    "Y": 'draw',
    "Z": 'win'
}

const figures = {
  A: {
    name: "rock",
    points: 1,
    beats: ["sissors"],
  },

  B: {
    name: "paper",
    points: 2,
    beats: ["rock"],
  },
  C: {
    name: "sissors",
    points: 3,
    beats: ["paper"],
  },
};

const possiblePoints = {
  win: 6,
  draw: 3,
  lose: 0,
};

const rockPaperScissors = (playHistory) => playHistory.reduce((gameResult, currentPlay) => {
    const { play1, play2 } = currentPlay;
    const play1Figure = resolvePlayFigure(play1);
    const expectedResult = resolveExpectedResult(play2);
    const play2Figure = pickFigureToMatchExpectedResult(play1Figure, expectedResult)
    return play(play1Figure, play2Figure, gameResult);
}, { player1: 0, player2: 0 })


const resolvePlayFigure = (move) => {
    return figures[move] || figures.A;
};

const resolveExpectedResult = (move) => expectedResultMap[move] || "lose";

const pickFigureToMatchExpectedResult = (play1Figure, expectedResult) => {
    if (expectedResult === 'draw') {
        return play1Figure;
    }
    if (expectedResult === 'win') {
        return Object.values(figures).find(play => play.beats.includes(play1Figure.name))
    }

    return Object.values(figures).find(play => !play.beats.includes(play1Figure.name) && play.name !== play1Figure.name)
}

const play = (play1, play2, currentGameResult) => {
  const { player1, player2 } = currentGameResult;

  if (play1Wins(play1, play2)) {
    return {
      player1: player1 + play1.points + getPointsFor("win"),
      player2: player2 + play2.points,
    };
  }

  if (play2Wins(play1, play2)) {
    return {
      player1: player1 + play1.points,
      player2: player2 + play2.points + getPointsFor("win"),
    };
  }

  return {
    player1: player1 + play1.points + getPointsFor("draw"),
    player2: player2 + play2.points + getPointsFor("draw"),
  };
};

const play1Wins = (play1, play2) => play1.beats.includes(play2.name);

const play2Wins = (play1, play2) => play2.beats.includes(play1.name);

const getPointsFor = (result) => possiblePoints[result];


processFile("input.txt").then(rockPaperScissors).then(console.log);
