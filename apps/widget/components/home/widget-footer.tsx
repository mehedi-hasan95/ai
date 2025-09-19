"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom } from "../attom/widget-attom";
import { Button } from "@workspace/ui/components/button";
import { HomeIcon, InboxIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);
  const setScreen = useSetAtom(screenAtom);
  return (
    <footer className="p-4 border-t flex justify-between items-center">
      <Button
        className="h-14 flex-1 rounded-none"
        size={"icon"}
        variant={"ghost"}
        onClick={() => setScreen("selection")}
      >
        <HomeIcon
          className={cn("size-5", screen === "selection" && "text-blue-400")}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        size={"icon"}
        variant={"ghost"}
        onClick={() => setScreen("inbox")}
      >
        <InboxIcon
          className={cn("size-5", screen === "inbox" && "text-blue-400")}
        />
      </Button>
    </footer>
  );
};
