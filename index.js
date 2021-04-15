const Sudoku = require("./Sudoku");
const Gui = require("./Gui");

const testSudoku = new Sudoku(3);
const newGui = new Gui(testSudoku);

//hard one
// newGui.updateWithPattern(
//   "-8-479--2\n--7--2---\n---5---64\n243--7---\n8--91----\n--1------\n6--3-5---\n--8-----9\n37--912--"
// );
//expert
// newGui.updateWithPattern(
//   "---------\n-7---1-5-\n-----7489\n----6--7-\n---4-58--\n-43-9--6-\n--9-5--1-\n-513-62--\n--8-----7"
// );
//expert;
newGui.updateWithPattern(
  "4---5-8--\n-18---7--\n--3--4---\n96-------\n--5--3---\n-7---8-6-\n--16----4\n---5---13\n---8-----"
);

//super fiendish
// newGui.updateWithPattern(
//   "---92----\n-2-837-9-\n7-----6--\n95-7---3-\n---------\n47-5---8-\n5-----8--\n-9-375-4-\n---29----"
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
