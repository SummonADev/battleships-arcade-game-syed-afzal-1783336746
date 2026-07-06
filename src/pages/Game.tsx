import { useBattleship } from '@/hooks/useBattleship';
import Board from '@/components/Board';

export default function Game() {
  const { state, fireAtEnemy, startBattle, shuffleFleet, reset } = useBattleship();
  const { phase, turn, playerBoard, enemyBoard, message, shots, hits, winner } = state;

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* ambient grid glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* Title */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow">
            BATTLESHIPS
          </h1>
          <p className="text-cyan-400/70 text-sm mt-1 tracking-[0.3em] uppercase">
            Arcade Naval Combat
          </p>
        </header>

        {/* Status bar */}
        <div className="w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur px-5 py-3 flex items-center justify-between gap-4 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                phase === 'playing'
                  ? turn === 'player'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400 animate-pulse'
                  : phase === 'gameover'
                  ? winner === 'player'
                    ? 'bg-emerald-400'
                    : 'bg-rose-500'
                  : 'bg-cyan-400'
              }`}
            />
            <span className="font-medium">{message}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-cyan-300/80 font-mono">
            <span>SHOTS {shots}</span>
            <span>HITS {hits}</span>
            <span>ACC {accuracy}%</span>
          </div>
        </div>

        {/* Boards */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          <Board
            title="Your Fleet"
            board={playerBoard}
            revealShips
            disabled
            onCellClick={() => {}}
          />
          <Board
            title="Enemy Waters"
            board={enemyBoard}
            revealShips={phase === 'gameover'}
            disabled={phase !== 'playing' || turn !== 'player'}
            onCellClick={fireAtEnemy}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {phase === 'placement' && (
            <>
              <button
                onClick={shuffleFleet}
                className="px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-slate-900/70 text-cyan-200 font-semibold hover:bg-slate-800 hover:border-cyan-400 transition"
              >
                🔀 Shuffle Fleet
              </button>
              <button
                onClick={startBattle}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition"
              >
                ⚓ Start Battle
              </button>
            </>
          )}

          {phase === 'playing' && (
            <button
              onClick={reset}
              className="px-5 py-2.5 rounded-xl border border-slate-600 bg-slate-900/70 text-slate-300 font-semibold hover:bg-slate-800 transition"
            >
              Restart
            </button>
          )}

          {phase === 'gameover' && (
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition"
            >
              🔁 Play Again
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <LegendItem className="bg-slate-700" label="Water" />
          <LegendItem className="bg-cyan-600" label="Ship" />
          <LegendItem className="bg-sky-300/40" label="Miss" />
          <LegendItem className="bg-amber-500" label="Hit" />
          <LegendItem className="bg-rose-600" label="Sunk" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded ${className}`} />
      <span>{label}</span>
    </div>
  );
}
