import React, { useEffect, useRef, useState } from "react";

import NumberDisplay from "../NumberDisplay";
import Footer from "../Footer";
import Button from "../Button";
import { generateCells, spread, showAllBombs, GameWon } from "../../utils";
import "./App.scss";
import { cellState, Face, Cell, cellValue } from "../../types";
import { NUMBER_OF_BOMBS } from "../../constants/index";
import Confetti from "../widget/confetti";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells()); // mine sweeper cells
  const [face, setFace] = useState<Face>(Face.smile); // mine sweeper emogi face
  const [time, setTime] = useState<number>(0); // timer
  const [live, setLive] = useState<boolean>(false); // to check if game has started
  const [bombcount, setBombcount] = useState<number>(NUMBER_OF_BOMBS); // number of flags

  const confettiRef = useRef<any>(null); // ref for handling confetti

  // handling mouseup and mousedown on minesweeper cell
  useEffect(() => {
    // pattern of cell classname
    const expr = /value-[0-9]/;
    // mouse down event handler on cell
    const handleMouseDown = (e: any) => {
      if (
        expr.test(e.target.className) &&
        face !== Face.lostface &&
        face !== Face.win
      ) {
        setFace(Face.Oface);
      }
    };
    // mouse up event handler on cell
    const handleMouseUp = (e: any) => {
      if (
        expr.test(e.target.className) &&
        face !== Face.lostface &&
        face !== Face.win
      ) {
        setFace(Face.smile);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [face]);

  // setting up timer when game is live
  useEffect(() => {
    if (live && time < 999) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [live, time]);

  // stop game and show win animation when game is won
  useEffect(() => {
    const showWinAnimation = () => {
      setTimeout(() => {
        confettiRef.current.style.display = "none";
        console.log("confettiRef -- ", confettiRef.current.style.display);
      }, 5000);
    };
    if (GameWon(cells)) {
      confettiRef.current.style.display = "block";
      console.log("confettiRef -- ", confettiRef.current.style.display);
      setLive(false);
      setFace(Face.win);
      showWinAnimation();
    }
  }, [cells]);

  // handling cell click
  const handleCellClick = (row: number, col: number, type: string) => {
    let tempcells = [...cells];
    const currentCell = cells[row][col];
    let stateValue = cellState.open;

    if (face === Face.lostface || face === Face.win) {
      return;
    }

    if (type === "visible" && currentCell.state === cellState.flagged) {
      return;
    }

    if (type === "flag" && !live) {
      return;
    }

    if (type === "visible" && currentCell.value === cellValue.none) {
      tempcells = spread(tempcells, row, col);
    }

    if (type === "visible" && currentCell.value === cellValue.bomb) {
      tempcells = showAllBombs(tempcells, setBombcount);
      setFace(Face.lostface);
      setLive(false); // stop game
    }

    switch (type) {
      case "flag":
        if (currentCell.state === cellState.flagged) {
          setBombcount((prev) => prev + 1); // increase flags count
        } else if (bombcount > 0) {
          stateValue = cellState.flagged;
          setBombcount((prev) => prev - 1); // decrease flags count
        }
        break;
      case "visible":
        stateValue = cellState.visible;
        break;
    }

    tempcells[row][col] = {
      ...currentCell,
      state: stateValue,
    };
    setCells(tempcells);

    if (!live) {
      setLive(true); // start game
    }
  };

  const handleFaceClick = () => {
    setLive(false); // stop game
    setTime(0); // reset timer
    setCells(generateCells()); // reset cell values
    setFace(Face.smile); // reset face to smile
    setBombcount(NUMBER_OF_BOMBS); // reset flags count
  };

  // render cells
  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowindex) =>
      row.map((cell, colindex) => (
        <Button
          key={`${rowindex}-${colindex}`}
          state={cell.state}
          value={cell.value}
          row={rowindex}
          col={colindex}
          handleCellClick={handleCellClick}
        />
      ))
    );
  };

  // game rules
  const Rules: React.FC = () => {
    return (
      <div className="rules">
        <div>
          <p>Rules to play - </p>
          <ol>
            <li>Click on any cell to start game.</li>
            <br />
            <li>
              If it is a number it means there is equivalent number of bomb/s
              inside immediately closest cells.
            </li>
            <br />
            <li>
              If you click on bomb you lost the game, but can redo it by
              clicking on bottom redo button, it will resume your game from
              moment before you clicked the bomb
            </li>
          </ol>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="title">
        <h1>Mine Sweeper</h1>
      </div>
      <div>
        <div className="game-container">
          <Rules />
          <div className="mineweeper-game">
            <div className="App">
              <div className="Header">
                <NumberDisplay value={bombcount} />
                <div className="Face" onClick={handleFaceClick}>
                  <span role="img" aria-label="Face">
                    {face}
                  </span>
                </div>
                <NumberDisplay value={time} />
              </div>
              <div className="Body">{renderCells()}</div>
            </div>
            <div>
              <Footer
                face={face}
                setFace={setFace}
                cells={cells}
                setCells={setCells}
                setLive={setLive}
              />
            </div>
          </div>
        </div>
        <Confetti confettiRef={confettiRef} />
      </div>
    </>
  );
};
export default App;
