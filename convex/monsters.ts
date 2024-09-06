import { mutation, query } from './_generated/server';

import { api } from './_generated/api';
import { v } from 'convex/values';

export const all = query({
  args: {},
  handler: async (ctx, args) => {
    const result = await ctx.db.query('monsters').order('asc').collect();

    return Promise.all(
      result.map(async (monster) => {
        const monsterImage = await ctx.db
          .query('images')
          .filter((q) => q.eq(q.field('monsterId'), monster._id))
          .first();
        if (monsterImage) {
          monster.imageUrl =
            (await ctx.storage.getUrl(monsterImage.storageId)) || '';
        }
        return monster;
      })
    );
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

    // Find images for the monster
    const monsterImage = await ctx.db
      .query('images')
      .filter((q) => q.eq(q.field('monsterId'), monster._id))
      .first();

    if (monsterImage) {
      monster.imageUrl =
        (await ctx.storage.getUrl(monsterImage.storageId)) || '';
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
    const newMonster = await ctx.db.insert('monsters', {
      ...args,
      countdownTimer: 0,
      dangerousVotes: 0,
      safeVotes: 0
    });

    if (newMonster) {
      // generate and store an image for the new monster
      await ctx.scheduler.runAfter(0, api.images.generateAndStoreAiImage, {
        monsterId: newMonster
      });
    }

    return newMonster;
  }
});
