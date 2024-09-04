import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
    generationId: v.string(),
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('tokenLogs', {
      ...args,
      userId: args.userId || 'unknown'
    });
  }
});
