import { Button } from "@workspace/ui/components/button";
import { WidgetChildrenScreen } from "./widget-children-screen";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../attom/widget-attom";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "./widget-footer";

export const WidgetSelectionScreen = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const setScreen = useSetAtom(screenAtom);
  const setConversation = useSetAtom(conversationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || "")
  );
  const createConversation = useMutation(api.public.conversation.create);

  const handleNewConversation = async () => {
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Organization Id is required");
      return;
    }
    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversation(conversationId);
      setScreen("chat");
    } catch (error) {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <WidgetChildrenScreen className="items-start justify-start">
        <Button
          onClick={handleNewConversation}
          className="h-16 w-full justify-between"
          variant="outline"
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-5" />
          </div>
          <ChevronRightIcon />
        </Button>
      </WidgetChildrenScreen>
      <WidgetFooter />
    </>
  );
};
