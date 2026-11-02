"use client";

import { useParams } from "next/navigation";
import { ProjectDetailView } from "@/components/views/ProjectDetailView";
import { useProjectDetail } from "@/hooks/useProjectDetail";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const model = useProjectDetail(params.id);
  return <ProjectDetailView model={model} />;
}
