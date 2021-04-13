const readline = require("readline");
const { sleep } = require("./utils");
const chalk = require("chalk");
class Gui {
  constructor(sudoku) {
    this.sudoku = sudoku;
  }
  watch() {
    while (!this.sudoku.allSettled) {
      sleep(100);
      this.print();
      this.sudoku.next();
    }
    //this.print();
  }
  getSquarePrint(possibilities, isSettled) {
    const doubleDigits = this.sudoku.gridSize > 3;
    if (isSettled) {
      if (doubleDigits) {
        const colour =
          possibilities[0] === "x" || possibilities[0] === 0 ? "red" : "white";
        return [
          "            ",
          chalk[colour](
            `     ${
              possibilities[0] > 9 ? possibilities[0] : " " + possibilities[0]
            }     `
          ),
          "            ",
          "            ",
        ];
      } else {
        const colour =
          possibilities[0] === "x" || possibilities[0] === 0 ? "red" : "white";
        return ["      ", chalk[colour](`   ${possibilities[0]}  `), "      "];
      }
    }
    let squareRows = [];
    for (let i = 0; i < this.sudoku.size; i++) {
      squareRows.push("");
    }
    let index = 0;
    return squareRows.map((row) => {
      const colour =
        possibilities.length < 2
          ? "green"
          : possibilities.length < 7
          ? "yellow"
          : "red";
      for (let col = 0; col < this.sudoku.size; col++) {
        if (doubleDigits) {
          if (possibilities[index] < 10) {
            if (possibilities[index] !== undefined) {
              row += " " + chalk[colour](possibilities[index] + " ");
            } else {
              row += "   ";
            }
          } else {
            if (possibilities[index] !== undefined) {
              row += chalk[colour](possibilities[index] + " ");
            } else {
              row += "   ";
            }
          }
          index++;
        } else {
          if (possibilities[index] !== undefined) {
            row += chalk[colour](possibilities[index] + " ");
          } else {
            row += "  ";
          }
          index++;
        }
      }
      return row;
    });
  }
  print() {
    const squares = this.sudoku.getSquares();
    const rows = [];
    for (let i = 0; i < this.sudoku.size * this.sudoku.size; i++) {
      i % this.sudoku.size === 0 && i !== 0
        ? rows.push(
            "-----------------------------------------------------------------\n"
          )
        : rows.push("");
      const squaresOnRow = squares
        .filter((square) => square.row === i)
        .map((sq) => this.getSquarePrint(sq.getSquare(), sq.isSettled()));
      let rowStr = "";

      for (let row = 0; row < this.sudoku.size; row++) {
        for (let col = 0; col < this.sudoku.size * this.sudoku.size; col++) {
          rowStr +=
            col % this.sudoku.size === 0 && col !== 0
              ? "| " + squaresOnRow[col][row] + " "
              : "" + squaresOnRow[col][row] + " ";
        }
        rowStr += "\n";
      }
      rows.push(rowStr);
    }
    console.clear();
    console.log(rows.join(""));
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
