import { action, internalMutation } from './_generated/server';
import { api, internal } from './_generated/api';

import { Id } from './_generated/dataModel';
import OpenAI from 'openai';
import { v } from 'convex/values';

export const generateImagePrompt = action({
  args: {
    monsterId: v.id('monsters'),
    promptAddition: v.optional(v.string()),
    retryCount: v.optional(v.number())
  },
  handler: async (ctx, args): Promise<string> => {
    if (args.retryCount && args.retryCount > 5) {
      throw new Error('Too many retries');
    }

    const monster = await ctx.runQuery(api.monsters.get, {
      id: args.monsterId
    });

    if (!monster) {
      throw new Error('Monster not found');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const generatedPrompt = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant specialized in crafting prompts for visually appealing, fun, and cartoony monster images for games. Focus on avoiding text or unnecessary design elements.'
        },
        {
          role: 'user',
          content: `Generate a detailed prompt to create a cartoony image of a pretend monster based on these attributes: ${JSON.stringify(monster)}. 
            Make sure the monster fills the entire 1024x1024 frame, with no additional elements such as text, logos, diagrams, charts, or borders.
            The prompt should guide DALL-E to create an image that focuses on the monster and avoids dividing it into separate parts. 
            Emphasize fun, colorful, and imaginative design, ensuring there are no labels or text on the image itself.
            ${args.promptAddition ? `this is a retry, previous prompt was flagged, please retry and take this into consideration ${args.promptAddition}` : ''}`
        }
      ]
    });

    console.log('Prompt generated:', generatedPrompt);

    const aiPrompt = generatedPrompt.choices[0].message.content as string;

    // Check if the prompt is offensive.
    const modResponse = await openai.moderations.create({
      input: aiPrompt + ' '
    });
    const modResult = modResponse.results[0];
    if (modResult.flagged) {
      console.log('Prompt was flagged:', modResult.categories);
      return await ctx.runAction(api.images.generateImagePrompt, {
        monsterId: args.monsterId,
        promptAddition: JSON.stringify({ modResult, originalPrompt: aiPrompt }),
        retryCount: (args.retryCount || 0) + 1
      });
    } else {
      return aiPrompt;
    }
  }
});

export const generateAndStoreAiImage = action({
  args: { monsterId: v.id('monsters') },
  handler: async (ctx, args) => {
    // Fetch the monster from the database
    const monster = await ctx.runQuery(api.monsters.get, {
      id: args.monsterId
    });

    if (!monster) {
      throw new Error('Monster not found');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const aiPrompt = await ctx.runAction(api.images.generateImagePrompt, {
      monsterId: args.monsterId
    });

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: aiPrompt + ' ',
      size: '1024x1024',
      n: 1,
      quality: 'standard'
    });

    console.log('Image generated:', imageResponse);

    const imageUrl = imageResponse.data[0].url;

    if (!imageUrl) {
      throw new Error('Image url not found');
    }

    // Download the image
    const response = await fetch(imageUrl);
    const image = await response.blob();

    // Store the image in Convex
    const storageId: Id<'_storage'> = await ctx.storage.store(image);

    // Write `storageId` to a document
    await ctx.runMutation(internal.images.storeResult, {
      storageId,
      prompt: aiPrompt || '',
      monsterId: args.monsterId
    });
  }
});

export const storeResult = internalMutation({
  args: {
    storageId: v.id('_storage'),
    monsterId: v.id('monsters'),
    prompt: v.string()
  },
  handler: async (ctx, args) => {
    const { storageId, prompt, monsterId } = args;
    await ctx.db.insert('images', {
      storageId,
      prompt,
      monsterId
    });
  }
});
