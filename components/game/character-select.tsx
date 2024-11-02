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
      className={`${pressStart2P.className} flex w-28 flex-col gap-2 rounded-lg bg-gray-800 p-2`}
    >
      <h2 className='mb-2 text-center text-xs text-white'>Select Character</h2>
      {characters.map((character) => (
        <button
          key={character.type}
          onClick={() => setPlayerType(character.type)}
          className={`flex w-full flex-col items-center rounded p-2 transition-colors ${
            playerType === character.type
              ? 'bg-blue-500'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <div className='relative size-10 overflow-hidden rounded'>
            <Image
              src={sprites[character.type]}
              alt={`${character.name} character`}
              layout='fill'
              objectFit='contain'
              className='pixel-art'
            />
          </div>
          <span className='mt-2 text-xs text-white'>{character.name}</span>
        </button>
      ))}
    </div>
  );
}
