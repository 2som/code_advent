const processFile = require("../processFile");

const applyInstruction = (instruction, arg) => {
  const instructionMapper = {
    noop: noop,
    addx: addx,
  };

  return instructionMapper[instruction](arg);
};

const addx = (arg) => (cycle, registerValue) => {
  const registerValues = {};
  for (let index = 1; index < 3; index++) {
    registerValues[cycle + index] = registerValue;
  }
  return {
    ...registerValues,
    registerValue: registerValue + arg,
    cycle: cycle + 2,
  };
};

const noop = (arg) => (cycle, registerValue) => {
  return {
    [cycle + 1]: registerValue,
    registerValue,
    cycle: cycle + 1,
  };
};

const lines = [];

const interpretLines = (lines) => {
  return lines.reduce(
    ({ cycle, registerX, registerValuePerCycle }, line) => {
      const [instruction, args] = line.split(" ");
      const state = applyInstruction(instruction, args && parseInt(args))(
        cycle,
        registerX
      );

      const {
        cycle: updatedCycle,
        registerValue,
        ...newRegisterPerCycleValues
      } = state;

      return {
        cycle: updatedCycle,
        registerX: registerValue,
        registerValuePerCycle: {
          ...registerValuePerCycle,
          ...newRegisterPerCycleValues,
        },
      };
    },
    { registerX: 1, cycle: 0, registerValuePerCycle: { 0: 1 } }
  );
};

const sumUpSignalValuesForCycles = (cycles, registerValuePerCycle) => {
    return cycles.reduce((signalValue, cycle) => {
        return signalValue + registerValuePerCycle[cycle] * cycle;
      }, 0);
}

processFile("input1.large.txt", (line) => {
  lines.push(line);
})
  .then(() => interpretLines(lines))
  .then(({ registerValuePerCycle }) => sumUpSignalValuesForCycles([20, 60, 100, 140, 180, 220], registerValuePerCycle))
  .then(console.log);
