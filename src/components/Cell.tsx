import { CellState } from '@/types/game';

interface CellProps {
  state: CellState;
  revealShips: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function Cell({ state, revealShips, disabled, onClick }: CellProps) {
  let content: string = '';
  let classes = 'bg-slate-700/60 hover:bg-slate-600';

  switch (state) {
    case 'ship':
      classes = revealShips
        ? 'bg-cyan-600/90 border border-cyan-300/50'
        : 'bg-slate-700/60 hover:bg-slate-600';
      break;
    case 'miss':
      classes = 'bg-sky-300/25';
      content = '•';
      break;
    case 'hit':
      classes = 'bg-amber-500 shadow-inner shadow-orange-700';
      content = '✳';
      break;
    case 'sunk':
      classes = 'bg-rose-600 shadow-inner shadow-rose-900';
      content = '✖';
      break;
    default:
      classes = 'bg-slate-700/50 hover:bg-slate-600';
  }

  const clickable = !disabled && (state === 'empty' || state === 'ship');

  return (
    <button
      onClick={onClick}
      disabled={disabled || state === 'hit' || state === 'miss' || state === 'sunk'}
      className={`aspect-square rounded-[3px] flex items-center justify-center text-xs sm:text-sm font-bold text-white/90 transition-colors ${classes} ${
        clickable ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      {content}
    </button>
  );
}
