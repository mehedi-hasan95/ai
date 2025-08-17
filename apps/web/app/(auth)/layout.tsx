import { AuthLayout } from "@/components/auth/auth-layout";

const Page = async ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Page;
