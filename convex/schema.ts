import { defineSchema, defineTable } from 'convex/server';

import { v } from 'convex/values';

export default defineSchema({
  monsters: defineTable({
    name: v.string(),
    health: v.number(),
    attack: v.number()
  }),
  users: defineTable({
    // Unique identifier from the auth provider
    tokenIdentifier: v.string(),
    name: v.string(),
    username: v.optional(v.string()),
    pictureUrl: v.string(),
    numPosts: v.number()
  })
    .index('tokenIdentifier', ['tokenIdentifier'])
    .index('username', ['username']),
  posts: defineTable({
    authorId: v.id('users'),
    text: v.string()
  }).index('authorId', ['authorId'])
});
