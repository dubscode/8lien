import { Dispatch, SetStateAction, useEffect } from 'react';

import Image from 'next/image';
import { sprites } from '@/lib/game';

type GameOverProps = {
  initializeGame: () => void;
  setSurvived: Dispatch<SetStateAction<number>>;
};

export function GameOver({ initializeGame, setSurvived }: GameOverProps) {
  const handleInitializeGame = () => {
    setSurvived((prev) => (prev > 0 ? prev - 1 : 0));
    initializeGame();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleInitializeGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
          onClick={handleInitializeGame}
          className='font-pixel focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'
          aria-label='Play Again'
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
