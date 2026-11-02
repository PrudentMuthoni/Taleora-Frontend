"use client";

import { AuthView } from "@/components/views/AuthView";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function LoginPage() {
  const form = useAuthForm("login");
  return <AuthView form={form} />;
}
