import { AuthGuard } from "@/components/auth/auth-guard";
import { OgranizatinGuard } from "@/components/auth/organization-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "./_componets/dashboard-sidebar";
import { Provider } from "jotai";
import { Toaster } from "@workspace/ui/components/sonner";
const DashboarLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthGuard>
      <OgranizatinGuard>
        <Provider>
          <SidebarProvider defaultOpen={sidebarOpen}>
            <DashboardSidebar />
            <main className="flex flex-col lg:flex-1">{children}</main>
            <Toaster />
          </SidebarProvider>
        </Provider>
      </OgranizatinGuard>
    </AuthGuard>
  );
};

export default DashboarLayout;
