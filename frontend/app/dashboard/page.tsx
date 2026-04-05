"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TaskDashboard } from "@/components/dashboard/task-dashboard";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--tm-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    );
  }

  return <TaskDashboard />;
}
