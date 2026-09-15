import { ExternalBlob } from "@caffeineai/object-storage";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PhotoUploadProps {
  photos: ExternalBlob[];
  onChange: (photos: ExternalBlob[]) => void;
  onProgress?: (progress: number) => void;
  max?: number;
}

/**
 * Photo uploader backed by the platform object-storage extension. Selected
 * files are wrapped in `ExternalBlob` instances (which provide an immediate
 * local preview) and handed to the parent. The blobs are uploaded to the
 * storage gateway when the parent submits them to the backend; each blob's
 * upload progress is reported back through `onProgress`.
 */
export function PhotoUpload({
  photos,
  onChange,
  onProgress,
  max = 8,
}: PhotoUploadProps) {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const keys = Object.keys(progress);
    if (keys.length === 0) {
      onProgress?.(0);
      return;
    }
    const total = keys.reduce((sum, key) => sum + progress[key], 0);
    onProgress?.(Math.round(total / keys.length));
  }, [progress, onProgress]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = max - photos.length;
    const selected = files.slice(0, remaining);
    const blobs: ExternalBlob[] = [];
    for (const file of selected) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes, file.type, file.name);
      const key = blob.directURL;
      blob.withUploadProgress((pct) => {
        setProgress((current) => ({ ...current, [key]: pct }));
      });
      blobs.push(blob);
    }
    onChange([...photos, ...blobs]);
    e.target.value = "";
  };

  const removePhoto = (key: string) => {
    onChange(photos.filter((photo) => photo.directURL !== key));
    setProgress((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((photo) => {
          const key = photo.directURL;
          const pct = progress[key];
          return (
            <div
              key={key}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-border"
            >
              <img
                src={photo.getDirectURL()}
                alt="Selected vehicle"
                className="h-full w-full object-cover"
              />
              {pct !== undefined && pct < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(key)}
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="Remove photo"
                data-ocid="sell.remove_photo"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        })}
        {photos.length < max && (
          <label
            className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            data-ocid="sell.upload_button"
          >
            <ImagePlus className="size-6" />
            <span className="text-xs font-medium">Add photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Up to {max} photos. Photos are stored securely and shown to buyers.
      </p>
    </div>
  );
}
