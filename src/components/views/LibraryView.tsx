import { Film } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button, buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { GenerationGrid } from "@/components/library/GenerationGrid";
import type { GenerationsModel, LibraryTab } from "@/hooks/useGenerations";
import type { Project } from "@/types/api";

export function LibraryView({ model, projects }: { model: GenerationsModel; projects: Project[] }) {
  return (
    <div className="space-y-6">
      <PageHeading title="Library" subtitle={`${model.total} ${model.total === 1 ? "video" : "videos"} in total`} />
      <SegmentedControl<LibraryTab>
        label="Filter by status"
        value={model.tab}
        onChange={model.setTab}
        className="max-w-lg"
        options={[
          { value: "all", label: "All" },
          { value: "completed", label: "Ready" },
          { value: "active", label: "Active" },
          { value: "failed", label: "Failed" },
        ]}
      />
      {model.error && <Alert tone="error">{model.error}</Alert>}
      {model.loading ? (
        <p className="text-sm text-muted">Loading your videos…</p>
      ) : model.items.length ? (
        <GenerationGrid items={model.items} projects={projects} actions={model} />
      ) : (
        <EmptyState
          icon={<Film className="size-6" />}
          title="Nothing here yet"
          text="Videos you create will appear in this view."
          action={
            <Link href="/create" className={buttonClass("primary", "sm")}>
              Create a video
            </Link>
          }
        />
      )}
      {model.hasMore && (
        <div className="flex justify-center">
          <Button variant="secondary" loading={model.loadingMore} onClick={model.loadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
