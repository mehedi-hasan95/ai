import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { MoreHorizontal, Wand2 } from "lucide-react";

interface Props {
  size?: number;
  className?: string;
}
export const ConversationIdSkeleton = ({ size = 8, className }: Props) => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontal />
        </Button>
        <Skeleton className="h-8 w-28" />
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: size }, (_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-72"];
            const width = widths[index % widths.length];

            return (
              <div
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
                key={index}
              >
                <Skeleton
                  className={cn(
                    `h-9 ${width} rounded-lg bg-neutral-200`,
                    className
                  )}
                />
                <Skeleton
                  className={cn(
                    "size-8 rounded-full bg-neutral-200",
                    className
                  )}
                />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as assistant"
          />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputButton disabled>
                <Wand2 />
                Enhance
              </AIInputButton>
            </AIInputTools>
            <AIInputSubmit
              disabled
              status="ready"
              type="submit"
              className="bg-blue-600 dark:text-white"
            />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
