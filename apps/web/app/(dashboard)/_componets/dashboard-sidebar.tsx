"use client";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  CreditCard,
  Inbox,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardSidebarTrigger } from "./dashboard-sidebar-trigger";
import { cn } from "@workspace/ui/lib/utils";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: Inbox,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];
const configruationItems = [
  {
    title: "Widget Customization",
    url: "/customization",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: Mic,
  },
];
const accountItems = [
  { title: "Plans & Billing", url: "/billing", icon: CreditCard },
];
export const DashboardSidebar = () => {
  const pathName = usePathname();
  const isActive = (url: string) => {
    if (url === "/") {
      return pathName === "/";
    }
    return pathName.startsWith(url);
  };
  return (
    <DashboardSidebarTrigger>
      <Sidebar className="group" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <OrganizationSwitcher
                  hidePersonal
                  skipInvitationScreen
                  appearance={{
                    elements: {
                      rootBox: "!w-full !h-8",
                      avatarBox: "!size-4 !rounded-sm",
                      organizationSwitcherTrigger:
                        "!w-full justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                      organizationPreview:
                        "group-data-[collapsible=icon]:justify-center! gap-2!",
                      organizationPreviewTextContainer:
                        "group-data-[collapsible=icon]:hidden! text-xs! font-medium!",
                      organizationSwitcherTriggerIcon:
                        "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!",
                    },
                  }}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="">
          {/* Customar Support  */}
          <SidebarGroup>
            <SidebarGroupLabel>Curstomar Support</SidebarGroupLabel>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "hover:bg-blue-600/90! hover:text-white",
                      isActive(item.url) &&
                        "bg-blue-600! text-white! hover:bg-blue-600/90!"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* Configuration  */}
          <SidebarGroup>
            <SidebarGroupLabel>Configuration</SidebarGroupLabel>
            <SidebarMenu>
              {configruationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "hover:bg-blue-600/90! hover:text-white",
                      isActive(item.url) &&
                        "bg-blue-600! text-white! hover:bg-blue-600/90!"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* Accounts  */}
          <SidebarGroup>
            <SidebarGroupLabel>Accounts</SidebarGroupLabel>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "hover:bg-blue-600/90! hover:text-white",
                      isActive(item.url) &&
                        "bg-blue-600! text-white! hover:bg-blue-600/90!"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </DashboardSidebarTrigger>
  );
};
