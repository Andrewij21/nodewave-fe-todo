"use client";
import { AdminTodoView } from "@/components/todo/AdminTodoView";
import { UserTodoView } from "@/components/todo/UserTodoView";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

export default function Page() {
  const { user, loading } = useAuthStore();
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
    );
  }
  return <>{user?.role === "USER" ? <UserTodoView /> : <AdminTodoView />}</>;
}
