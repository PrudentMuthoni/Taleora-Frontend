"use client";

import { HomeView } from "@/components/views/HomeView";
import { useHome } from "@/hooks/useHome";

export default function HomePage() {
  const model = useHome();
  return <HomeView model={model} />;
}
