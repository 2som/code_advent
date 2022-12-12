class MonkeyMadness {
  constructor(monkeys) {
    this.monkeys = monkeys;
  }

  foolAround = (maxRounds) => {
    for (let round = 0; round < maxRounds; round++) {
      this.monkeys.forEach((monke) => {
        while (monke.hasItems()) {
          const inspectedItem = monke.inspectItem();
          const itemAfterPlaying = monke.play(inspectedItem);
          const { target, item } = monke.throw(
            itemAfterPlaying
          );
          this.monkeys.find((m) => m.id === target).catch(item);
        }
      });

      if ([1, 20, 300, 1000, 2000, 3000, 4000, 5000, 10000].includes(round +1)) {
        console.log(`\nROUND: ${round +1}\n`)
        this.monkeys.forEach(m => {
          console.log(`Monkey ${m.id} inspected items ${m.inspectionCount} times.`)
        })
      }
    }
  };

  getMostActiveMonkeys = (monkeyCount) => {
    return this.monkeys
    .sort((a, b) => b.inspectionCount - a.inspectionCount)
    .slice(0, monkeyCount)
  }

}

module.exports = MonkeyMadness;
