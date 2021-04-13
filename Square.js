class Square {
  constructor(row, col, size) {
    this.row = row;
    this.col = col;
    this.grid = this.getGrid(size);
    this.possibilities = this.generatePossibilities(size);
    this.settled = false;
  }
  generatePossibilities(size) {
    const poss = [];
    for (let i = 1; i <= size * size; i++) {
      poss.push(i);
    }
    return poss;
  }
  getGrid(size) {
    const { row, col } = this;
    const colVal = Math.floor(col / size);
    const rowVal = Math.floor(row / size) * size;
    return rowVal + colVal;
  }
  collapse(valToCollapse) {
    if (valToCollapse) {
      this.possibilities = [valToCollapse];
    } else {
      const random = Math.floor(
        Math.random() * (this.possibilities.length - 1)
      );
      const outcome = this.possibilities[random];
      this.possibilities = [typeof outcome !== "number" ? 0 : outcome];
    }
    this.settled = true;
  }
  reducePossibilities(row, col, grid) {
    const allSettled = [...row, ...col, ...grid]
      .filter((sq) => sq.isSettled())
      .map((sq) => sq.possibilities[0]);
    this.possibilities = this.possibilities.filter(
      (num) => !allSettled.includes(num)
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
  narrow(...nums) {
    if (this.isSettled()) return;
    this.possibilities = this.possibilities.filter(
      (poss) => !nums.includes(poss)
    );
  }
  getSquare() {
    return this.possibilities;
  }
  isSettled() {
    return this.settled;
  }
}
module.exports = Square;
