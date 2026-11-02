"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Spinner } from "@/components/ui/Spinner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { UsageProvider } from "@/hooks/useUsage";

export default function AppLayout({ children }: { children: ReactNode }) {
  const signedIn = useRequireAuth();

  if (!signedIn) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner className="size-8 text-brand" />
      </div>
    );
  }

  return (
    <UsageProvider>
      <AppShell>{children}</AppShell>
    </UsageProvider>
  );
}
