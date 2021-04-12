const readline = require("readline");
const { sleep } = require("./utils");

class Gui {
  constructor(sudoku) {
    this.sudoku = sudoku;
  }
  watch() {
    while (this.sudoku.isCorrect && !this.sudoku.allSettled) {
      sleep(100);
      this.print();
      console.log(this.sudoku.isCorrect);
      this.sudoku.next();
    }
    // if (!this.sudoku.isCorrect) {
    //   this.sudoku.previousBoards.forEach((squares) => {
    //     this.sudoku.squares = squares;
    //     this.print();
    //     sleep(1000);
    //   });
    //}
    this.print();
    console.log(this.sudoku.isCorrect);
  }
  print() {
    const squares = this.sudoku.getSquares();
    const rows = [];
    for (let i = 0; i < 9; i++) {
      i % 3 === 0 && i !== 0
        ? rows.push(
            "-----------------------------------------------------------------\n"
          )
        : rows.push("\n");
      const squaresOnRow = squares
        .filter((square) => square.row === i)
        .map((sq) => sq.getSquare());
      let rowStr = "";
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          rowStr +=
            col % 3 === 0 && col !== 0
              ? "| " + squaresOnRow[col][row] + " "
              : "" + squaresOnRow[col][row] + " ";
        }
        rowStr += "\n";
      }
      rows.push(rowStr);
    }
    console.clear();
    console.log(rows.join(""));
    console.log(`Current State: ${this.sudoku.state}`);
    console.log(`Decisions: ${this.sudoku.decisions}`);
    console.log(`number of options: ${this.sudoku.numberOfPossibilities}`);
    console.log(this.sudoku.previousBoards.length);
    console.log(
      this.sudoku.previousBoards[0]
        ? this.sudoku.previousBoards[0].square
        : "n/a"
    );
  }
  updateWithPattern(patternString) {
    const patternArray = patternString.split("\n");
    patternArray.forEach((row, rowIndex) => {
      const cells = row.split("");
      cells.forEach((value, colIndex) => {
        if (value !== "-") {
          this.sudoku.updateSquare(rowIndex, colIndex, +value);
          this.print();
          sleep(300);
        }
      });
    });
    this.print;
    sleep(2000);
  }
  slow() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const awaitNext = () => {
      console.clear();
      this.print();
      rl.question("next step? enter/exit", (answer) => {
        if (answer === "exit") rl.close();
        else {
          console.clear();
          this.sudoku.next();
          this.print();
          awaitNext();
        }
        if (this.sudoku.allSettled) rl.close();
      });
    };
    awaitNext();
  }
}

module.exports = Gui;
