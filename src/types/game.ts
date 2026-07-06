export type Owner = 'player' | 'enemy';

export type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'sunk';

export interface Ship {
  id: string;
  name: string;
  size: number;
  cells: number[]; // board indices occupied
  hits: number;
}

export interface Board {
  size: number; // grid dimension (e.g. 10)
  cells: CellState[]; // length size*size
  ships: Ship[];
}

export type Phase = 'placement' | 'playing' | 'gameover';

export type Turn = 'player' | 'enemy';

export interface GameState {
  phase: Phase;
  turn: Turn;
  playerBoard: Board;
  enemyBoard: Board;
  winner: Owner | null;
  message: string;
  shots: number;
  hits: number;
}

export const FLEET: { name: string; size: number }[] = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
];
