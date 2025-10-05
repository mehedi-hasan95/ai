import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server.js";
import { CONTACT_SESSION_MS } from "../public/contactSessions.js";

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId);
  },
});

const AUTO_REFRESH_TIMER_MS = 10 * 60 * 60 * 1000;
export const refresh = internalMutation({
  args: { contactSessionId: v.id("contactSessions") },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact session not found",
      });
    }

    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Contact session expires",
      });
    }

    const timeRemaining = contactSession.expiresAt - Date.now();

    if (timeRemaining < AUTO_REFRESH_TIMER_MS) {
      const newExpiresAt = Date.now() + CONTACT_SESSION_MS;

      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt,
      });

      return { ...contactSession, expiresAt: newExpiresAt };
    }
    return contactSession;
  },
});
