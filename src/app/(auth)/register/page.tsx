"use client";

import { AuthView } from "@/components/views/AuthView";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function RegisterPage() {
  const form = useAuthForm("register");
  return <AuthView form={form} />;
}
