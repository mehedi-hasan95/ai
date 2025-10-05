"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}
export const IntegrationsDialog = ({ onOpenChange, open, snippet }: Props) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Snipped copied to clipboard");
    } catch (error) {
      toast.error("Didn't copy the snippet");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add the chatbox to your website
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              1. Copy the following code
            </div>
            <div className="relative group">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                {snippet}
              </pre>
              <Button
                className="absolute top-4 right-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleCopy}
                size="icon"
                variant="secondary"
              >
                <Copy size="3" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-accent p-2 text-sm">
                2. Add the code in your page
              </div>
              <p className="text-muted-foreground text-sm">
                Paste the chatbox code above in your page. You can add it in the
                HTML head section.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
