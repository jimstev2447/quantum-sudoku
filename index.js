const Sudoku = require("./Sudoku");
const Gui = require("./Gui");

const testSudoku = new Sudoku(3);
const newGui = new Gui(testSudoku);

//easy
// newGui.updateWithPattern(
//   "6--------\n-4537----\n-91-8-5--\n3-89-----\n4-----72-\n1----6-8-\n-----397-\n-2----16-\n---169--8"
// );

//hard one
// newGui.updateWithPattern(
//   "-8-479--2\n--7--2---\n---5---64\n243--7---\n8--91----\n--1------\n6--3-5---\n--8-----9\n37--912--"
// );

//expert;
// newGui.updateWithPattern(
//   "4---5-8--\n-18---7--\n--3--4---\n96-------\n--5--3---\n-7---8-6-\n--16----4\n---5---13\n---8-----"
// );

//super fiendish
// newGui.updateWithPattern(
//   "---92----\n-2-837-9-\n7-----6--\n95-7---3-\n---------\n47-5---8-\n5-----8--\n-9-375-4-\n---29----"
// );

//decision
// newGui.updateWithPattern(
//   "1------45\n4--7-----\n-57---38-\n8--59-4--\n--6-2-5--\n5-9-73--8\n-15---86-\n-----8--7\n97------4"
// );

/*refactor
collapse cell
propagate information to cells attached by sudoku
for each cell that has changed 

check its rows cols and grids for:
  pointingPairs
  hiddenPairs
  nakedPairs
  those squares check thamselves for lone possibilities
*/
newGui.watch();
