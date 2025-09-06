import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { components } from "@workspace/backend/_generated/api.js";

export const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-2.5-flash"),
});
