import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server.js";
import { internal } from "../_generated/api.js";
import { supportAgent } from "../system/ai/agents/supportAgent.js";
import { paginationOptsValidator } from "convex/server";
import { resolveConversation } from "../system/tools/resolveConversation.js";
import { escalateConversation } from "../system/tools/escalateConversation.js";
import { search } from "../system/tools/search.js";

export const create = action({
  args: {
    prompt: v.string(),
    theradId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    );
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.theradId,
      }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved",
      });
    }

    // todo: implement subscription
    const shouldTriggerAgent = conversation.status === "unresolved";
    if (shouldTriggerAgent) {
      await supportAgent.generateText(
        ctx,
        { threadId: args.theradId },
        {
          prompt: args.prompt,
          tools: {
            resolveConversation,
            escalateConversation,
            search,
          },
        }
      );
    } else {
      await supportAgent.saveMessage(ctx, {
        threadId: args.theradId,
        prompt: args.prompt,
      });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }
    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
    return paginated;
  },
});
