import { AuthGuard } from "@/components/auth/auth-guard";
import { OgranizatinGuard } from "@/components/auth/organization-guard";

const DashboarLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <OgranizatinGuard>{children}</OgranizatinGuard>
    </AuthGuard>
  );
};

export default DashboarLayout;
