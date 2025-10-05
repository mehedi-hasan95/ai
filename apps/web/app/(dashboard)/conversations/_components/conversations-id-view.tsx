"use client";
import { api } from "@workspace/backend/_generated/api";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontal, Wand2 } from "lucide-react";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { AIResponse } from "@workspace/ui/components/ai/response";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@workspace/ui/components/form";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avater";
import { ConversatinStatusButton } from "./conversation-status-button";
import { useState } from "react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { ConversationIdSkeleton } from "./loader/conversation-id-skeleton";
import { toast } from "sonner";
const formSchema = z.object({
  message: z.string().min(2, {
    message: "message must be at least 2 characters.",
  }),
});

export const ConversationsIdViews = ({
  conversationsId,
}: {
  conversationsId: Id<"conversation">;
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const conversation = useQuery(api.private.conversation.getOne, {
    conversationsId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );
  const createMessage = useMutation(api.private.messages.create);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // 2. Define a submit handler.
  const [isSubmiting, setIsSubmiting] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmiting(true);
    try {
      await createMessage({
        conversationsId,
        prompt: values.message,
      });
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmiting(false);
    }
  }

  // Enhance message
  const [isEnhancing, setIsEnhancing] = useState(false);
  const enhanceMessage = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceMessage = async () => {
    setIsEnhancing(true);
    const enhanceValue = form.getValues("message");
    try {
      const response = await enhanceMessage({ prompt: enhanceValue });
      form.setValue("message", response);
    } catch (error: any) {
      if (error?.data?.code === "UNAUTHORIZE") {
        toast.error(error?.data?.message);
      } else if (error?.data?.code === "BAD_REQUEST") {
        toast.error(error?.data?.message);
      } else {
        toast.error("Failed to enhance message. Please try again.");
      }
      console.error("Enhance message error:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // update conversation status
  const updateConversationStatus = useMutation(
    api.private.conversation.updateStatus
  );
  const handleToggleStatus = async () => {
    if (!conversation) {
      return;
    }
    setIsUpdating(true);
    let newStatus: Doc<"conversation">["status"];
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({ conversationsId, status: newStatus });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const {
    canLoadMore,
    handleLoadMore,
    isLoadingMore,
    topElementRef,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    loadMore: messages.loadMore,
    loadSize: 10,
    status: messages.status,
  });

  // conversation loading
  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdSkeleton size={12} className="bg-neutral-600" />;
  }
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontal />
        </Button>
        {!!conversation && (
          <ConversatinStatusButton
            onClick={handleToggleStatus}
            status={conversation.status}
            disabled={isUpdating}
          />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <AIMessage
              from={message.role === "user" ? "assistant" : "user"}
              key={message.id}
            >
              <AIMessageContent className="group-[.is-user]:bg-blue-600 dark:text-white">
                <AIResponse>{message.text}</AIResponse>
              </AIMessageContent>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId || "user"}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancing ||
                    isSubmiting
                  }
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
                      : "Type your response as an operator..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  onClick={handleEnhanceMessage}
                  disabled={
                    conversation?.status === "resolved" ||
                    !form.formState.isValid ||
                    isEnhancing ||
                    isSubmiting
                  }
                >
                  <Wand2 />
                  {isEnhancing ? "Enhanceing" : "Enhance"}
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  isEnhancing ||
                  isSubmiting
                }
                status="ready"
                type="submit"
                className="bg-blue-600 dark:text-white"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
