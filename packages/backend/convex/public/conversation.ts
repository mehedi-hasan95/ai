import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server.js";
import { supportAgent } from "../system/ai/agents/supportAgent.js";

export const getOne = query({
  args: {
    conversationId: v.id("conversation"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }
    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid contact session",
      });
    }
    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }
    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });
    const conversationId = await ctx.db.insert("conversation", {
      contactSessionId: session._id,
      organizationId: args.organizationId,
      status: "unresolved",
      threadId,
    });
    return conversationId;
  },
});
