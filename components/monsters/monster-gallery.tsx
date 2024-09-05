'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { useMutation, useQuery } from 'convex/react';

import { Button } from '@/components/ui/button';
import { GenerateMonsterSchema } from '@/schemas/monsters';
import MonsterCard from '@/components/monsters/monster-card';
import MonsterLeaderboard from '@/components/monsters/monster-leaderboard';
import { api } from '@/convex/_generated/api';
import { experimental_useObject as useObject } from 'ai/react';

export default function MonsterGallery() {
  const createMonster = useMutation(api.monsters.create);
  const monsters = useQuery(api.monsters.all, {});
  const { object, submit, isLoading } = useObject({
    api: '/api/ai',
    schema: GenerateMonsterSchema
  });

  const handleSaveMonster = async () => {
    if (!object) return;
    // @ts-ignore there are some lame TS issue with (string | undefined)[] that I can't figure out where they are coming from. I think its convex
    createMonster(object);
  };

  return (
    <div className='container mx-auto flex flex-col space-y-8 p-8'>
      <div className='flex justify-center space-x-4'>
        <Button disabled={isLoading} onClick={() => submit({})}>
          Generate a monster object
        </Button>
        <Button disabled={!object || isLoading} onClick={handleSaveMonster}>
          Save Monster
        </Button>
      </div>

      <div className='w-full'>
        <h2 className='mb-6 text-center text-3xl font-bold'>Monster Gallery</h2>
        <Carousel className='mx-auto w-full max-w-4xl'>
          <CarouselContent>
            {monsters?.map((monster, index) => (
              <CarouselItem key={index}>
                <MonsterCard monster={monster} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='mt-4 flex justify-center'>
            <CarouselPrevious className='mr-2' />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      <div className='flex flex-col gap-8 md:flex-row'>
        <div className='w-full md:w-1/2'>
          <MonsterLeaderboard />
        </div>
        <div className='w-full md:w-1/2'>
          {object && (
            <div>
              <h2 className='mb-4 text-2xl font-bold'>Generated Monster</h2>
              <pre className='w-full overflow-x-auto rounded-lg p-4'>
                {JSON.stringify(object, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
