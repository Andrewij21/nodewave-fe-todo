"use client";
import { Button } from "../ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { useLogout } from "@/queries/auth";
import { Fragment } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { AppHeaderProps } from "@/types";

export default function AppHeader({
  breadcrumbs,
  role,
  onSearchChange,
  searchPlaceholder = "Search...",
}: AppHeaderProps) {
  const { user } = useAuthStore();
  const { mutate } = useLogout();
  const router = useRouter();
  const logoutHandler = () => {
    const toastId = toast.loading("Logging out...");
    mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
        toast.success("Logged out successfully", { id: toastId });
      },
      onError: (error) => {
        // Opsional: Tangani jika logout gagal
        console.error("Logout failed:", error);
      },
    });
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between px-3">
      <div className="flex flex-1 items-center gap-2">
        {role === "USER" ? (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-8"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        ) : (
          <>
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs?.map((item, index) => {
                  const isLastItem = index === breadcrumbs.length - 1;
                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem>
                        {isLastItem ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.href}>
                            {item.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLastItem && <BreadcrumbSeparator />}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground hidden sm:block">
            {user?.fullName}
          </p>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
          </Avatar>
        </div>

        <Button className="w-fit" onClick={logoutHandler}>
          SIGNOUT
        </Button>
      </div>
    </header>
  );
}
