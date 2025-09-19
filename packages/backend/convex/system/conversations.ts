import { v } from "convex/values";
import { internalQuery } from "../_generated/server.js";

export const getByThreadId = internalQuery({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversation")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .unique();
    return conversation;
  },
});
