const Square = require("./Square");
class Sudoku {
  constructor(gridSize) {
    this.size = gridSize;
    this.gridSize = gridSize;
    this.squares = this.generateSquares(gridSize);
    this.state = "readyToCollapse";
    this.lastCollapsedSquare = null;
    this.rows = this.generateAreas("row");
    this.cols = this.generateAreas("col");
    this.grids = this.generateAreas("grid");
    this.state = "readyToCollapse";
    this.decisions = 0;
  }
  generateAreas(area) {
    const areas = {};
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      areas[i] = this.squares.filter((sq) => sq[area] === i);
    }
    return areas;
  }
  generateSquares(size) {
    const squares = [];
    for (let row = 0; row < size * size; row++) {
      for (let col = 0; col < size * size; col++) {
        squares.push(new Square(row, col, size));
      }
    }
    return squares;
  }
  collapseNextWave() {
    const square = this.findSquareToCollapse();
    if (square !== undefined) {
      const poss = square.possibilities.length;
      square.collapse();
      this.lastCollapsedSquare = square;

      this.state = "collapsed";
    } else {
      this.allSettled = true;
    }
  }
  findSquareToCollapse() {
    const possibleSquares = this.squares.filter((sq) => !sq.isSettled());
    const smallestPossibilities = Math.min(
      ...possibleSquares.map((sq) => sq.possibilities.length)
    );
    const suitableSquares = possibleSquares.filter(
      (sq) => sq.possibilities.length === smallestPossibilities
    );
    if (suitableSquares.length > 1 && smallestPossibilities > 1) {
      this.decisions++;
    }
    const selectedSquareToCollapse =
      suitableSquares[Math.floor(Math.random() * suitableSquares.length)];

    return selectedSquareToCollapse;
  }
  reducePossibilities(square = this.lastCollapsedSquare) {
    const affectedSquares = this.getAffectedSquares(square);
    affectedSquares.forEach((sq) => {
      const poss = sq.possibilities.length;
      sq.reducePossibilities(
        this.rows[sq.row],
        this.cols[sq.col],
        this.grids[sq.grid]
      );
      if (poss > sq.possibilities.length) {
        if (square !== this.lastCollapsedSquare) this.recursiveReductions++;
        this.reducePossibilities(sq);
      }
    });
  }
  checkSpecialRow() {
    const areas = ["rows", "cols", "grids"];
    areas.forEach((area) => {
      for (const row in this[area]) {
        const squaresToCheck = this[area][row];
        for (let i = 1; i <= 9; i++) {
          const squaresThatShare = squaresToCheck.filter((square) =>
            square.possibilities.includes(i)
          );
          if (squaresThatShare.length > 1) {
            const grid = squaresThatShare[0].grid;
            const row = squaresThatShare[0].row;
            const col = squaresThatShare[0].col;
            const shareGrid = squaresThatShare.every((sq) => sq.grid === grid);
            const shareRow = squaresThatShare.every((sq) => sq.row === row);
            const shareCol = squaresThatShare.every((sq) => sq.col === col);
            if (shareGrid) {
              const notThose = this.grids[grid].filter(
                (sq) => !squaresThatShare.includes(sq)
              );
              notThose.forEach((sq) => sq.narrow(i));
            }
            if (shareRow) {
              const notThose = this.rows[row].filter(
                (sq) => !squaresThatShare.includes(sq)
              );
              notThose.forEach((sq) => sq.narrow(i));
            }
            if (shareCol) {
              const notThose = this.cols[col].filter(
                (sq) => !squaresThatShare.includes(sq)
              );
              notThose.forEach((sq) => sq.narrow(i));
            }
          }
        }
      }
    });
  }
  squaresCheckSelves() {
    this.squares.forEach((sq) => {
      const { row, col, grid, possibilities } = sq;
      const { rows, cols, grids } = this;
      const test = possibilities.length;
      sq.updateSelf(rows[row]);
      sq.updateSelf(cols[col]);
      sq.updateSelf(grids[grid]);
      if (test !== sq.possibilities.length) this.selfCheckingWorked++;
    });
  }
  getAffectedSquares(square) {
    return this.squares.filter((sq) => {
      return (
        !sq.isSettled() &&
        sq !== square &&
        (sq.row === square.row ||
          sq.col === square.col ||
          sq.grid === square.grid)
      );
    });
  }
  getSquares() {
    return this.squares;
  }
  checkAreas() {
    for (const grid in this.grids) {
      this.checkArea(this.grids[grid]);
      this.checkForHiddenPair(this.grids[grid]);
    }
    for (const row in this.rows) {
      this.checkArea(this.rows[row]);
      this.checkForHiddenPair(this.rows[row]);
    }
    for (const col in this.cols) {
      this.checkArea(this.cols[col]);
      this.checkForHiddenPair(this.cols[col]);
    }
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
        otherSquares.forEach((sq) => {
          const poss = sq.possibilities.length;
          sq.narrow(...possStr.split("").map((n) => +n));
          if (poss > sq.possibilities.length) this.areaCheckReductions++;
        });
      }
    }
  }
  next() {
    switch (this.state) {
      case "readyToCollapse":
        this.collapseNextWave();
        this.state = "collapsed";
        break;
      case "collapsed":
        this.reducePossibilities();
        this.state = "possibilitiesReduced";
        break;
      case "possibilitiesReduced":
        this.squaresCheckSelves();
        this.state = "squaresChecked";
        break;
      case "squaresChecked":
        this.checkAreas();
        this.state = "readyToCollapse";
        break;
    }
  }
  checkForHiddenPair(area) {
    for (let p1 = 1; p1 <= this.gridSize * this.gridSize; p1++) {
      for (let p2 = 1; p2 <= this.gridSize * this.gridSize; p2++) {
        const containPair = area.filter(
          (sq) => sq.checkPair(p1, p2) && !sq.isSettled()
        );
        ``;
        if (containPair.length === 2 && p1 !== p2) {
          const eitherPoss = area.filter(
            (sq) => sq.hasPoss(p1) || sq.hasPoss(p2)
          );
          if (eitherPoss.length === containPair.length) {
            const poss = new Square(0, 0, this.gridSize).possibilities;
            const rest = poss.filter((p) => p !== p1 && p !== p2);
            containPair.forEach((sq) => sq.narrow(...rest));
          }
        }
      }
    }
  }
  updateSquare(row, col, value) {
    const square = this.squares.find((sq) => sq.row === row && sq.col === col);
    square.collapse(value);
    this.reducePossibilities(square);
    this.squaresCheckSelves();
    this.checkSpecialRow();
    this.checkAreas();
    this.state = "readyToCollapse";
  }
}

module.exports = Sudoku;
