'use client';

import { CellType, CharacterType, NPC, Position } from '@/lib/types';
import { GRID_SIZE, generateMaze, sprites } from '@/lib/game';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';

import { CharacterSelect } from './character-select';
import { GameOver } from './game-over';
import { GameWon } from './game-won';
import Image from 'next/image';
import { Scoreboard } from '@/components/game/scoreboard';
import { api } from '@/convex/_generated/api';
import { initialMaze } from '@/components/game/initial-maze';
import { v4 as uuidv4 } from 'uuid';

export function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 1,
    y: 1
  });
  const [playerType, setPlayerType] = useState<CharacterType>('woman');
  const [maze, setMaze] = useState<CellType[][]>(initialMaze);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [played, setPlayed] = useState(0);
  const [survived, setSurvived] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cellSize, setCellSize] = useState(40);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const player = useQuery(api.players.getPlayer, { playerId });

  useEffect(() => {
    if (player) {
      setPlayed(player.gamesPlayed);
      setSurvived(player.gamesSurvived);
    } else {
      setPlayed(0);
      setSurvived(0);
    }
  }, [player]);

  const updateUserScore = useMutation(api.players.updateScore);

  useEffect(() => {
    // Get or create player ID
    let storedPlayerId = localStorage.getItem('alienGamePlayerId');
    if (!storedPlayerId) {
      storedPlayerId = uuidv4();
      localStorage.setItem('alienGamePlayerId', storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  const handleGameOver = () => {
    setPlayerType('chestburster');
    setGameOver(true);

    if (playerId) {
      updateUserScore({
        playerId,
        gamesPlayed: played + 1,
        gamesSurvived: survived
      });
    }
  };

  const handleGameWon = () => {
    setGameWon(true);

    if (playerId) {
      updateUserScore({
        playerId,
        gamesPlayed: played + 1,
        gamesSurvived: survived + 1
      });
    }
  };

  const difficulty = useMemo(() => {
    const survivalRate = played < 1 ? 0 : survived / played;

    if (survivalRate < 0.33) return 'easy';
    else if (survivalRate < 0.66) return 'medium';
    else return 'hard';
  }, [survived, played]);

  const npcSpeed = useMemo(() => {
    switch (difficulty) {
      case 'easy':
        return 1000;
      case 'medium':
        return 700;
      case 'hard':
        return 500;
    }
  }, [difficulty]);

  const initializeGame = useCallback(() => {
    const newMaze = generateMaze(GRID_SIZE, difficulty);
    setMaze(newMaze);
    setPlayerPosition({ x: 1, y: 1 });
    setPlayerType('woman');

    const validPositions = newMaze
      .flatMap((row, y) =>
        row.map((cell, x) =>
          cell === 'empty' && (x !== 1 || y !== 1) ? { x, y } : null
        )
      )
      .filter(Boolean);

    const npcCount =
      difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;

    const newNpcs = ['facehugger', 'xenomorph', 'chestburster', 'android']
      .slice(0, npcCount)
      .map((type, id) => ({
        id,
        position: validPositions.splice(
          Math.floor(Math.random() * validPositions.length),
          1
        )[0],
        type
      }))
      .filter((npc) => npc.position);

    setNpcs(newNpcs as NPC[]);
    setGameOver(false);
    setGameWon(false);
  }, [difficulty]);

  useEffect(() => {
    initializeGame();

    const handleResize = () => {
      const containerWidth = window.innerWidth - 32; // 32px for padding
      const containerHeight = window.innerHeight - 275; // Reserve space for title and instructions
      const newCellSize = Math.floor(
        Math.min(containerWidth, containerHeight) / GRID_SIZE
      );
      setCellSize(newCellSize);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    const npcMoveInterval = setInterval(moveNpcs, npcSpeed);
    return () => clearInterval(npcMoveInterval);
  }, [moveNpcs, npcSpeed]);

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
          handleGameWon();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPosition, maze, gameOver]);

  useEffect(() => {
    const collidingNpc = npcs.find(
      (npc) =>
        npc.position.x === playerPosition.x &&
        npc.position.y === playerPosition.y
    );
    if (collidingNpc) {
      handleGameOver();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPosition, npcs]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-between bg-black p-4 text-white'>
      <h1 className='font-pixel mb-4 text-2xl font-bold sm:text-3xl md:text-4xl'>
        Alien: 8-bit Escape
      </h1>
      <Scoreboard
        cellSize={cellSize}
        difficulty={difficulty}
        gamesPlayed={played}
        gamesSurvived={survived}
      />
      <div className='flex max-h-full w-full max-w-full flex-1 items-center justify-center overflow-auto'>
        {!gameOver && !gameWon && (
          <div className='mt-1'>
            <CharacterSelect
              playerType={playerType}
              setPlayerType={setPlayerType}
            />
          </div>
        )}
        {gameOver ? (
          <GameOver initializeGame={initializeGame} />
        ) : gameWon ? (
          <GameWon initializeGame={initializeGame} />
        ) : (
          <div
            className='grid border-4 border-gray-700 bg-gray-900 p-2'
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`
            }}
          >
            {maze.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer =
                  x === playerPosition.x && y === playerPosition.y;
                const npc = npcs.find(
                  (npc) => npc.position.x === x && npc.position.y === y
                );
                const airlock = x === GRID_SIZE - 2 && y === GRID_SIZE - 2;
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`relative ${cell === 'wall' ? 'bg-gray-700' : 'bg-gray-900'} ${isPlayer ? 'bg-gray-800/50' : ''}`}
                  >
                    {isPlayer && (
                      <Image
                        src={sprites[playerType]}
                        alt={playerType}
                        width={cellSize}
                        height={cellSize}
                        className='pixel-art absolute left-0 top-0 h-full w-full object-contain'
                        priority
                      />
                    )}
                    {npc && (
                      <Image
                        src={sprites[npc.type]}
                        alt={npc.type}
                        width={cellSize}
                        height={cellSize}
                        className='pixel-art absolute left-0 top-0 h-full w-full object-contain'
                        priority
                      />
                    )}
                    {airlock && (
                      <Image
                        src={sprites['airlock']}
                        alt={'airlock'}
                        width={cellSize}
                        height={cellSize}
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
      </div>
      {!gameOver && !gameWon && (
        <div className='flex flex-col'>
          <p className='font-pixel text-center text-xs sm:text-sm'>
            Use arrow keys to move.
          </p>
        </div>
      )}
    </div>
  );
}
