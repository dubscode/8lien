'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

const GRID_SIZE = 20;
const CELL_SIZE = 40; // Increased for better sprite visibility

type CharacterType = 'human' | 'android' | 'alien' | 'facehugger';

interface Position {
  x: number;
  y: number;
}

const sprites = {
  human:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B307A588-DFBF-4B5D-82AD-488D1E6FF972-YIPDCjjGOyfs2GobqrSjp1cUqwbxAE.png',
  android:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2F8B7330-4165-4A40-9D67-5761689DB3E9-gMXKw3L22UqpnxixPs6NUzBmZRmiU2.png',
  alien:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DC4963D3-E060-4E54-880E-B8F5C378FAB7-tcH7ds6IZ4XLC1ccFuj38hI8REHMJD.png',
  facehugger:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5665519A-58DC-45A9-ADD8-F34FACD2C27E-KqYetV8M2xrnCTaKxBvq6ykT2DiIRc.png',
  alienHead:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/B1910C40-D314-47C1-B04B-0A4342BB82DB-fIRhnhjdfoAI8X911DCe4kkG7vQalp.png'
};

export function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState<Position>({
    x: 0,
    y: 0
  });
  const [playerType, setPlayerType] = useState<CharacterType>('human');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setPlayerPosition((prev) => ({
            ...prev,
            y: Math.max(0, prev.y - 1)
          }));
          break;
        case 'ArrowDown':
          setPlayerPosition((prev) => ({
            ...prev,
            y: Math.min(GRID_SIZE - 1, prev.y + 1)
          }));
          break;
        case 'ArrowLeft':
          setPlayerPosition((prev) => ({
            ...prev,
            x: Math.max(0, prev.x - 1)
          }));
          break;
        case 'ArrowRight':
          setPlayerPosition((prev) => ({
            ...prev,
            x: Math.min(GRID_SIZE - 1, prev.x + 1)
          }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <h1 className='font-pixel mb-4 text-4xl font-bold'>
        Alien: 8-bit Escape
      </h1>
      <div
        className='grid border-4 border-gray-700 bg-gray-900 p-2'
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isPlayer = x === playerPosition.x && y === playerPosition.y;

          return (
            <div
              key={index}
              className={`relative border border-gray-800/20 ${isPlayer ? 'bg-gray-800/50' : ''} `}
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
        })}
      </div>
      <div className='mt-4 space-x-2'>
        <button
          onClick={() => setPlayerType('human')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'human' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Human
        </button>
        <button
          onClick={() => setPlayerType('android')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'android' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Android
        </button>
        <button
          onClick={() => setPlayerType('alien')}
          className={`font-pixel rounded px-3 py-1 text-sm ${playerType === 'alien' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          Alien
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
