"use client";

import { Wand2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { PageHeading } from "@/components/ui/PageHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { inputClass, labelClass, selectClass } from "@/components/ui/styles";
import { PreviewPanel } from "@/components/create/PreviewPanel";
import { ReferenceImage } from "@/components/create/ReferenceImage";
import type { CreateVideoModel } from "@/hooks/useCreateVideo";
import { cn } from "@/lib/cn";
import { MAX_DURATION, MAX_PROMPT_LENGTH, MIN_DURATION } from "@/lib/constants";
import { STYLE_PRESETS } from "@/lib/stylePresets";
import type { AspectRatio, GenerationMode, Resolution } from "@/types/api";

export function CreateView({ model }: { model: CreateVideoModel }) {
  const m = model;

  return (
    <div className="space-y-6">
      <PageHeading title="Create video" subtitle="Describe a scene, or bring a photo to life." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void m.submit();
          }}
        >
          <SegmentedControl<GenerationMode>
            label="Mode"
            value={m.mode}
            onChange={m.setMode}
            options={[
              { value: "text_to_video", label: "Text to video" },
              { value: "image_to_video", label: "Image to video" },
            ]}
          />
          <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
            More modes on the way: Talking characters <Badge>Soon</Badge> Multi-scene <Badge>Soon</Badge>
          </p>

          <Card className="space-y-4">
            <Field label="Your prompt" htmlFor="prompt" hint="Include the subject, setting, camera movement and mood.">
              <textarea
                id="prompt"
                value={m.prompt}
                onChange={(event) => m.setPrompt(event.target.value)}
                maxLength={MAX_PROMPT_LENGTH}
                rows={5}
                placeholder="A lighthouse at dusk, waves crashing, slow cinematic push-in"
                className={cn(inputClass, "resize-y py-3")}
              />
              <p className="text-right text-xs text-muted tabular-nums">
                {m.prompt.length} / {MAX_PROMPT_LENGTH}
              </p>
            </Field>
            <div className="space-y-1.5">
              <span className={labelClass}>Style</span>
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={m.styleId === preset.id}
                    onClick={() => m.setStyleId(preset.id)}
                    className={cn(
                      "min-h-10 rounded-full border px-4 text-sm font-semibold transition",
                      m.styleId === preset.id ? "border-brand bg-chip text-accent" : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {m.mode === "image_to_video" && (
            <ReferenceImage image={m.image} preview={m.imagePreview} onSelect={m.selectImage} />
          )}

          <Card className="space-y-5">
            <h2 className="font-bold">Video settings</h2>
            <Field label="Aspect ratio">
              <SegmentedControl<AspectRatio>
                label="Aspect ratio"
                value={m.aspectRatio}
                onChange={m.setAspectRatio}
                options={[
                  { value: "16:9", label: "16:9" },
                  { value: "9:16", label: "9:16" },
                  { value: "1:1", label: "1:1" },
                ]}
              />
            </Field>
            <Field label={`Duration: ${m.duration} seconds`} htmlFor="duration">
              <input
                id="duration"
                type="range"
                min={MIN_DURATION}
                max={MAX_DURATION}
                step={1}
                value={m.duration}
                onChange={(event) => m.setDuration(Number(event.target.value))}
                className="h-10 w-full accent-brand"
              />
            </Field>
            <Field label="Resolution">
              <SegmentedControl<Resolution>
                label="Resolution"
                value={m.resolution}
                onChange={m.setResolution}
                options={[
                  { value: "480p", label: "480p" },
                  { value: "720p", label: "720p" },
                ]}
              />
            </Field>

            <details className="group rounded-2xl border border-line bg-surface-2 p-4">
              <summary className="cursor-pointer text-sm font-bold">Advanced options</summary>
              <div className="mt-4 space-y-4">
                <Field label="Negative prompt" htmlFor="negative" hint="What the video should avoid.">
                  <textarea
                    id="negative"
                    value={m.negativePrompt}
                    onChange={(event) => m.setNegativePrompt(event.target.value)}
                    maxLength={1000}
                    rows={2}
                    placeholder="blurry, distorted, text, watermark"
                    className={cn(inputClass, "py-3")}
                  />
                </Field>
                <Field label="Seed" htmlFor="seed" hint="Use the same seed to repeat a result. Leave empty for random.">
                  <input id="seed" inputMode="numeric" value={m.seed} onChange={(event) => m.setSeed(event.target.value)} placeholder="Random" className={inputClass} />
                </Field>
                <Field label="Project" htmlFor="project">
                  <select id="project" value={m.projectId} onChange={(event) => m.setProjectId(event.target.value)} className={selectClass}>
                    <option value="">No project</option>
                    {m.projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Generation engine" htmlFor="provider">
                  <select id="provider" value={m.providerName} onChange={(event) => m.setProviderName(event.target.value)} className={selectClass}>
                    <option value="">Server default</option>
                    {m.providerOptions.map((provider) => (
                      <option key={provider.name} value={provider.name} disabled={!provider.configured}>
                        {provider.name}
                        {provider.configured ? "" : " (not set up)"}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </details>
          </Card>

          {m.noProviderReady && <Alert tone="warn">No video engine is set up on the server yet. Add a provider key to the backend settings.</Alert>}
          {m.blockedReason && <Alert tone="warn">{m.blockedReason}</Alert>}
          {m.error && <Alert tone="error">{m.error}</Alert>}

          <Button type="submit" className="w-full" loading={m.submitting} disabled={!m.canSubmit}>
            <Wand2 className="size-5" /> Generate video
          </Button>
          <p className="text-center text-xs text-muted">
            {m.usage ? `Uses 1 of your ${m.usage.remaining_today} remaining generations today. ` : ""}Videos usually take a few minutes.
          </p>
        </form>

        <PreviewPanel model={m} />
      </div>
    </div>
  );
}
