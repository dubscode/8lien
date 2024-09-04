import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { generateId, streamObject } from 'ai';

import { GenerateMonsterSchema } from '@/schemas/monsters';
import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(request: Request) {
  auth().protect();

  try {
    const existingMonsters = await fetchQuery(api.monsters.all, {});

    const prompt = {
      instructions: `Generate a random and unique monster based on our GenerateMonsterSchema. The monsters should be unique. I have including our existing monsters so
                      you can avoid duplicating them. Feel free to get creative and have fun!`,
      existingMonsters,
      generationId: generateId()
    };

    const result = await streamObject({
      model: openai('gpt-4o-2024-08-06'),
      system: `You are an AI assistant specialized in studying, researching, and identifying monsters.
               You have been tasked with generating a data table of monsters based on the following schema.
               Monsters should be fun and family friendly, but feel free to get creative. If this was a movie, PG-13 would be the rating.
               I personally love xenomorphs, facehuggers, and chestbursters, so if you can randomly sneak those in as easter eggs, that would be fun.
               The main rule, is help the users have fun.`,
      schema: GenerateMonsterSchema,
      schemaName: 'GenerateMonsterSchema',
      schemaDescription: 'Schema for generating a monster object.',
      prompt: JSON.stringify(prompt),
      temperature: 0.9,
      async onFinish(event) {
        const { usage, error, object } = event;

        console.log(
          'Monster generated: obj.genId, prompt.genId',
          object?.generationId,
          prompt.generationId
        );

        if (error) {
          console.error(
            'Error generating monster:',
            JSON.stringify(error, null, 2)
          );
        }

        await fetchMutation(api.tokenLogs.create, {
          ...usage,
          generationId: prompt.generationId
        });

        console.log('Generation logged:', usage);
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error generating monster data:', error);
    return NextResponse.json(
      { error: 'Error generating monster' },
      { status: 500 }
    );
  }
}
