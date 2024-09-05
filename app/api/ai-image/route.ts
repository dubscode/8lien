import { fetchMutation, fetchQuery } from 'convex/nextjs';

import { Id } from '@/convex/_generated/dataModel';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { generateId } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Allow streaming responses up to 60 seconds
export const maxDuration = 90;

export async function POST(request: Request) {
  // auth().protect();

  const body: { monsterId?: Id<'monsters'> } = await request.json();
  const { monsterId } = body;

  if (!monsterId) {
    return NextResponse.json({ error: 'Missing monsterId' }, { status: 400 });
  }

  try {
    const monster = await fetchQuery(api.monsters.get, { id: monsterId });

    if (!monster) {
      return NextResponse.json({ error: 'Monster not found' }, { status: 404 });
    }

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
          content: `Generate a detailed prompt to create a cartoony image of a pretend monster based on these attributes: ${JSON.stringify(monster)}. Make sure the monster fills the entire 1024x1024 frame, with no additional elements such as text, logos, diagrams, charts, or borders. The prompt should guide DALL-E to create an image that focuses on the monster and avoids dividing it into separate parts. Emphasize fun, colorful, and imaginative design, ensuring there are no labels or text on the image itself.`
        }
      ]
    });

    console.log('Prompt generated:', generatedPrompt);

    const aiPrompt = generatedPrompt.choices[0].message.content;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: generatedPrompt.choices[0].message.content + ' ',
      size: '1024x1024',
      n: 1,
      quality: 'standard'
    });

    console.log('Image generated:', response);

    return NextResponse.json({
      imageUrl: response.data[0].url,
      generationId: generateId(),
      monsterId,
      prompt: aiPrompt
    });
  } catch (error) {
    console.error('Error generating monster data:', error);
    return NextResponse.json(
      { error: 'Error generating monster' },
      { status: 500 }
    );
  }
}
