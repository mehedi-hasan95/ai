import { OrganizationList } from "@clerk/nextjs";

export const OrganizationListView = () => {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
};
