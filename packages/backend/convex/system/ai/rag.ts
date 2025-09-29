import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "@workspace/backend/_generated/api.js";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbedding("gemini-embedding-001"),
  embeddingDimension: 3072,
});

export default rag;
