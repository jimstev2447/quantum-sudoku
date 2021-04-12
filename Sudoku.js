const Square = require("./Square");
const { sleep } = require("./utils");
class Sudoku {
  constructor() {
    this.generateSquares();
    this.state = "settled";
    this.selectedSquare = null;
    this.previousBoards = [];
    this.decisions = 0;
    this.numberOfPossibilities = 0;
    this.isCorrect = true;
  }
  generateSquares() {
    const squares = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        squares.push(new Square(row, col));
      }
    }
    this.squares = squares;
  }
  getSquares() {
    return this.squares;
  }
  collapseNextWave() {
    if (this.allSettled) return;
    const possibleSquares = this.squares.filter((sq) => !sq.isSettled());
    const smallestPossibilities = Math.min(
      ...possibleSquares.map((sq) => sq.possibilities.length)
    );
    const suitableSquares = possibleSquares.filter(
      (sq) => sq.possibilities.length === smallestPossibilities
    );
    const selectedSquareToCollapse =
      suitableSquares[Math.floor(Math.random() * suitableSquares.length)];

    this.selectedSquare = selectedSquareToCollapse;

    if (smallestPossibilities > 1) {
      this.allSettled = true;
      this.decisions++;
      this.numberOfPossibilities = suitableSquares.length;
      this.saveBoard();
      //sleep(1000);
      return;
    }
    selectedSquareToCollapse.collapse();
    this.allSettled = this.squares.every((sq) => sq.isSettled() === true);
    this.state = "collapsed";
  }
  reducePossibilities(square = this.selectedSquare) {
    const { affectedRow, affectedCol, affectedGrid } = this.getAffectedSquares(
      square
    );
    const areasToCheck = [affectedRow, affectedCol, affectedGrid];
    areasToCheck.forEach((area) => {
      const settledNums = area
        .filter((sq) => sq.isSettled())
        .map((sq) => sq.finalState());
      area.forEach((sq) => {
        sq.reducePossibilities(...settledNums);
      });
    });

    this.state = "settled";
  }
  checkSinglePossibilities() {
    this.squares.forEach((sq) => {
      const {
        affectedRow,
        affectedCol,
        affectedGrid,
      } = this.getAffectedSquares(sq);
      if (!sq.isSettled()) {
        sq.updateSelf(affectedRow);
        sq.updateSelf(affectedCol);
        sq.updateSelf(affectedGrid);
      }
    });
    this.state = "checkAreas";
  }
  getAffectedSquares(square) {
    return this.squares.reduce(
      (acc, sq) => {
        const { row, col, grid } = square;
        if (sq.row === row) acc.affectedRow.push(sq);
        if (sq.col === col) acc.affectedCol.push(sq);
        if (sq.grid === grid) acc.affectedGrid.push(sq);
        return acc;
      },
      {
        affectedRow: [],
        affectedCol: [],
        affectedGrid: [],
      }
    );
  }
  checkArea(area) {
    const lookup = {};
    area.forEach((square) => {
      const possibilities = square.possibilities.join("");
      if (lookup.hasOwnProperty(possibilities))
        lookup[possibilities].push(square);
      else lookup[possibilities] = [square];
    });

    for (const [possStr, squares] of Object.entries(lookup)) {
      if (possStr.length === squares.length) {
        const otherSquares = area.filter((sq) => !squares.includes(sq));
        this.otherSquares = otherSquares;

        otherSquares.forEach((sq) =>
          sq.reducePossibilities(...possStr.split("").map((n) => +n))
        );
      }
    }
  }
  next() {
    if (this.state === "settled") {
      this.state = "checkingSingle";
      this.checkSinglePossibilities();
    } else if (this.state === "checkAreas") {
      this.state === "checkingAreas";
      this.checkAreas();
    } else if (this.state === "readyToCollapse") {
      this.state = "collapsing";
      this.collapseNextWave();
      this.checkAccuracy();
    } else if (this.state === "collapsed") {
      this.state === "inspecting";
      this.reducePossibilities();
    }
    this.checkAccuracy();
  }
  checkAreas() {
    for (let i = 0; i < 9; i++) {
      const row = this.squares.filter((sq) => sq.row === i);
      this.checkArea(row);
      const col = this.squares.filter((sq) => sq.col === i);
      this.checkArea(col);
      const grid = this.squares.filter((sq) => sq.grid === i);
      this.checkArea(grid);
    }
    this.state = "readyToCollapse";
  }
  checkAccuracy() {
    const toCheck = ["row", "col", "grid"];
    toCheck.forEach((targetToCheck) => {
      for (let i = 0; i < 9; i++) {
        const squaresInTarget = this.squares.filter(
          (sq) => sq[targetToCheck] === i
        );
        const finalStates = squaresInTarget.reduce(
          (acc, sq) => (sq.isSettled() ? [...acc, sq.finalState()] : acc),
          []
        );
        finalStates.sort();
        if (finalStates.includes("x")) {
          this.isCorrect = false;
        }
        finalStates.forEach((n, index, arr) => {
          if (n === arr[index - 1]) {
            this.isCorrect = false;
          }
        });
      }
    });
    if (!this.isCorrect) {
      this.squares = this.previousBoards[0].board;
      this.isCorrect = true;
    }
  }
  updateSquare(row, col, value) {
    const square = this.squares.find((sq) => sq.row === row && sq.col === col);
    square.collapse(value);
    this.reducePossibilities(square);
    this.checkAreas();
    this.checkSinglePossibilities();
    this.state = "settled";
  }
  saveBoard() {
    const boardCopy = this.squares.map(
      ({ row, col, possibilities, settled }) => {
        const sqCopy = new Square(row, col);
        sqCopy.possibilities = possibilities;
        sqCopy.settled = settled;
        return sqCopy;
      }
    );
    this.previousBoards.push({ board: boardCopy, square: this.selectedSquare });
  }
}

module.exports = Sudoku;
