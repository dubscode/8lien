import { mutation, query } from './_generated/server';

import { v } from 'convex/values';

export const all = query({
  args: {},
  handler: async (ctx, args) => {
    const result = await ctx.db.query('monsters').order('asc').collect();

    return result;
  }
});

export type Monster = NonNullable<Awaited<ReturnType<typeof get>>>;

export const get = query({
  args: { id: v.id('monsters') },
  handler: async (ctx, args) => {
    const monster = await ctx.db.get(args.id);
    if (monster === null) {
      return null;
    }
    return monster;
  }
});

export const create = mutation({
  args: {
    generationId: v.optional(v.string()),
    name: v.string(),
    abilities: v.array(v.string()),
    appearance: v.string(),
    averageLifespan: v.number(),
    biography: v.string(),
    eatingHabits: v.array(v.string()),
    estimatedPopulation: v.number(),
    favoriteFoods: v.array(v.string()),
    habitat: v.optional(v.string()),
    homeOrigin: v.string(),
    imageUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    offspringSurvivalRate: v.number(),
    rarity: v.string(),
    reproductionBehavior: v.string(),
    reproductiveSeason: v.optional(v.string()),
    safetyLevel: v.union(v.literal('SAFE'), v.literal('DANGEROUS')),
    size: v.string(),
    threatLevel: v.number(),
    similarMonsters: v.array(v.id('monsters')),
    typicalBehavior: v.string(),
    variations: v.array(v.string()),
    weaknesses: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Called createMonster without being authenticated');
    }

    await ctx.db.insert('monsters', {
      ...args,
      countdownTimer: 0,
      dangerousVotes: 0,
      safeVotes: 0
    });
  }
});
