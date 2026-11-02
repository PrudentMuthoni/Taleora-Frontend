import { ArrowRight, ImagePlus, Layers, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { UsageMeter } from "@/components/ui/UsageMeter";
import { GenerationGrid } from "@/components/library/GenerationGrid";
import type { HomeModel } from "@/hooks/useHome";

const ACTIONS = [
  { href: "/create", icon: Sparkles, title: "Text to video", text: "Describe it. See it happen." },
  { href: "/create?mode=image", icon: ImagePlus, title: "Image to video", text: "Bring your photos to life." },
];
const SOON = [
  { icon: MessageSquare, title: "Talking characters" },
  { icon: Layers, title: "Multi-scene stories" },
];

export function HomeView({ model }: { model: HomeModel }) {
  const { generations, projects, usage } = model;
  const recent = generations.items.slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-hero-gradient p-6 text-white sm:p-10">
        <p className="text-sm font-semibold text-white/80">
          {model.greeting}, {model.firstName}
        </p>
        <h1 className="mt-1 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">What will you create today?</h1>
        <Link
          href="/create"
          className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-violet-900 shadow-glow transition hover:bg-white/90"
        >
          Start creating <ArrowRight className="size-4" />
        </Link>
      </section>

      <section aria-label="Quick actions" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map(({ href, icon: Icon, title, text }) => (
          <Link key={title} href={href} className="rounded-3xl border border-line bg-surface p-5 shadow-card transition hover:border-brand">
            <span className="mb-3 grid size-11 place-items-center rounded-xl bg-chip text-accent">
              <Icon className="size-5" />
            </span>
            <p className="font-bold">{title}</p>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </Link>
        ))}
        {SOON.map(({ icon: Icon, title }) => (
          <div key={title} aria-disabled="true" className="rounded-3xl border border-dashed border-line p-5 text-muted">
            <span className="mb-3 grid size-11 place-items-center rounded-xl bg-surface-2">
              <Icon className="size-5" />
            </span>
            <p className="flex items-center gap-2 font-bold">
              {title} <Badge>Soon</Badge>
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent videos</h2>
            <Link href="/library" className="text-sm font-bold text-accent hover:underline">
              View all
            </Link>
          </div>
          {generations.loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : recent.length ? (
            <GenerationGrid items={recent} projects={projects} actions={generations} />
          ) : (
            <EmptyState
              icon={<Sparkles className="size-6" />}
              title="No videos yet"
              text="Write your first prompt and it will show up here."
              action={
                <Link href="/create" className="text-sm font-bold text-accent hover:underline">
                  Create a video
                </Link>
              }
            />
          )}
        </section>
        <aside>
          <Card>
            <UsageMeter usage={usage} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
