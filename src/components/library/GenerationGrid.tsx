import type { Generation, Project } from "@/types/api";
import { GenerationCard, type GenerationActions } from "./GenerationCard";

interface Props {
  items: Generation[];
  projects: Project[];
  actions: GenerationActions;
}

export function GenerationGrid({ items, projects, actions }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((generation) => (
        <GenerationCard key={generation.id} generation={generation} projects={projects} actions={actions} />
      ))}
    </div>
  );
}
