"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const filteredLinks = NAV_LINKS.navMain
    .filter((section) => {
      const hasParentAccess =
        !section.roles || (userRole && section.roles.includes(userRole));
      if (!hasParentAccess) {
        return false;
      }
      if (section.items?.length) {
        const hasAccessibleItems = section.items.some(
          (item) => !item.roles || (userRole && item.roles.includes(userRole))
        );
        return hasAccessibleItems;
      }
      return true;
    })
    .map((section) => {
      return {
        ...section,
        items: section.items?.filter(
          (item) => !item.roles || (userRole && item.roles.includes(userRole))
        ),
      };
    });
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          {/* <SidebarMenuItem>NodeWave</SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
