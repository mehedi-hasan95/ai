"use client";

import { useOrganization } from "@clerk/nextjs";
import { OrganizationListView } from "./organization-list";
import { AuthLayout } from "./auth-layout";

export const OgranizatinGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization } = useOrganization();
  if (!organization) {
    return (
      <AuthLayout>
        <OrganizationListView />;
      </AuthLayout>
    );
  }
  return <div>{children}</div>;
};
