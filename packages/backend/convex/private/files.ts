import { ConvexError, v } from "convex/values";
import { action, mutation } from "../_generated/server.js";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { extractTextContent } from "lib/extractTextContent.js";
import rag from "../system/ai/rag.js";
import { en } from "zod/v4/locales";
import { Id } from "../_generated/dataModel.js";

const guessMimeType = (filename: string, bytes: ArrayBuffer): string => {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
};

export const addFile = action({
  args: {
    filename: v.string(),
    mediaType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const { bytes, filename, category } = args;

    const mediaType = args.mediaType || guessMimeType(filename, bytes);
    const blob = new Blob([bytes], { type: mediaType });
    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      filename,
      mediaType,
      storageId,
      bytes,
    });

    const { created, entryId } = await rag.add(ctx, {
      namespace: orgId,
      text,
      key: filename,
      title: filename,
      metadata: {
        storageId,
        filename,
        category: category ?? null,
        uploadedBy: orgId,
      },
      contentHash: await contentHashFromArrayBuffer(bytes),
    });
    if (!created) {
      console.debug("Entry already exists, skipping upload metadata");
      await ctx.storage.delete(storageId);
    }
    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const namespace = await rag.getNamespace(ctx, { namespace: orgId });
    if (namespace) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid namespace",
      });
    }

    const entry = await rag.getEntry(ctx, { entryId: args.entryId });
    if (!entry) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }

    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid organization ID",
      });
    }

    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
    }

    await rag.deleteAsync(ctx, { entryId: args.entryId });
  },
});
