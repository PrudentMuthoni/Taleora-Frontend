"use client";

import { useState, type FormEvent } from "react";
import { errorMessage } from "@/lib/errors";
import type { Project } from "@/types/api";

export function useNewProjectForm(create: (name: string, description: string | null) => Promise<Project>) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await create(name, null);
      setName("");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return { name, setName, busy, error, submit };
}
