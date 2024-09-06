'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Doc } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import { MonsterDossier } from './monster-dossier';
import { api } from '@/convex/_generated/api';
import monsterPlaceholder from '@/assets/monster-placeholder-loading.png';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useState } from 'react';

type MonsterCardProps = {
  monster: Doc<'monsters'>;
};

export default function MonsterCard({ monster }: MonsterCardProps) {
  const { isSignedIn } = useAuth();
  const [showResearch, setShowResearch] = useState(false);

  const voteUp = useMutation(api.monsters.voteUp);
  const voteDown = useMutation(api.monsters.voteDown);

  const handleVoteUp = () => {
    isSignedIn && voteUp({ id: monster._id });
  };

  const handleVoteDown = () => {
    isSignedIn && voteDown({ id: monster._id });
  };

  return (
    <Card className='mx-auto w-full max-w-2xl border-2 border-primary/20 bg-primary/5'>
      <CardHeader>
        <CardTitle className='text-center text-2xl font-bold'>
          {monster.name}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center space-y-4'>
        <Dialog>
          <DialogTrigger asChild>
            <div className='relative size-96 cursor-pointer'>
              <Image
                src={monster.imageUrl || monsterPlaceholder}
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
                src={monster.imageUrl || monsterPlaceholder}
                alt={monster.name}
                layout='fill'
                objectFit='contain'
              />
            </div>
          </DialogContent>
        </Dialog>

        <div className='w-full text-center'>
          {!isSignedIn ? (
            <p className='mb-2 text-sm font-semibold text-destructive'>
              You must be signed in to vote
            </p>
          ) : null}
          <div className='mb-4 flex justify-center space-x-4'>
            <Button
              className='flex flex-row items-center'
              onClick={() => handleVoteUp()}
              disabled={!isSignedIn}
            >
              <ThumbsUp className='mr-3' /> ({monster.safeVotes})
            </Button>
            <Button onClick={() => handleVoteDown()} disabled={!isSignedIn}>
              <ThumbsDown className='mr-3' /> ({monster.dangerousVotes})
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
