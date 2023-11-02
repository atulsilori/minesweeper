import {
  MAX_COLUMNS,
  MAX_ROWS,
  NUMBER_OF_BOMBS,
  TOTAL_CELLS,
} from "../constants";
import { cellValue, cellState, Cell } from "../types";

export const generateCells = () => {
  let cells: Cell[][] = [];
  // generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLUMNS; col++) {
      cells[row].push({
        value: cellValue.none,
        state: cellState.open,
      });
    }
  }

  // randomly put=bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NUMBER_OF_BOMBS) {
    const row = Math.floor(Math.random() * MAX_ROWS);
    const col = Math.floor(Math.random() * MAX_COLUMNS);
    const currentcell = cells[row][col];
    if (currentcell.value !== cellValue.bomb) {
      cells = cells.map((rows, rowIndex) =>
        rows.map((cell, colIndex) => {
          if (row === rowIndex && col === colIndex) {
            return {
              ...cell,
              value: cellValue.bomb,
            };
          }

          return cell;
        })
      );

      bombsPlaced++;
    }
  }

  // setting up values in cells near bomb
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLUMNS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === cellValue.bomb) {
        continue;
      }
      const topLeftBomb =
        rowIndex > 0 &&
        colIndex > 0 &&
        cells[rowIndex - 1][colIndex - 1].value === cellValue.bomb
          ? 1
          : 0;
      const topBomb =
        rowIndex > 0 && cells[rowIndex - 1][colIndex].value === cellValue.bomb
          ? 1
          : 0;
      const topRightBomb =
        rowIndex > 0 &&
        colIndex < MAX_COLUMNS - 1 &&
        cells[rowIndex - 1][colIndex + 1].value === cellValue.bomb
          ? 1
          : 0;
      const leftBomb =
        colIndex > 0 && cells[rowIndex][colIndex - 1].value === cellValue.bomb
          ? 1
          : 0;
      const rightBomb =
        colIndex < MAX_COLUMNS - 1 &&
        cells[rowIndex][colIndex + 1].value === cellValue.bomb
          ? 1
          : 0;
      const bottomLeftBomb =
        rowIndex < MAX_ROWS - 1 &&
        colIndex > 0 &&
        cells[rowIndex + 1][colIndex - 1].value === cellValue.bomb
          ? 1
          : 0;
      const bottomBomb =
        rowIndex < MAX_ROWS - 1 &&
        cells[rowIndex + 1][colIndex].value === cellValue.bomb
          ? 1
          : 0;
      const bottomRightBomb =
        rowIndex < MAX_ROWS - 1 &&
        colIndex < MAX_COLUMNS - 1 &&
        cells[rowIndex + 1][colIndex + 1].value === cellValue.bomb
          ? 1
          : 0;
      const adjacentNumberOfBombs =
        topLeftBomb +
        topBomb +
        topRightBomb +
        leftBomb +
        rightBomb +
        bottomLeftBomb +
        bottomBomb +
        bottomRightBomb;
      let enumvalue: cellValue = cellValue.none;
      switch (adjacentNumberOfBombs) {
        case 0:
          enumvalue = cellValue.none;
          break;
        case 1:
          enumvalue = cellValue.one;
          break;
        case 2:
          enumvalue = cellValue.two;
          break;
        case 3:
          enumvalue = cellValue.three;
          break;
        case 4:
          enumvalue = cellValue.four;
          break;
        case 5:
          enumvalue = cellValue.five;
          break;
        case 6:
          enumvalue = cellValue.six;
          break;
        case 7:
          enumvalue = cellValue.seven;
          break;
        case 8:
          enumvalue = cellValue.eight;
          break;
      }
      cells = cells.map((rows, row) =>
        rows.map((cell, col) => {
          if (row === rowIndex && col === colIndex) {
            return {
              ...cell,
              value: enumvalue,
            };
          }
          return cell;
        })
      );
    }
  }
  return cells;
};

// spread algo for spreading cells when empty cell is clicked
export const spread = (cells: Cell[][], row: number, col: number): Cell[][] => {
  // return when bounds of row is reached
  if (row < 0 || row > 8) {
    return cells;
  }
  // return when bounds of column is reached
  if (col < 0 || col > 8) {
    return cells;
  }
  let newcells = cells.slice();
  const currentCellValue = newcells[row][col];
  // if cell already opened then return cells
  if (currentCellValue.state === cellState.visible) {
    return cells;
  }
  // when current cell is none, check if cell value is bomb then dont open return else open it and return
  if (currentCellValue.value !== cellValue.none) {
    newcells[row][col].state =
      currentCellValue.value === cellValue.bomb
        ? cellState.open
        : cellState.visible;
    return newcells;
  }
  newcells[row][col].state = cellState.visible;
  // recursively run spread on top, right, bottom, left cells
  const topvalue = spread(newcells, row + 1, col);
  const leftvalue = spread(topvalue, row, col + 1);
  const bottomvalue = spread(leftvalue, row - 1, col);
  const rightvalue = spread(bottomvalue, row, col - 1);
  return rightvalue;
};

export const showAllBombs = (
  cells: Cell[][],
  setBombcount: (val: (prev: number) => number) => void
): Cell[][] => {
  const tempcells = cells.map((cellArr) =>
    cellArr.map((cell: any) => {
      if (cell.value === cellValue.bomb) {
        if (cell.state === cellState.flagged) {
          setBombcount((prev: number) => prev + 1);
        }
        return { ...cell, state: cellState.visible };
      }
      return cell;
    })
  );

  return tempcells;
};

export const hideAllBombs = (cells: Cell[][]): Cell[][] => {
  const tempcells = cells.map((cellArr) =>
    cellArr.map((cell: any) => {
      if (cell.value === cellValue.bomb) {
        return { ...cell, state: cellState.open };
      }
      return cell;
    })
  );

  return tempcells;
};

export const GameWon = (cells: Cell[][]): boolean => {
  let count = 0;
  cells.forEach((cellArr: any) => {
    cellArr.forEach((cell: any) => {
      if (cell.state === cellState.visible && cell.value !== cellValue.bomb) {
        count++;
      } else if (
        cell.state === cellState.visible &&
        cell.value === cellValue.bomb
      ) {
        return false;
      }
    });
  });
  return TOTAL_CELLS - count === NUMBER_OF_BOMBS;
};
