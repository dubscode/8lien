import { defineSchema, defineTable } from 'convex/server';

import { v } from 'convex/values';

export default defineSchema({
  players: defineTable({
    playerId: v.string(),
    name: v.optional(v.string()),
    gamesPlayed: v.number(),
    gamesSurvived: v.number()
  }).index('playerId', ['playerId']),
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
    .index('username', ['username'])
});
