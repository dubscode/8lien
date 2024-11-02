import { Dispatch, SetStateAction, useEffect } from 'react';

import Image from 'next/image';
import { sprites } from '@/lib/game';

type GameWonProps = {
  initializeGame: () => void;
  setSurvived: Dispatch<SetStateAction<number>>;
};

export function GameWon({ initializeGame, setSurvived }: GameWonProps) {
  const handleInitializeGame = () => {
    setSurvived((prev) => prev + 1);
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
        src={sprites.airlock}
        alt='Airlock'
        layout='fill'
        objectFit='contain'
        className='opacity-20'
      />
      <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
        <h2 className='font-pixel mb-4 text-4xl'>You Survived!</h2>
        <p className='mb-4'>
          You have successfully blasted the alien through the airlock!
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
