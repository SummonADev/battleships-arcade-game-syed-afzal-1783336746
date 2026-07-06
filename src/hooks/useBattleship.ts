import { useCallback, useRef, useState } from 'react';
import { GameState } from '@/types/game';
import {
  newGame,
  fireAt,
  allSunk,
  chooseEnemyShot,
  neighbors,
  placeFleetRandomly,
} from '@/lib/engine';

export function useBattleship() {
  const [state, setState] = useState<GameState>(() => newGame());
  const huntStack = useRef<number[]>([]);
  const busy = useRef(false);

  const reset = useCallback(() => {
    huntStack.current = [];
    busy.current = false;
    setState(newGame());
  }, []);

  const shuffleFleet = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'placement') return s;
      return { ...s, playerBoard: placeFleetRandomly() };
    });
  }, []);

  const startBattle = useCallback(() => {
    setState((s) =>
      s.phase === 'placement'
        ? { ...s, phase: 'playing', message: 'Your move — fire at enemy waters!' }
        : s
    );
  }, []);

  const enemyTurn = useCallback(() => {
    setState((prev) => {
      const target = chooseEnemyShot(prev.playerBoard, huntStack.current);
      if (target < 0) return prev;

      const res = fireAt(prev.playerBoard, target);
      let message: string;

      if (res.sunk) {
        message = `Enemy sank your ${res.sunk.name}!`;
        huntStack.current = [];
      } else if (res.hit) {
        message = 'Enemy hit your ship!';
        huntStack.current.push(...neighbors(target));
      } else {
        message = 'Enemy missed.';
      }

      if (allSunk(res.board)) {
        return {
          ...prev,
          playerBoard: res.board,
          phase: 'gameover',
          winner: 'enemy',
          turn: 'enemy',
          message: 'Your fleet was destroyed. Enemy wins!',
        };
      }

      busy.current = false;
      return {
        ...prev,
        playerBoard: res.board,
        turn: 'player',
        message: `${message} Your move.`,
      };
    });
  }, []);

  const fireAtEnemy = useCallback(
    (index: number) => {
      if (busy.current) return;
      setState((prev) => {
        if (prev.phase !== 'playing' || prev.turn !== 'player') return prev;

        const res = fireAt(prev.enemyBoard, index);
        if (res.alreadyShot) return prev;

        const shots = prev.shots + 1;
        const hits = prev.hits + (res.hit ? 1 : 0);

        let message: string;
        if (res.sunk) message = `You sank the enemy ${res.sunk.name}!`;
        else if (res.hit) message = 'Direct hit!';
        else message = 'Splash — you missed.';

        if (allSunk(res.board)) {
          return {
            ...prev,
            enemyBoard: res.board,
            phase: 'gameover',
            winner: 'player',
            message: 'You destroyed the enemy fleet. Victory!',
            shots,
            hits,
          };
        }

        // Hand over to enemy
        busy.current = true;
        setTimeout(() => enemyTurn(), 800);

        return {
          ...prev,
          enemyBoard: res.board,
          turn: 'enemy',
          message: `${message} Enemy is taking aim...`,
          shots,
          hits,
        };
      });
    },
    [enemyTurn]
  );

  return { state, fireAtEnemy, startBattle, shuffleFleet, reset };
}
