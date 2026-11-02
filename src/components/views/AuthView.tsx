import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { inputClass } from "@/components/ui/styles";
import type { AuthFormModel } from "@/hooks/useAuthForm";

export function AuthView({ form }: { form: AuthFormModel }) {
  const isLogin = form.kind === "login";

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-hero-gradient p-12 text-white lg:flex">
        <Link href="/">
          <Logo className="text-white" />
        </Link>
        <div className="space-y-3">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
            Every great story
            <br />
            starts with an idea.
          </h2>
          <p className="text-lg text-white/85">Ideas. Into. Motion.</p>
        </div>
        <p className="text-sm text-white/70">Taleora Studio</p>
      </section>

      <section className="flex flex-col justify-center px-4 py-10 pt-[max(2.5rem,env(safe-area-inset-top))] sm:px-10">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex items-center justify-between lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
            <ThemeToggle />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{isLogin ? "Welcome back" : "Create your account"}</h1>
            <p className="text-muted">{isLogin ? "Sign in to pick up where you left off." : "It only takes a moment."}</p>
          </div>

          <form onSubmit={form.submit} className="space-y-4">
            {!isLogin && (
              <Field label="Name (optional)" htmlFor="name">
                <input id="name" autoComplete="name" value={form.fullName} onChange={(event) => form.setFullName(event.target.value)} className={inputClass} />
              </Field>
            )}
            <Field label="Email" htmlFor="email">
              <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(event) => form.setEmail(event.target.value)} placeholder="you@example.com" className={inputClass} />
            </Field>
            <Field label="Password" htmlFor="password" hint={isLogin ? undefined : "At least 8 characters."}>
              <input
                id="password"
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={form.password}
                onChange={(event) => form.setPassword(event.target.value)}
                className={inputClass}
              />
            </Field>
            {form.error && <Alert tone="error">{form.error}</Alert>}
            <Button type="submit" className="w-full" loading={form.busy}>
              {isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted">
            {isLogin ? "New to Taleora? " : "Already have an account? "}
            <Link href={isLogin ? "/register" : "/login"} className="font-bold text-accent hover:underline">
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
