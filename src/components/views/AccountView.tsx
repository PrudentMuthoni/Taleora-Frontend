import { Download, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeading } from "@/components/ui/PageHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { UsageMeter } from "@/components/ui/UsageMeter";
import type { AccountModel } from "@/hooks/useAccount";
import type { ThemePreference } from "@/hooks/useTheme";
import { MODE_LABEL } from "@/lib/format";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="truncate font-semibold">{value}</span>
    </div>
  );
}

export function AccountView({ model }: { model: AccountModel }) {
  const { user, usage, providers, install } = model;

  return (
    <div className="space-y-6">
      <PageHeading title="Account" subtitle="Your profile, usage and preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-bold">Profile</h2>
          <Row label="Name" value={user?.full_name || "Not set"} />
          <Row label="Email" value={user?.email ?? "…"} />
        </Card>

        <Card className="space-y-3">
          <h2 className="font-bold">Usage</h2>
          <UsageMeter usage={usage} />
          {usage && <Row label="Videos at once" value={`${usage.active_jobs} of ${usage.max_concurrent_jobs}`} />}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-bold">Appearance</h2>
          <SegmentedControl<ThemePreference>
            label="Theme"
            value={model.themePreference}
            onChange={model.setThemePreference}
            options={[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </Card>

        <Card className="space-y-3">
          <h2 className="font-bold">Install Taleora</h2>
          {install.installed ? (
            <p className="text-sm text-muted">Taleora is installed on this device.</p>
          ) : install.canInstall ? (
            <Button onClick={install.install}>
              <Download className="size-4" /> Install app
            </Button>
          ) : (
            <p className="text-sm text-muted">
              On iPhone, tap Share, then &quot;Add to Home Screen&quot;. On other browsers, look for Install in the address bar or menu.
            </p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-2 font-bold">Video engines</h2>
          {providers.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
              <div>
                <p className="font-semibold">{provider.name}</p>
                <p className="text-xs text-muted">{provider.modes.map((mode) => MODE_LABEL[mode]).join(" · ")}</p>
              </div>
              <Badge className={provider.configured ? "bg-ok-bg text-ok-fg" : undefined}>{provider.configured ? "Ready" : "Not set up"}</Badge>
            </div>
          ))}
        </Card>
      </div>

      <Button variant="danger" onClick={model.signOut}>
        <LogOut className="size-4" /> Sign out
      </Button>
    </div>
  );
}
