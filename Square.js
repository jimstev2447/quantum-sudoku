const chalk = require("chalk");
class Square {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.grid = this.getGrid();
    this.possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.settled = false;
  }
  getSquare() {
    if (this.isSettled()) {
      const colour = this.finalState() === "x" ? "red" : "white";
      return ["      ", chalk[colour](`   ${this.finalState()}  `), "      "];
    }
    let square = ["", "", ""];
    let index = 0;
    square.forEach((row, rowIndex) => {
      const colour =
        this.possibilities.length < 2
          ? "green"
          : this.possibilities.length < 7
          ? "yellow"
          : "red";
      for (let col = 0; col < 3; col++) {
        if (this.possibilities[index] !== undefined) {
          square[rowIndex] += chalk[colour](this.possibilities[index] + " ");
        } else {
          square[rowIndex] += "  ";
        }
        index++;
      }
    });
    return square;
  }
  print() {
    let count = 0;
    const printStr = this.possibilities.reduce((acc, cur, index, arr) => {
      count++;
      if (count % 3 === 0) {
        return acc + cur + "\n";
      }
      return acc + cur;
    }, "");
    console.log(printStr);
  }
  getGrid() {
    const { row, col } = this;
    const colVal = Math.floor(col / 3);
    const rowVal = Math.floor(row / 3) * 3;
    return rowVal + colVal;
  }
  collapse(valToColapse) {
    if (valToColapse) {
      this.settled = true;
      this.possibilities = [valToColapse];
      return;
    }
    const random = Math.floor(Math.random() * (this.possibilities.length - 1));
    const outcome = this.possibilities[random];
    this.possibilities = [outcome === undefined ? "x" : outcome];
    this.settled = true;
  }
  isSettled() {
    return this.settled;
  }
  finalState() {
    if (this.possibilities.length === 1) return this.possibilities[0];
    else return 999;
  }
  reducePossibilities(...possibilities) {
    if (this.isSettled()) return;
    this.possibilities = this.possibilities.filter(
      (poss) => !possibilities.includes(poss)
    );
  }
  updateSelf(squares) {
    const notSelf = squares.filter((sq) => sq !== this);
    const otherPossibilities = notSelf.reduce((acc, sq) => {
      const possibilitiesToAdd = sq.possibilities;
      possibilitiesToAdd.forEach((poss) => {
        if (!acc.includes(poss)) acc.push(poss);
      });
      return acc;
    }, []);
    this.possibilities.forEach((remainingPoss) => {
      if (!otherPossibilities.includes(remainingPoss)) {
        this.possibilities = [remainingPoss];
      }
    });
  }
}
module.exports = Square;
