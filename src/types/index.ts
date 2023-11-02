export enum cellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  bomb,
}

export enum cellState {
  open,
  visible,
  flagged,
}

export type Cell = { value: cellValue; state: cellState };

export enum Face {
  smile = "😁",
  Oface = "😮",
  lostface = "😔",
  win = "🤩",
}
