import { CharacterType } from '@/lib/types';

type CharacterSelectProps = {
  setPlayerType: (type: CharacterType) => void;
  playerType: CharacterType;
};

export function CharacterSelect({
  setPlayerType,
  playerType
}: CharacterSelectProps) {
  return (
    <div className='mt-4 space-x-2'>
      <button
        onClick={() => setPlayerType('woman')}
        className={`font-pixel rounded px-3 py-1 text-sm ${
          playerType === 'woman' ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        Ripley
      </button>
      <button
        onClick={() => setPlayerType('man')}
        className={`font-pixel rounded px-3 py-1 text-sm ${
          playerType === 'man' ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        Cpl. Hicks
      </button>
      <button
        onClick={() => setPlayerType('android')}
        className={`font-pixel rounded px-3 py-1 text-sm ${
          playerType === 'android' ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        Bishop
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
  );
}
