import React from "react";

import { cellState, cellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
  state: cellState;
  value: cellValue;
  row: number;
  col: number;
  handleCellClick: (row: number, col: number, type: string) => void;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  handleCellClick,
}) => {
  // render cell content
  const renderContent = (): React.ReactNode => {
    if (state === cellState.visible) {
      if (value === cellValue.bomb) {
        return (
          <span role="img" aria-label="Bomb" className={`${row}_${col}`}>
            💣
          </span> // bomb
        );
      } else {
        return <span>{value > 0 ? value : ""}</span>; // value or null
      }
    } else if (state === cellState.flagged) {
      return (
        <span role="img" aria-label="Flag">
          🚩
        </span> // flag
      );
    }
  };

  return (
    <div
      className={`Button ${
        state === cellState.visible ? "visible" : ""
      } value-${value}`}
      onClick={() => {
        // for left click
        handleCellClick(row, col, "visible");
      }}
      onContextMenu={(e) => {
        // for right click
        e.preventDefault();
        handleCellClick(row, col, "flag");
      }}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
