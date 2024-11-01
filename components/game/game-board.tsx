'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

const GRID_SIZE = 20;
const CELL_SIZE = 40; // Increased for better sprite visibility

type CharacterType =
  | 'android'
  | 'chestburster'
  | 'facehugger'
  | 'man'
  | 'spacesuit'
  | 'woman'
  | 'xenomorph';

type CellType = 'empty' | 'wall' | 'player';

interface Position {
  x: number;
  y: number;
}

const sprites = {
  android: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/droid.png',
  chestburster:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/chestburster.png',
  facehugger:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/facehugger.png',
  man: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/man.png',
  spacesuit:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/astronaut.png',
  woman: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/woman.png',
  xenomorph:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/xenomorph.png'
};

const initialMaze: CellType[][] = [
  [
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall'
  ],
  [
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall'
  ],
  [
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall'
  ],
  [
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'empty',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall'
  ],
  [
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'empty',
    'wall'
  ],
  [
    'wall',
    'empty',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall'
  ],
  [
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall',
    'wall'
  ]
];

export function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 1,
    y: 1
  });
  const [playerType, setPlayerType] = useState<CharacterType>('woman');
  const [maze, setMaze] = useState<CellType[][]>(initialMaze);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newPosition = { ...playerPosition };

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(0, playerPosition.y - 1);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(GRID_SIZE - 1, playerPosition.y + 1);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(0, playerPosition.x - 1);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(GRID_SIZE - 1, playerPosition.x + 1);
          break;
      }

      if (maze[newPosition.y][newPosition.x] !== 'wall') {
        setPlayerPosition(newPosition);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, maze]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-center bg-black text-white'>
      <h1 className='font-pixel mb-4 text-4xl font-bold'>
        xenomorph: 8-bit Escape
      </h1>
      <div
        className='grid border-4 border-gray-700 bg-gray-900 p-2'
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = x === playerPosition.x && y === playerPosition.y;
            return (
              <div
                key={`${x}-${y}`}
                className={`relative ${cell === 'wall' ? 'bg-gray-700' : 'bg-gray-900'} ${isPlayer ? 'bg-gray-800/50' : ''} `}
              >
                {isPlayer && (
                  <Image
                    src={sprites[playerType]}
                    alt={playerType}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    className='pixel-art absolute left-0 top-0 h-full w-full object-contain'
                    priority
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      <div className='mt-4 space-x-2'>
        <button
          onClick={() => setPlayerType('woman')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'woman' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          woman
        </button>
        <button
          onClick={() => setPlayerType('android')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'android' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Android
        </button>
        <button
          onClick={() => setPlayerType('xenomorph')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'xenomorph' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          xenomorph
        </button>
        <button
          onClick={() => setPlayerType('facehugger')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'facehugger' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Facehugger
        </button>
      </div>
      <p className='font-pixel mt-4 text-sm'>Use arrow keys to move</p>
    </div>
  );
}
