import { Board as BoardType } from '@/types/game';
import Cell from '@/components/Cell';

interface BoardProps {
  title: string;
  board: BoardType;
  revealShips: boolean;
  disabled: boolean;
  onCellClick: (index: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default function Board({ title, board, revealShips, disabled, onCellClick }: BoardProps) {
  const { size } = board;

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-sm font-bold tracking-widest uppercase text-cyan-300/90">{title}</h2>

      <div
        className={`rounded-2xl border border-cyan-500/25 bg-slate-900/50 p-3 shadow-lg shadow-cyan-500/5 transition ${
          disabled ? '' : 'ring-1 ring-cyan-400/40'
        }`}
      >
        {/* column labels */}
        <div className="grid" style={{ gridTemplateColumns: `1.25rem repeat(${size}, 1fr)` }}>
          <span />
          {Array.from({ length: size }).map((_, c) => (
            <span key={c} className="text-center text-[10px] text-slate-500 font-mono">
              {c + 1}
            </span>
          ))}
        </div>

        <div className="flex">
          {/* row labels */}
          <div className="grid" style={{ gridTemplateRows: `repeat(${size}, 1fr)` }}>
            {Array.from({ length: size }).map((_, r) => (
              <span
                key={r}
                className="w-5 flex items-center justify-center text-[10px] text-slate-500 font-mono"
              >
                {LETTERS[r]}
              </span>
            ))}
          </div>

          {/* cells */}
          <div
            className="grid gap-[3px] flex-1"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {board.cells.map((cell, i) => (
              <Cell
                key={i}
                state={cell}
                revealShips={revealShips}
                disabled={disabled}
                onClick={() => onCellClick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
