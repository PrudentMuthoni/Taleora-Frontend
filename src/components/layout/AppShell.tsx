"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UsageMeter } from "@/components/ui/UsageMeter";
import { NAV_ITEMS, SOON_ITEMS } from "./nav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { usage } = useUsage();
  const initial = (user?.full_name || user?.email || "T").slice(0, 1).toUpperCase();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-1 border-r border-line bg-surface p-4 lg:flex">
        <Link href="/home" className="mb-5 px-2 py-1">
          <Logo />
        </Link>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition",
              isActive(href) ? "bg-chip text-accent" : "text-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <div className="mt-4 space-y-1 border-t border-line pt-4">
          {SOON_ITEMS.map((label) => (
            <div key={label} aria-disabled="true" className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-bold text-muted">
              {label}
              <Badge>Soon</Badge>
            </div>
          ))}
        </div>
        <div className="mt-auto rounded-2xl border border-line bg-surface-2 p-4">
          <UsageMeter usage={usage} />
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col pb-24 lg:pb-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur sm:px-6">
          <Link href="/home" className="lg:hidden">
            <Logo />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-chip px-3 py-1.5 text-xs font-bold text-accent">
              {usage ? `${usage.used_today} of ${usage.daily_limit} today` : "…"}
            </span>
            <ThemeToggle />
            <Link href="/account" aria-label="Account" className="grid size-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
              {initial}
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-bold",
              isActive(href) ? "text-accent" : "text-muted",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
