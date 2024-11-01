'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { initialMaze } from '@/components/game/initial-maze';

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

export type CellType = 'empty' | 'wall' | 'player' | 'npc';

interface Position {
  x: number;
  y: number;
}

interface NPC {
  id: number;
  position: Position;
  type: 'facehugger' | 'xenomorph';
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

export function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 1,
    y: 1
  });
  const [playerType, setPlayerType] = useState<CharacterType>('woman');
  const [maze, setMaze] = useState<CellType[][]>(initialMaze);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = useCallback(() => {
    setPlayerPosition({ x: 1, y: 1 });
    setPlayerType('woman');
    setMaze(initialMaze);
    setNpcs([
      { id: 1, position: { x: 18, y: 18 }, type: 'facehugger' },
      { id: 2, position: { x: 18, y: 1 }, type: 'xenomorph' }
    ]);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const moveNpcs = useCallback(() => {
    setNpcs((currentNpcs) =>
      currentNpcs.map((npc) => {
        const directions = [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 }
        ];
        const validMoves = directions.filter((dir) => {
          const newX = npc.position.x + dir.x;
          const newY = npc.position.y + dir.y;
          return (
            newX >= 0 &&
            newX < GRID_SIZE &&
            newY >= 0 &&
            newY < GRID_SIZE &&
            maze[newY][newX] !== 'wall'
          );
        });

        if (validMoves.length > 0) {
          const randomMove =
            validMoves[Math.floor(Math.random() * validMoves.length)];
          return {
            ...npc,
            position: {
              x: npc.position.x + randomMove.x,
              y: npc.position.y + randomMove.y
            }
          };
        }
        return npc;
      })
    );
  }, [maze]);

  useEffect(() => {
    const npcMoveInterval = setInterval(moveNpcs, 1000); // Move NPCs every second
    return () => clearInterval(npcMoveInterval);
  }, [moveNpcs]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

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
  }, [playerPosition, maze, gameOver]);

  useEffect(() => {
    // Check for collisions with NPCs
    const collidingNpc = npcs.find(
      (npc) =>
        npc.position.x === playerPosition.x &&
        npc.position.y === playerPosition.y
    );
    if (collidingNpc) {
      setGameOver(true);
      setPlayerType('chestburster');
    }
  }, [playerPosition, npcs]);

  return (
    <div className='flex h-full w-full flex-col items-center justify-center bg-black text-white'>
      <h1 className='font-pixel mb-4 text-4xl font-bold'>
        Alien: 8-bit Escape
      </h1>
      {gameOver ? (
        <div className='relative aspect-square w-full max-w-md'>
          <Image
            src={sprites.chestburster}
            alt='Chestburster'
            layout='fill'
            objectFit='contain'
            className='opacity-20'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
            <h2 className='font-pixel mb-4 text-4xl'>Game Over Man!</h2>
            <p className='mb-4'>
              You have been caught and turned into a chestburster!
            </p>
            <button
              onClick={initializeGame}
              className='font-pixel focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'
              aria-label='Play Again'
            >
              Play Again
            </button>
          </div>
        </div>
      ) : (
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
              const npc = npcs.find(
                (npc) => npc.position.x === x && npc.position.y === y
              );
              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative ${cell === 'wall' ? 'bg-gray-700' : 'bg-gray-900'} ${
                    isPlayer ? 'bg-gray-800/50' : ''
                  } `}
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
                  {npc && (
                    <Image
                      src={sprites[npc.type]}
                      alt={npc.type}
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
      )}
      {!gameOver && (
        <>
          <div className='mt-4 space-x-2'>
            <button
              onClick={() => setPlayerType('woman')}
              className={`font-pixel rounded px-3 py-1 text-sm ${
                playerType === 'woman' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              Woman
            </button>
            <button
              onClick={() => setPlayerType('android')}
              className={`font-pixel rounded px-3 py-1 text-sm ${
                playerType === 'android' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setPlayerType('xenomorph')}
              className={`font-pixel rounded px-3 py-1 text-sm ${
                playerType === 'xenomorph' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              Xenomorph
            </button>
          </div>
          <p className='font-pixel mt-4 text-sm'>Use arrow keys to move</p>
        </>
      )}
    </div>
  );
}
