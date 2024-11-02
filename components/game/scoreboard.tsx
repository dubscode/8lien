'use client';

import { Crosshair, Skull, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
});

interface ScoreboardProps {
  gamesPlayed?: number;
  gamesSurvived?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cellSize?: number;
}

export function Scoreboard({
  gamesPlayed = 0,
  gamesSurvived = 0,
  difficulty = 'medium',
  cellSize = 40
}: ScoreboardProps) {
  const [glowEffect, setGlowEffect] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowEffect((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'easy':
        return (
          <Target
            className='text-green-500'
            style={{ width: cellSize / 2, height: cellSize / 2 }}
          />
        );
      case 'medium':
        return (
          <Crosshair
            className='text-yellow-500'
            style={{ width: cellSize / 2, height: cellSize / 2 }}
          />
        );
      case 'hard':
        return (
          <Skull
            className='text-red-500'
            style={{ width: cellSize / 2, height: cellSize / 2 }}
          />
        );
    }
  };

  const scaleFactor = cellSize / 40; // Base scale on the default cell size of 40px

  return (
    <div
      className={`${pressStart2P.className} relative w-full rounded-lg border-4 border-primary/50 bg-black/90 shadow-2xl`}
      style={{
        padding: `${6 * scaleFactor}px`,
        maxWidth: `${cellSize * 10}px` // Adjust max-width based on cell size
      }}
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div
            className='text-muted'
            style={{ fontSize: `${8 * scaleFactor}px` }}
          >
            GAMES PLAYED
          </div>
          <div
            className={`font-bold tracking-widest text-green-500 ${
              glowEffect ? 'opacity-85' : 'opacity-100'
            }`}
            style={{
              fontSize: `${24 * scaleFactor}px`,
              textShadow: glowEffect
                ? '0 0 10px rgba(74, 222, 128, 0.5)'
                : 'none'
            }}
          >
            {gamesPlayed.toString().padStart(2, '0')}
          </div>
        </div>

        <div className='flex flex-col items-center space-y-2'>
          <div
            className='text-muted'
            style={{ fontSize: `${8 * scaleFactor}px` }}
          >
            DIFFICULTY
          </div>
          {getDifficultyIcon()}
        </div>

        <div className='space-y-2'>
          <div
            className='text-muted'
            style={{ fontSize: `${8 * scaleFactor}px` }}
          >
            SURVIVED
          </div>
          <div
            className={`font-bold tracking-widest text-yellow-500 ${
              glowEffect ? 'opacity-85' : 'opacity-100'
            }`}
            style={{
              fontSize: `${24 * scaleFactor}px`,
              textShadow: glowEffect
                ? '0 0 10px rgba(234, 179, 8, 0.5)'
                : 'none'
            }}
          >
            {gamesSurvived.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 ${
          glowEffect ? 'text-primary' : 'text-primary/80'
        }`}
        style={{ fontSize: `${10 * scaleFactor}px` }}
      >
        XENOMORPH STATS
      </div>
    </div>
  );
}
