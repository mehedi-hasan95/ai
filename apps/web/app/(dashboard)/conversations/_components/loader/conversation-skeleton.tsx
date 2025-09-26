import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

interface Props {
  size?: number;
  className?: string;
}
export const ConversationSkeleton = ({ size = 10, className }: Props) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: size }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton
                className={cn("size-10 shrink-0 rounded-full", className)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className={cn("h-4 w-24", className)} />
                  <Skeleton
                    className={cn("ml-auto h-3 w-12 shrink-0", className)}
                  />
                </div>
                <div className="mt-2">
                  <Skeleton className={cn("h-3 w-full", className)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
