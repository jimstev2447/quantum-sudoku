const Sudoku = require("./Sudoku");
const Gui = require("./Gui");

const testSudoku = new Sudoku(3);
const newGui = new Gui(testSudoku);

//hard one
// newGui.updateWithPattern(
//   "-8-479--2\n--7--2---\n---5---64\n243--7---\n8--91----\n--1------\n6--3-5---\n--8-----9\n37--912--"
// );
//hard one
// newGui.updateWithPattern(
//   "-3-6---8-\n--98-17-2\n---5----6\n----1---3\n-85---9-4\n-7--2----\n-9---7---\n-53------\n----9--47"
// );
//expert;
newGui.updateWithPattern(
  "4---5-8--\n-18---7--\n--3--4---\n96-------\n--5--3---\n-7---8-6-\n--16----4\n---5---13\n---8-----"
);
//expert;
// newGui.updateWithPattern(
//   "-7----3--\n-4--539--\n9----8---\n--6-----4\n3---49---\n--5----6-\n---1--2--\n-5----7--\n----7--51"
// );
//expert;
// newGui.updateWithPattern(
//   "---------\n-7---1-5-\n-----7489\n----6--7-\n---4-58--\n-43-9--6-\n--9-5--1-\n-513-62--\n--8-----7"
// );
newGui.watch();
//newGui.slow();
// if 2 squares in a given area contain the same
// 2 options then all the others inside that area
// must not be those options

/*
collapse a square

each square affected by that collapse reduces its possibilities

*/
