"use client";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { IntegrationId, INTEGRATIONS_OPTION } from "./_components/constants";
import { IntegrationsDialog } from "./_components/integrations-dialog";
import { useState } from "react";
import { createScript } from "./_components/utils";

const Page = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const { organization } = useOrganization();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id || "");
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // intregration snippet

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error("Organization ID not found");
      return;
    }

    const snippet = createScript(integrationId, organization.id);
    setSelectedSnippet(snippet as string);
    setDialogOpen(true);
  };
  return (
    <>
      <IntegrationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={selectedSnippet}
      />
      <div className="flex flex-col bg-muted p-8 min-h-screen">
        <div className="mx-auto max-w-screen-md w-full">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Setup and integration</h1>
            <p className="text-muted-foreground">
              Set up the integration that's sweet for you
            </p>
          </div>
          <div className="space-y-8 mt-8">
            <div className="flex items-center gap-4">
              <Label htmlFor="orgId" className="">
                Organization ID:{" "}
              </Label>
              <Input
                id="orgId"
                className="flex-1 bg-background border-primary/50 font-mono text-sm"
                disabled
                readOnly
                value={organization?.id}
              />
              <Button
                className="gap-2 bg-blue-600 text-white hover:bg-blue-600/80"
                onClick={handleCopy}
                size="sm"
              >
                <Copy size={4} />
                Copy
              </Button>
            </div>
          </div>

          <Separator className="my-8" />
          <div className="space-y-8">
            <div className="space-y-1">
              <Label className="text-lg">Integrations</Label>
              <p className="text-muted-foreground text-sm">
                Add the following code to your website to enhance the chatbot
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {INTEGRATIONS_OPTION.map((integration) => (
                <button
                  key={integration.id}
                  type="button"
                  onClick={() => handleIntegrationClick(integration.id)}
                  className="flex items-center gap-4 rounded-lg border bg-background/40 p-4 hover:bg-background/80 cursor-pointer"
                >
                  <integration.icon
                    size={32}
                    className={integration.className}
                  />
                  <p>{integration.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
