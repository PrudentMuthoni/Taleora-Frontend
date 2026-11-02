export interface StylePreset {
  id: string;
  label: string;
  suffix: string;
}

// There is no "style" field in the backend, so a preset simply adds wording to the prompt.
export const STYLE_PRESETS: StylePreset[] = [
  { id: "none", label: "None", suffix: "" },
  { id: "cinematic", label: "Cinematic", suffix: "cinematic lighting, shallow depth of field, smooth camera movement" },
  { id: "anime", label: "Anime", suffix: "anime style, vibrant colours, expressive motion" },
  { id: "photoreal", label: "Photoreal", suffix: "photorealistic, natural light, highly detailed" },
  { id: "dreamy", label: "Dreamy", suffix: "dreamy, soft focus, pastel tones, gentle movement" },
];
