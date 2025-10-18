"use client";
import { AppSidebar } from "@/components/layouts/AppSidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./AppHeader";
import { getBreadcrumbs } from "@/lib/breadcrumb";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAuthStore } from "@/store/authStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const { user } = useAuthStore();

  const isUserRole = user?.role === "USER";

  if (isUserRole) {
    return (
      <div>
        {/* <AppHeader breadcrumbs={breadcrumbs} role={user.role} /> */}
        <main className="">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader breadcrumbs={breadcrumbs} />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
