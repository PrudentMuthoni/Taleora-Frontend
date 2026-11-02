"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { useInstallPrompt } from "./useInstallPrompt";
import { useProviders } from "./useProviders";
import { useTheme } from "./useTheme";
import { useUsage } from "./useUsage";

export function useAccount() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { usage } = useUsage();
  const { providers } = useProviders();
  const { preference, setPreference } = useTheme();
  const install = useInstallPrompt();

  function signOut() {
    logout();
    router.replace("/login");
  }

  return { user, usage, providers, themePreference: preference, setThemePreference: setPreference, install, signOut };
}

export type AccountModel = ReturnType<typeof useAccount>;
