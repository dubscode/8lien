import { CharacterType } from '@/lib/types';
import Image from 'next/image';
import { Press_Start_2P } from 'next/font/google';
import { sprites } from '@/lib/game';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin']
});

type CharacterSelectProps = {
  setPlayerType: (type: CharacterType) => void;
  playerType: CharacterType;
};

export function CharacterSelect({
  setPlayerType,
  playerType
}: CharacterSelectProps) {
  const characters: { type: CharacterType; name: string }[] = [
    { type: 'woman', name: 'Ripley' },
    { type: 'man', name: 'Hicks' },
    { type: 'android', name: 'Bishop' },
    { type: 'xenomorph', name: 'Alien' }
  ];

  return (
    <div
      className={`${pressStart2P.className} flex w-12 flex-col items-center`}
    >
      <h2 className='mb-1 text-center text-[8px] text-white'>Select</h2>
      <div className='flex flex-col gap-1 rounded-md bg-gray-800 p-1'>
        {characters.map((character) => (
          <button
            key={character.type}
            onClick={() => setPlayerType(character.type)}
            className={`flex flex-col items-center rounded p-1 transition-colors ${
              playerType === character.type
                ? 'bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={character.name}
          >
            <div className='relative size-6 overflow-hidden rounded'>
              <Image
                src={sprites[character.type]}
                alt={`${character.name} character`}
                fill
                sizes='(max-width: 768px) 24px, 24px'
                className='pixel-art object-contain'
                priority
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
