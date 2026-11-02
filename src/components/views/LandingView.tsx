import { ArrowRight, Layers, MessageSquare, Sparkles, ImagePlus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const FEATURES = [
  { icon: Sparkles, title: "Text to Video", text: "Describe it. See it happen.", soon: false },
  { icon: ImagePlus, title: "Image to Video", text: "Bring your photos to life.", soon: false },
  { icon: MessageSquare, title: "Talking Characters", text: "Add voice. Create conversations.", soon: true },
  { icon: Layers, title: "Multi-Scene Stories", text: "Build complete visual stories.", soon: true },
];

export function LandingView({ signedIn }: { signedIn: boolean }) {
  const startHref = signedIn ? "/create" : "/register";

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {signedIn ? (
            <Link href="/home" className={buttonClass("primary", "sm")}>
              Open studio
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonClass("ghost", "sm")}>
                Sign in
              </Link>
              <Link href="/register" className={buttonClass("primary", "sm")}>
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 pb-16 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] bg-hero-gradient text-white">
          {/* Put your hero image at public/hero.jpg. Without it you see the gradient. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.jpg" alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent" />
          <div className="relative flex min-h-[26rem] max-w-xl flex-col justify-center gap-5 p-6 sm:min-h-[32rem] sm:p-12">
            <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">AI VIDEO STUDIO</span>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Turn your ideas into <span className="text-violet-300">stunning videos</span>
            </h1>
            <p className="text-lg text-white/85">Describe a scene or bring a photo to life. Taleora does the rest.</p>
            <Link
              href={startHref}
              className="inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-violet-900 shadow-glow transition hover:bg-white/90"
            >
              Start creating <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section aria-label="What you can make" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text, soon }) => (
            <div key={title} className="rounded-3xl border border-line bg-surface p-5 shadow-card">
              <span className="mb-3 grid size-11 place-items-center rounded-xl bg-chip text-accent">
                <Icon className="size-5" />
              </span>
              <p className="flex items-center gap-2 font-bold">
                {title}
                {soon && <Badge>Soon</Badge>}
              </p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
