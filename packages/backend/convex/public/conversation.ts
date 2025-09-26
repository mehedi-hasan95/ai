import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server.js";
import { supportAgent } from "../system/ai/agents/supportAgent.js";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api.js";
import { paginationOptsValidator } from "convex/server";

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

// export const getMany = query({
//   args: {
//     contactSessionId: v.id("contactSessions"),
//     paginationOpts: paginationOptsValidator,
//   },
//   handler: async (ctx, args) => {
//     const contactSession = await ctx.db.get(args.contactSessionId);
//     if (!contactSession || contactSession.expiresAt < Date.now()) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Invalid session",
//       });
//     }
//     const conversation = await ctx.db
//       .query("conversation")
//       .withIndex("by_contact_session_id", (q) =>
//         q.eq("contactSessionId", args.contactSessionId)
//       )
//       .order("desc")
//       .paginate(args.paginationOpts);

//     const conversationWithLastMessage = await Promise.all(
//       conversation.page.map(async (conversation) => {
//         let lastMessage: MessageDoc | null = null;

//         const messages = await supportAgent.listMessages(ctx, {
//           threadId: conversation.threadId,
//           paginationOpts: { cursor: null, numItems: 1 },
//         });

//         if (
//           messages.page.length > 0 &&
//           messages.page[0]?.text?.trim() !== null
//         ) {
//           lastMessage = messages.page[0] ?? null;
//         }
//         return {
//           _id: conversation._id,
//           _creationTime: conversation._creationTime,
//           status: conversation.status,
//           organizationId: contactSession.organizationId,
//           threadId: conversation.threadId,
//           lastMessage,
//         };
//       })
//     );
//     return {
//       ...conversation,
//       page: conversationWithLastMessage,
//     };
//   },
// });

export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.db
      .query("conversation")
      .withIndex("by_contact_session_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationWithLastMessage = await Promise.all(
      conversation.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { cursor: null, numItems: 2 }, // fetch a few in case last one is empty
        });

        // Find the latest non-null message
        lastMessage =
          messages.page.find((m) => m?.text && m.text.trim() !== "") ?? null;

        return {
          _id: conversation._id,
          _creationTime: conversation._creationTime,
          status: conversation.status,
          organizationId: contactSession.organizationId,
          threadId: conversation.threadId,
          lastMessage,
        };
      })
    );

    return {
      ...conversation,
      page: conversationWithLastMessage,
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
    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        content: "Hello How can I help you today?",
      },
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
