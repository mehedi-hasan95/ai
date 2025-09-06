import { atom } from "jotai";
import { WidgetScreensTypes } from "../types/types";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { CONTACT_SESSION_KEY } from "../types/constants";
import { Id } from "@workspace/backend/_generated/dataModel";

export const screenAtom = atom<WidgetScreensTypes>("loading");
export const organizationIdAtom = atom<string | null>(null);

export const contactSessionAtomFamily = atomFamily((organizationId: string) => {
  return atomWithStorage<Id<"contactSessions"> | null>(
    `${CONTACT_SESSION_KEY}_${organizationId}`,
    null
  );
});

export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);

export const conversationIdAtom = atom<Id<"conversation"> | null>(null);
