"use client";

import { AccountView } from "@/components/views/AccountView";
import { useAccount } from "@/hooks/useAccount";

export default function AccountPage() {
  const model = useAccount();
  return <AccountView model={model} />;
}
