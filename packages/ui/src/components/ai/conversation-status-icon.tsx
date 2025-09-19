import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, ArrowUp, CheckIcon } from "lucide-react";

interface Props {
  status: "unresolved" | "escalated" | "resolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-[#3fb62f]",
  },
  unresolved: {
    icon: ArrowRight,
    bgColor: "bg-destructive",
  },
  escalated: {
    icon: ArrowUp,
    bgColor: "bg-yellow-500",
  },
} as const;

export const ConversationStatusIcon = ({ status, className }: Props) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full size-5",
        config.bgColor,
        className
      )}
    >
      <Icon className="size-3 stroke-3 text-white" />
    </div>
  );
};
