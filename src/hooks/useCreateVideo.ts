"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IMAGE_TYPES, MAX_IMAGE_MB, MAX_PROMPT_LENGTH, POLL_INTERVAL_MS } from "@/lib/constants";
import { errorMessage } from "@/lib/errors";
import { isActive } from "@/lib/format";
import { takeReuse } from "@/lib/reuseStore";
import { STYLE_PRESETS } from "@/lib/stylePresets";
import { generationApi } from "@/services/api";
import type {
  AspectRatio,
  CreateGenerationInput,
  Generation,
  GenerationMode,
  Resolution,
} from "@/types/api";
import { useInterval } from "./useInterval";
import { useProjects } from "./useProjects";
import { useProviders } from "./useProviders";
import { useUsage } from "./useUsage";

export function useCreateVideo() {
  const { usage, refreshUsage } = useUsage();
  const { providers } = useProviders();
  const { projects } = useProjects();

  const [mode, setMode] = useState<GenerationMode>("text_to_video");
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState("none");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [seed, setSeed] = useState("");
  const [providerName, setProviderName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Generation | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Pre-fill from "Reuse prompt" on a library card, or from ?mode=image.
  useEffect(() => {
    const reuse = takeReuse();
    if (reuse) {
      setMode(reuse.mode);
      setPrompt(reuse.prompt);
      setNegativePrompt(reuse.negativePrompt);
      setAspectRatio(reuse.aspectRatio);
      setDuration(reuse.duration);
      setResolution(reuse.resolution);
    }
    if (new URLSearchParams(window.location.search).get("mode") === "image") setMode("image_to_video");
  }, []);

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const jobActive = job !== null && isActive(job.status);

  useInterval(
    async () => {
      if (!job) return;
      try {
        const latest = await generationApi.get(job.id);
        setJob(latest);
        if (latest.status === "completed") setVideoUrl((await generationApi.videoLink(latest.id)).url);
        if (!isActive(latest.status)) void refreshUsage();
      } catch (caught) {
        setError(errorMessage(caught));
      }
    },
    jobActive ? POLL_INTERVAL_MS : null,
  );

  useInterval(() => setNow(Date.now()), jobActive ? 1000 : null);
  const elapsedSeconds = job && jobActive ? Math.max(0, Math.floor((now - Date.parse(job.created_at)) / 1000)) : 0;

  const style = STYLE_PRESETS.find((preset) => preset.id === styleId) ?? STYLE_PRESETS[0];
  const providerOptions = useMemo(() => providers.filter((p) => p.modes.includes(mode)), [providers, mode]);
  const noProviderReady = providers.length > 0 && !providers.some((p) => p.configured);

  let blockedReason: string | null = null;
  if (usage) {
    if (usage.remaining_today <= 0) {
      blockedReason = `You've used all ${usage.daily_limit} generations for today. The limit resets at midnight UTC.`;
    } else if (usage.active_jobs >= usage.max_concurrent_jobs) {
      blockedReason = `You already have ${usage.active_jobs} videos generating. Wait for one to finish.`;
    }
  }

  const canSubmit =
    prompt.trim().length >= 3 &&
    !submitting &&
    !jobActive &&
    blockedReason === null &&
    (mode === "text_to_video" || image !== null);

  const selectImage = useCallback((file: File | null) => {
    if (file === null) {
      setImage(null);
      return;
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Images can be at most ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setError(null);
    setImage(file);
  }, []);

  async function submit() {
    setError(null);
    const finalPrompt = [prompt.trim(), style.suffix].filter(Boolean).join(", ");
    if (finalPrompt.length > MAX_PROMPT_LENGTH) {
      setError(`Your prompt is too long. The limit is ${MAX_PROMPT_LENGTH} characters including the style.`);
      return;
    }
    const seedNumber = seed.trim() === "" ? null : Number(seed);
    if (seedNumber !== null && (!Number.isInteger(seedNumber) || seedNumber < 0)) {
      setError("The seed must be a whole number, zero or higher.");
      return;
    }
    if (mode === "image_to_video" && !image) {
      setError("Add a reference image first.");
      return;
    }

    const input: CreateGenerationInput = {
      prompt: finalPrompt,
      negative_prompt: negativePrompt.trim() || null,
      project_id: projectId || null,
      aspect_ratio: aspectRatio,
      duration_seconds: duration,
      resolution,
      seed: seedNumber,
      provider: providerName || null,
    };

    setSubmitting(true);
    setVideoUrl(null);
    try {
      const created =
        mode === "image_to_video" && image
          ? await generationApi.createImage(input, image)
          : await generationApi.createText(input);
      setJob(created);
      void refreshUsage();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function cancel() {
    if (!job) return;
    try {
      setJob(await generationApi.cancel(job.id));
      void refreshUsage();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  async function assignToProject(target: string) {
    if (!job) return;
    try {
      setJob(await generationApi.setProject(job.id, target || null));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  function startOver() {
    setJob(null);
    setVideoUrl(null);
    setError(null);
  }

  return {
    mode, setMode,
    prompt, setPrompt,
    styleId, setStyleId,
    negativePrompt, setNegativePrompt,
    aspectRatio, setAspectRatio,
    duration, setDuration,
    resolution, setResolution,
    seed, setSeed,
    providerName, setProviderName,
    projectId, setProjectId,
    image, imagePreview, selectImage,
    projects, providerOptions, noProviderReady,
    usage, blockedReason, canSubmit,
    submitting, error, job, jobActive, elapsedSeconds, videoUrl,
    submit, cancel, assignToProject, startOver,
  };
}

export type CreateVideoModel = ReturnType<typeof useCreateVideo>;
