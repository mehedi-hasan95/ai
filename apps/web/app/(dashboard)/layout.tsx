import { AuthGuard } from "@/components/auth/auth-guard";
import { OgranizatinGuard } from "@/components/auth/organization-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "./_componets/dashboard-sidebar";

const DashboarLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthGuard>
      <OgranizatinGuard>
        <SidebarProvider defaultOpen={sidebarOpen}>
          <DashboardSidebar />
          <main className="flex flex-col lg:flex-1">{children}</main>
        </SidebarProvider>
      </OgranizatinGuard>
    </AuthGuard>
  );
};

export default DashboarLayout;
