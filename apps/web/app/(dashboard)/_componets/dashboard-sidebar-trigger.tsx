import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function DashboardSidebarTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <SidebarTrigger />
        {children}
      </div>
    );
  }

  return children;
}
