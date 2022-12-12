const Item = require('./Item');

class Monkey {
  constructor(id, items, operation, test, modulo) {
    this.id = id;
    this.items = items;
    this.operation = operation;
    this.test = test;
    this.inspectionCount = 0;
    this.modulo = modulo;
  }

  hasItems = () => {
    return this.items.length > 0;
  };

  inspectItem = () => {
    this.inspectionCount++;
    const item = this.items.shift();
    // console.log(`Monkey ${this.id} inspects an item with a worry level of ${item.value}.`)
    return item;
  };

  play = (item) => {
    const afterPlaying = new Item(this.operation(item.value) % this.modulo);
    // console.log(`Worry level is multiplied to ${afterPlaying.value}`)
    return afterPlaying;
  };

  throw = (item) => {
    const targetId = this.test(item.value);

    // console.log(`Item with worry level ${item.value} is thrown to monkey ${targetId} \n`)
    return { target: targetId, item };
  };

  catch = (item) => this.items.push(item);

}


module.exports = Monkey;