"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "./TopNav";
import { useAuth } from "@/context/AuthContext";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FBF9F1] dark:bg-[#0A0A0A] text-slate-900 dark:text-white flex-col gap-4 transition-colors duration-300">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary border-r-2 animate-spin shadow-sm" />
      </div>
    );
  }

  if (!isAuthenticated && isLoading !== undefined) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#FBF9F1] dark:bg-[#0A0A0A] text-slate-900 dark:text-white flex flex-col font-display transition-colors duration-300">
      <TopNav />
      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}
