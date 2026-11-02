import { ImagePlus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MAX_IMAGE_MB } from "@/lib/constants";

interface Props {
  image: File | null;
  preview: string | null;
  onSelect: (file: File | null) => void;
}

export function ReferenceImage({ image, preview, onSelect }: Props) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Reference image</h2>
        {image && (
          <button type="button" onClick={() => onSelect(null)} className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-fg">
            <X className="size-4" /> Remove
          </button>
        )}
      </div>
      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onSelect(event.dataTransfer.files?.[0] ?? null);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface-2 p-5 text-center transition hover:border-brand focus-within:border-brand"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Selected reference" className="max-h-56 w-auto rounded-xl object-contain" />
        ) : (
          <>
            <ImagePlus className="size-8 text-accent" />
            <span className="font-semibold">Drop an image or browse</span>
            <span className="text-xs text-muted">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB</span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
        />
      </label>
    </Card>
  );
}
