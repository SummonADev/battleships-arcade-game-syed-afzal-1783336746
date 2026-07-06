import { Board, GameState, Ship, FLEET } from '@/types/game';

export const GRID = 10;

function idx(row: number, col: number): number {
  return row * GRID + col;
}

export function rowCol(index: number): [number, number] {
  return [Math.floor(index / GRID), index % GRID];
}

function emptyBoard(): Board {
  return {
    size: GRID,
    cells: Array(GRID * GRID).fill('empty'),
    ships: [],
  };
}

/** Try to place a fleet randomly on a fresh board. */
export function placeFleetRandomly(): Board {
  const board = emptyBoard();
  const occupied = new Set<number>();

  for (const spec of FLEET) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 500) {
      attempts++;
      const horizontal = Math.random() < 0.5;
      const row = Math.floor(Math.random() * GRID);
      const col = Math.floor(Math.random() * GRID);
      const cells: number[] = [];
      let fits = true;

      for (let i = 0; i < spec.size; i++) {
        const r = horizontal ? row : row + i;
        const c = horizontal ? col + i : col;
        if (r >= GRID || c >= GRID) {
          fits = false;
          break;
        }
        const index = idx(r, c);
        if (occupied.has(index)) {
          fits = false;
          break;
        }
        cells.push(index);
      }

      if (fits) {
        cells.forEach((ci) => {
          occupied.add(ci);
          board.cells[ci] = 'ship';
        });
        const ship: Ship = {
          id: `${spec.name}-${Math.random().toString(36).slice(2, 7)}`,
          name: spec.name,
          size: spec.size,
          cells,
          hits: 0,
        };
        board.ships.push(ship);
        placed = true;
      }
    }
  }

  return board;
}

export function newGame(): GameState {
  return {
    phase: 'placement',
    turn: 'player',
    playerBoard: placeFleetRandomly(),
    enemyBoard: placeFleetRandomly(),
    winner: null,
    message: 'Position your fleet, then start the battle!',
    shots: 0,
    hits: 0,
  };
}

/** Fire at a board index. Returns updated board, whether it was a hit, and any sunk ship. */
export function fireAt(
  board: Board,
  index: number
): { board: Board; hit: boolean; sunk: Ship | null; alreadyShot: boolean } {
  const current = board.cells[index];
  if (current === 'hit' || current === 'miss' || current === 'sunk') {
    return { board, hit: false, sunk: null, alreadyShot: true };
  }

  const cells = [...board.cells];
  let hit = false;
  let sunk: Ship | null = null;

  const ships = board.ships.map((s) => {
    if (s.cells.includes(index)) {
      hit = true;
      const updated = { ...s, hits: s.hits + 1 };
      if (updated.hits >= updated.size) {
        sunk = updated;
      }
      return updated;
    }
    return s;
  });

  if (hit) {
    cells[index] = 'hit';
    if (sunk) {
      (sunk as Ship).cells.forEach((ci) => {
        cells[ci] = 'sunk';
      });
    }
  } else {
    cells[index] = 'miss';
  }

  return { board: { ...board, cells, ships }, hit, sunk, alreadyShot: false };
}

export function allSunk(board: Board): boolean {
  return board.ships.every((s) => s.hits >= s.size);
}

/** Simple AI: chases adjacent cells after a hit, otherwise fires randomly. */
export function chooseEnemyShot(board: Board, huntStack: number[]): number {
  const available: number[] = [];
  board.cells.forEach((c, i) => {
    if (c !== 'hit' && c !== 'miss' && c !== 'sunk') available.push(i);
  });
  if (available.length === 0) return -1;

  // Prefer hunt targets that are still valid
  while (huntStack.length > 0) {
    const target = huntStack.pop()!;
    if (available.includes(target)) return target;
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function neighbors(index: number): number[] {
  const [r, c] = rowCol(index);
  const result: number[] = [];
  if (r > 0) result.push(idx(r - 1, c));
  if (r < GRID - 1) result.push(idx(r + 1, c));
  if (c > 0) result.push(idx(r, c - 1));
  if (c < GRID - 1) result.push(idx(r, c + 1));
  return result;
}
