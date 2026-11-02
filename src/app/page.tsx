"use client";

import { LandingView } from "@/components/views/LandingView";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { status } = useAuth();
  return <LandingView signedIn={status === "authenticated"} />;
}
