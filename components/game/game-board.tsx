'use client';

import { CELL_SIZE, GRID_SIZE, generateMaze, sprites } from '@/lib/game';
import {
  CellType,
  CharacterType,
  Difficulty,
  NPC,
  Position
} from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

import { CharacterSelect } from './character-select';
import { GameOver } from './game-over';
import { GameWon } from './game-won';
import Image from 'next/image';
import { initialMaze } from '@/components/game/initial-maze';

export function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 1,
    y: 1
  });
  const [playerType, setPlayerType] = useState<CharacterType>('woman');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [maze, setMaze] = useState<CellType[][]>(initialMaze);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = useCallback(() => {
    const newMaze = generateMaze(GRID_SIZE, difficulty);
    setMaze(newMaze);
    setPlayerPosition({ x: 1, y: 1 });
    setPlayerType('woman');

    // Find valid positions for NPCs
    const validPositions = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (newMaze[y][x] === 'empty' && (x !== 1 || y !== 1)) {
          validPositions.push({ x, y });
        }
      }
    }
    // Helper function to pop a random value from an array
    function popRandom<T>(array: T[]): T | undefined {
      const index = Math.floor(Math.random() * array.length);
      return array.splice(index, 1)[0];
    }
    // Randomly place NPCs
    const newNpcs = [
      { id: 1, position: popRandom(validPositions), type: 'facehugger' },
      { id: 2, position: popRandom(validPositions), type: 'xenomorph' }
    ].filter((npc) => npc.position); // Remove any NPCs that couldn't be placed

    setNpcs(newNpcs as NPC[]);
    setGameOver(false);
    setGameWon(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (maze[newPosition.y][newPosition.x] === 'airlock') {
          setGameWon(true);
        }
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
        <GameOver initializeGame={initializeGame} />
      ) : gameWon ? (
        <GameWon initializeGame={initializeGame} />
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
              const airlock = x === GRID_SIZE - 2 && y === GRID_SIZE - 2;
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
                  {airlock && (
                    <Image
                      src={sprites['airlock']}
                      alt={'airlock'}
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
      {!gameOver && !gameWon && (
        <>
          <CharacterSelect
            playerType={playerType}
            setPlayerType={setPlayerType}
          />
          <p className='font-pixel mt-4 text-sm'>Use arrow keys to move</p>
        </>
      )}
    </div>
  );
}
