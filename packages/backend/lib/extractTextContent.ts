import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { Id } from "@workspace/backend/_generated/dataModel.js";
import { StorageActionWriter } from "convex/server";
const AI_MODELS = {
  image: google.chat("gemini-2.5-flash"),
  pdf: google.chat("gemini-2.5-flash"),
  html: google.chat("gemini-2.5-flash"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPTS = {
  image:
    "You turn images into text. If it is a photo of a document, transcribe it. If it isnot a document, describe it.",
  pdf: "You transform PDF files into text.",
  html: "YOu transform content into markdown.",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mediaType: string;
};

export const extractTextContent = async (
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> => {
  const { filename, mediaType, storageId, bytes } = args;
  const url = (await ctx.storage.getUrl(storageId)) || "Failed to get storage";

  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mediaType)) {
    return extractImageText(url);
  }

  if (mediaType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mediaType, filename);
  }

  if (mediaType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mediaType);
  }

  throw new Error(`Unsupported Media type: ${mediaType}`);
};

const extractImageText = async (url: string): Promise<string> => {
  const { text } = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });
  return text;
};

const extractPdfText = async (
  url: string,
  mediaType: string,
  filename: string
): Promise<string> => {
  const { text } = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: new URL(url), mediaType, filename },
          {
            type: "text",
            text: "Extract the text from the PDF and print it without explaining you'll do so.",
          },
        ],
      },
    ],
  });
  return text;
};

const extractTextFileContent = async (
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mediaType: string
): Promise<string> => {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuffer);
  if (mediaType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text and print it in a markdown format without explaining that you'll do so.",
            },
          ],
        },
      ],
    });
    return result.text;
  }
  return text;
};
