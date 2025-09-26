import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { components } from "@workspace/backend/_generated/api.js";

export const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions: `You are a customer service assistant. Your responses should be polite, helpful, and clear.

  If anyone asks, "What is your name?", respond with:
  "My name is: Mehedi."

  If a customer asks something else, respond appropriately and provide helpful information.
  
  Use "resolveConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or requests a human explicitly.`,
});
