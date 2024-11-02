import { QueryCtx, mutation, query } from './_generated/server';

import { faker } from '@faker-js/faker';
import { v } from 'convex/values';

const generateName = () => {
  return `${faker.science.chemicalElement().name}  ${faker.person.lastName()}`;
};

export const getPlayer = query({
  args: {
    playerId: v.union(v.string(), v.null())
  },
  handler: async (ctx, args) => {
    if (!args.playerId) {
      return null;
    } else {
      return await ctx.db
        .query('players')
        .withIndex('playerId', (q) => q.eq('playerId', args.playerId!))
        .unique();
    }
  }
});

export async function getUser(ctx: QueryCtx, username: string) {
  return await ctx.db
    .query('users')
    .withIndex('username', (q) => q.eq('username', username))
    .unique();
}

export const updateScore = mutation(
  async (
    { db },
    {
      playerId,
      gamesPlayed,
      gamesSurvived
    }: { playerId: string; gamesPlayed: number; gamesSurvived: number }
  ) => {
    const existingPlayer = await db
      .query('players')
      .filter((q) => q.eq(q.field('playerId'), playerId))
      .first();

    if (existingPlayer) {
      const existingName = existingPlayer.name;

      // Update the existing players's score
      await db.patch(existingPlayer._id, {
        gamesPlayed,
        gamesSurvived,
        name: existingName || generateName()
      });
    } else {
      // Create a new user record
      const name = generateName();

      await db.insert('players', {
        playerId,
        name,
        gamesSurvived,
        gamesPlayed
      });
    }
  }
);
