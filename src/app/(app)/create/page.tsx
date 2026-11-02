"use client";

import { CreateView } from "@/components/views/CreateView";
import { useCreateVideo } from "@/hooks/useCreateVideo";

export default function CreatePage() {
  const model = useCreateVideo();
  return <CreateView model={model} />;
}
