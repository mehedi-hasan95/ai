"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  BotIcon,
  GemIcon,
  BookOpen,
  type LucideIcon,
  Users,
  Cookie,
} from "lucide-react";
import { useRouter } from "next/navigation";
interface Props {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface PremiumFeaturesOverlayProps {
  children: React.ReactNode;
}

const features: Props[] = [
  {
    icon: BotIcon,
    label: "AI Customer Support",
    description: "Intelligent automated response",
  },
  {
    icon: BookOpen,
    label: "Knowledge Base",
    description: "Train AI with your documents",
  },
  {
    icon: Users,
    label: "Team Access",
    description: "Up to 5 operators per organization",
  },
  {
    icon: Cookie,
    label: "Widget Customization",
    description: "Customize your chat apparence",
  },
];

export const PremiumFeaturesOverlay = ({
  children,
}: PremiumFeaturesOverlayProps) => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none select-none blur-2xl">{children}</div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-40 flex justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center">
              <div className="mb-2 inline-flex size-12 items-center justify-center rounded-full">
                <GemIcon className="size-6 text-muted-foreground" />
              </div>
            </div>
            <CardTitle>Premium features</CardTitle>
            <CardDescription>
              This features required a <strong>PRO</strong> subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border-muted-foreground">
                    <feature.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-600/95 text-white hover:text-white/95"
              size="lg"
              onClick={() => router.push("/billing")}
            >
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
