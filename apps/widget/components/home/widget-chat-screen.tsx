"use client";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, MenuIcon } from "lucide-react";
import {
  contactSessionAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../attom/widget-attom";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || "")
  );

  const conversation = useQuery(
    api.public.conversation.getOne,
    contactSessionId && conversationId
      ? { contactSessionId, conversationId }
      : "skip"
  );

  const onBack = () => {
    (setConversationId(null), setScreen("selection"));
  };
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-10 ">
        <div className="flex items-center justify-between">
          <Button variant={"transparent"} size={"icon"} onClick={onBack}>
            <ArrowLeft />
            Back
          </Button>
          <Button variant={"transparent"} size={"icon"}>
            <MenuIcon />
          </Button>
        </div>
      </div>
      <div className="px-6 py-5">{JSON.stringify(conversation, null, 2)}</div>
    </>
  );
};
