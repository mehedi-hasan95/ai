import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface Props {
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: "center" | "start" | "end" | undefined;
  text: string;
  children: React.ReactNode;
}
export const TooltipModify = ({
  side = "top",
  align = "center",
  text,
  children,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};
