"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { formatDistanceToNow } from "date-fns";
import { WidgetFooter } from "./widget-footer";
import {
  contactSessionAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../attom/widget-attom";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/ai/conversation-status-icon";
import { ArrowLeft } from "lucide-react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || "")
  );
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversation = usePaginatedQuery(
    api.public.conversation.getMany,
    contactSessionId ? { contactSessionId } : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: conversation.status,
      loadMore: conversation.loadMore,
      loadSize: 10,
      observerEnable: true,
    });
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="px-6 py-10">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeft />
            <p>Inbox</p>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-y-4 p-4 w-full overflow-y-auto">
        {conversation.results.length > 0 &&
          conversation?.results.map((conv) => (
            <Button
              className="h-20 w-full justify-between"
              key={conv._id}
              onClick={() => {
                setConversationId(conv._id);
                setScreen("chat");
              }}
              variant="outline"
            >
              <div className="flex w-full flex-col overflow-hidden gap-4 text-start">
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="text-muted-foreground text-sm">Chat</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(
                      new Date(conv.lastMessage?._creationTime || 0)
                    )}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="truncate text-xs">{conv.lastMessage?.text}</p>
                  <ConversationStatusIcon
                    status={conv.status}
                    className="shrink-0"
                  />
                </div>
              </div>
            </Button>
          ))}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
