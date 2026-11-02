"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { errorMessage } from "@/lib/errors";
import { useAuth } from "./useAuth";

export type AuthFormKind = "login" | "register";

export function useAuthForm(kind: AuthFormKind) {
  const { login, register, status } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/home");
  }, [status, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (kind === "register" && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    setBusy(true);
    try {
      if (kind === "login") {
        await login(email.trim(), password);
      } else {
        await register({ email: email.trim(), password, full_name: fullName.trim() || null });
      }
      router.replace("/home");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return { kind, email, setEmail, password, setPassword, fullName, setFullName, error, busy, submit };
}

export type AuthFormModel = ReturnType<typeof useAuthForm>;
