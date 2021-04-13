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
    }
    for (const row in this.rows) {
      this.checkArea(this.rows[row]);
    }
    for (const col in this.cols) {
      this.checkArea(this.cols[col]);
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
  updateSquare(row, col, value) {
    const square = this.squares.find((sq) => sq.row === row && sq.col === col);
    square.collapse(value);
    this.reducePossibilities(square);
    this.squaresCheckSelves();
    this.checkAreas();
    this.state = "readyToCollapse";
  }
}

module.exports = Sudoku;
