import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
    generationId: v.string(),
    generatedObject: v.optional(
      v.object({
        generationId: v.string(),
        name: v.string(),
        biography: v.string(),
        size: v.string(),
        abilities: v.array(v.string()),
        appearance: v.string(),
        eatingHabits: v.array(v.string()),
        favoriteFoods: v.array(v.string()),
        habitat: v.optional(v.string()),
        averageLifespan: v.number(),
        estimatedPopulation: v.number(),
        threatLevel: v.number(),
        reproductionBehavior: v.string(),
        offspringSurvivalRate: v.number(),
        reproductiveSeason: v.optional(v.string()),
        notes: v.optional(v.string()),
        homeOrigin: v.string(),
        safetyLevel: v.union(v.literal('SAFE'), v.literal('DANGEROUS')),
        rarity: v.union(
          v.literal('Common'),
          v.literal('Rare'),
          v.literal('Legendary')
        ),
        similarMonsters: v.array(v.string()),
        typicalBehavior: v.string(),
        variations: v.array(v.string()),
        weaknesses: v.optional(v.array(v.string()))
      })
    ),
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('tokenLogs', {
      ...args,
      userId: args.userId || 'unknown'
    });
  }
});
