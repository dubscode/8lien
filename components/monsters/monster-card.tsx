'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Doc } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import { MonsterDossier } from './monster-dossier';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';

type MonsterCardProps = {
  monster: Doc<'monsters'>;
};

export default function MonsterCard({ monster }: MonsterCardProps) {
  const [showResearch, setShowResearch] = useState(false);
  const [timeLeft, setTimeLeft] = useState(monster.countdownTimer);

  const voteForMonster = () => console.log('Voting for monster');

  // useEffect(() => {
  //   if (timeLeft > 0) {
  //     const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setShowResearch(true);
  //   }
  // }, [timeLeft]);

  const handleVote = (safety: 'SAFE' | 'DANGEROUS') => {
    // TODO - Implement voting
    // voteForMonster({ monsterId: monster._id, safety });
  };

  return (
    <Card className='bg-primary/5 border-primary/20 mx-auto w-full max-w-2xl border-2'>
      <CardHeader>
        <CardTitle className='text-center text-2xl font-bold'>
          {monster.name}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center space-y-4'>
        <Dialog>
          <DialogTrigger asChild>
            <div className='relative h-64 w-64 cursor-pointer'>
              <Image
                src={
                  monster.imageUrl || '/placeholder.svg?height=256&width=256'
                }
                alt={monster.name}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          </DialogTrigger>
          <DialogContent className='max-w-3xl'>
            <div className='relative h-[80vh] w-full'>
              <Image
                src={
                  monster.imageUrl || '/placeholder.svg?height=1024&width=1024'
                }
                alt={monster.name}
                layout='fill'
                objectFit='contain'
              />
            </div>
          </DialogContent>
        </Dialog>

        <div className='w-full text-center'>
          <p className='mb-2 text-xl font-semibold'>Time Left: {timeLeft}s</p>
          <div className='mb-4 flex justify-center space-x-4'>
            <Button onClick={() => handleVote('SAFE')} disabled={showResearch}>
              Safe ({monster.safeVotes})
            </Button>
            <Button
              onClick={() => handleVote('DANGEROUS')}
              disabled={showResearch}
            >
              Dangerous ({monster.dangerousVotes})
            </Button>
            <Button onClick={() => setShowResearch(!showResearch)}>
              {showResearch ? 'Hide' : 'Show'} Dossier
            </Button>
          </div>
        </div>

        <MonsterDossier monster={monster} showResearch={showResearch} />
      </CardContent>
    </Card>
  );
}
