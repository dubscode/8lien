import { generateId, generateObject } from 'ai';

import { GenerateMonsterSchema } from '../schemas/monsters';
import { action } from './_generated/server';
import { api } from './_generated/api';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export const generateMonsterObject = action({
  args: {},
  handler: async (
    ctx,
    args
  ): Promise<z.infer<typeof GenerateMonsterSchema>> => {
    const existingMonsters = await ctx.runQuery(
      api.monsters.topExistingMonsters,
      {}
    );

    if (!existingMonsters || existingMonsters.length === 0) {
      throw new Error('Monsters not found');
    }

    const prompt = {
      instructions: `Generate a random and truly unique monster using our GenerateMonsterSchema. The monster should be unlike any existing ones and stand out with distinctive traits, personality, and abilities.
      
      Be bold and imaginative! Monsters can have strange or unexpected powers, interesting backstories, and even quirky habits. They can be dangerous, but make sure they're still fun in some way—whether through their behavior, appearance, or unusual abilities. 
       
      The goal is to create a monster that feels alive and has personality. Avoid duplicating any of the monsters I've listed in 'existingMonsters'. Here's what we're looking for:
       
      - Unique physical traits (number of limbs, skin texture, colors, etc.)
      - Fascinating abilities or quirks (think beyond typical powers)
      - Fun details that make the monster memorable (even if it's dangerous to humans)
      - Playful or interesting behaviors
      
      Be as creative as possible and think outside the box!`,
      existingMonsters,
      generationId: generateId()
    };

    const result = await generateObject({
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
      temperature: 0.9
    });

    console.log('Object generated:', result);

    await ctx.runMutation(api.tokenLogs.create, {
      ...result.usage,
      generationId: prompt.generationId,
      generatedObject: result.object
    });

    // @ts-ignore
    const monster = await ctx.runMutation(api.monsters.create, result.object);

    console.log('Monster created:', monster);

    return result.object;
  }
});
