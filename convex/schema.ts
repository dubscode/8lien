import { defineSchema, defineTable } from 'convex/server';

import { v } from 'convex/values';

export default defineSchema({
  monsters: defineTable({
    name: v.string(),
    abilities: v.array(v.string()), // Special abilities or powers
    appearance: v.string(), // Description of appearance
    averageLifespan: v.number(), // Average lifespan in years
    biography: v.string(), // A brief biography of this particular monster.
    eatingHabits: v.array(v.string()), // Array of eating habits (e.g., Carnivorous)
    estimatedPopulation: v.number(), // Estimated population
    favoriteFoods: v.array(v.string()), // List of favorite foods
    habitat: v.optional(v.string()), // Specific habitat or environment
    homeOrigin: v.string(), // Home planet, dimension, or realm
    imageUrl: v.optional(v.string()), // URL for monster image
    notes: v.optional(v.string()), // Additional notes
    offspringSurvivalRate: v.number(), // A ratio (0-1) indicating the likelihood that the monster's offspring will survive into adulthood.
    rarity: v.string(), // Rarity level (e.g., Common, Rare, Legendary)
    reproductionBehavior: v.string(), // Description of reproduction behavior
    reproductiveSeason: v.optional(v.string()), // Season for reproduction
    safetyLevel: v.union(v.literal('SAFE'), v.literal('DANGEROUS')),
    similarMonsters: v.array(v.id('monsters')), // References to similar monsters
    size: v.string(), // Size of the monster (e.g., Small, Medium, Large)
    threatLevel: v.number(), // Level of danger (1-10)
    typicalBehavior: v.string(), // Description of behavior
    variations: v.array(v.string()), // Different versions or subspecies
    weaknesses: v.array(v.string()), // Known weaknesses

    // Research study-related fields
    countdownTimer: v.number(), // Time left in the research study (in seconds, for example)
    dangerousVotes: v.number(), // Track votes for DANGEROUS
    safeVotes: v.number(), // Track votes for SAFE
    generationId: v.optional(v.string())
  })
    .index('name', ['name'])
    .index('safetyLevel', ['safetyLevel'])
    .index('byLikes', ['safeVotes']),
  users: defineTable({
    // Unique identifier from the auth provider
    tokenIdentifier: v.string(),
    name: v.string(),
    username: v.optional(v.string()),
    pictureUrl: v.string(),
    numPosts: v.number(),
    superAdmin: v.optional(v.boolean()),
    userId: v.string()
  })
    .index('tokenIdentifier', ['tokenIdentifier'])
    .index('username', ['username']),
  images: defineTable({
    storageId: v.id('_storage'),
    monsterId: v.id('monsters'),
    prompt: v.string()
  }),
  tokenLogs: defineTable({
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
    generationId: v.string(),
    userId: v.string(),
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
    )
  })
});
