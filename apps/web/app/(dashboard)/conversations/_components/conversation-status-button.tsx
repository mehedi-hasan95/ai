"use client";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { TooltipModify } from "@workspace/ui/components/tooltip-modify";
import { ArrowUp, CheckCheck } from "lucide-react";
export const ConversatinStatusButton = ({
  onClick,
  status,
  disabled,
}: {
  onClick: () => void;
  status: Doc<"conversation">["status"];
  disabled?: boolean;
}) => {
  if (status === "escalated") {
    return (
      <TooltipModify text="Mark as resolved">
        <Button
          onClick={onClick}
          size="sm"
          className="bg-orange-500 text-white hover:bg-blue-500"
          disabled={disabled}
        >
          <ArrowUp />
          Escalated
        </Button>
      </TooltipModify>
    );
  }
  if (status === "resolved") {
    return (
      <TooltipModify text="Mark as unresolved">
        <Button
          onClick={onClick}
          size="sm"
          className="bg-blue-500 text-white hover:bg-red-500"
          disabled={disabled}
        >
          <CheckCheck />
          Resolved
        </Button>
      </TooltipModify>
    );
  }
  if (status === "unresolved") {
    return (
      <TooltipModify text="Mark as escalated">
        <Button
          onClick={onClick}
          size="sm"
          className="bg-red-500 text-white hover:bg-orange-500"
          disabled={disabled}
        >
          <ArrowUp />
          Unresolved
        </Button>
      </TooltipModify>
    );
  }
};
