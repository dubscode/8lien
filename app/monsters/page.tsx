'use client';

import { useMutation, useQuery } from 'convex/react';

import { GenerateMonsterSchema } from '@/schemas/monsters';
import Image from 'next/image';
import { api } from '@/convex/_generated/api';
import { experimental_useObject as useObject } from 'ai/react';

export default function Page() {
  const createMonster = useMutation(api.monsters.create);

  const monsters = useQuery(api.monsters.all, {});

  const { object, submit } = useObject({
    api: '/api/ai',
    schema: GenerateMonsterSchema
  });

  const handleSaveMonster = async () => {
    if (!object) {
      return;
    }

    // @ts-ignore there are some lame TS issue with (string | undefined)[] that I can't
    // figure out where they are coming from. I think its convex
    createMonster(object);
  };

  return (
    <div>
      <button onClick={() => submit({})}>Generate a monster object</button>
      <button onClick={handleSaveMonster}>Save Monster</button>
      {object && (
        <div>
          <h2>Generated Monster</h2>
          <pre className='w-96'>{JSON.stringify(object, null, 2)}</pre>
        </div>
      )}

      <h2>Monsters</h2>
      {monsters?.map((monster) => (
        <div key={monster._id}>
          <h3>{monster.name}</h3>
          <Image src={monster.imageUrl || ''} alt={monster.name} />
        </div>
      ))}
    </div>
  );
}
