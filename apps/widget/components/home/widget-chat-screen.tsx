"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, MenuIcon } from "lucide-react";
import {
  contactSessionAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../attom/widget-attom";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avater";

const formSchema = z.object({
  message: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || "")
  );
  const onBack = () => {
    (setConversationId(null), setScreen("selection"));
  };
  const conversation = useQuery(
    api.public.conversation.getOne,
    contactSessionId && conversationId
      ? { contactSessionId, conversationId }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? { threadId: conversation.threadId, contactSessionId }
      : "skip",
    { initialNumItems: 10 }
  );

  const {
    canLoadMore,
    handleLoadMore,
    isExhausted,
    isLoadingFirstPage,
    isLoadingMore,
    topElementRef,
  } = useInfiniteScroll({
    loadMore: messages.loadMore,
    loadSize: 10,
    status: messages.status,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!conversation || !contactSessionId) {
      return;
    }
    form.reset();
    await createMessage({
      contactSessionId,
      prompt: values.message,
      theradId: conversation.threadId,
    });
  }
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
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent className="group-[.is-user]:bg-blue-600">
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    seed="assistant"
                    size={32}
                    badgeImageUrl="/logo.svg"
                  />
                )}
                {message.role === "user" && (
                  <DicebearAvatar imageUrl="/logo.svg" seed="user" size={32} />
                )}
              </AIMessage>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      {/* todo: sugession */}
      <Form {...form}>
        <AIInput
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-none border-b-0 border-x-0 px-6"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation is resolved"
                    : "Type your message..."
                }
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" || !form.formState.isValid
              }
              status="ready"
              type="submit"
              className="bg-blue-600"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};
