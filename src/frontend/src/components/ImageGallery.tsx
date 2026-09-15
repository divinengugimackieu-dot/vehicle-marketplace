import { CarFront, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ExternalBlob } from "@caffeineai/object-storage";

interface ImageGalleryProps {
  photos: ExternalBlob[];
  title: string;
}

export function ImageGallery({ photos, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = photos.length;
  const activePhoto = photos[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, next, prev]);

  if (count === 0) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground"
        data-ocid="image_gallery.empty_state"
      >
        <CarFront className="size-16" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted shadow-subtle">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full cursor-zoom-in"
          aria-label={`View ${title} photo full size`}
          data-ocid="image_gallery.open_lightbox"
        >
          <img
            src={activePhoto.getDirectURL()}
            alt={`${title} — view ${activeIndex + 1} of ${count}`}
            className="aspect-[16/10] w-full object-cover"
          />
        </button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => setLightboxOpen(true)}
          aria-label="View photo full size"
          data-ocid="image_gallery.expand_button"
        >
          <Expand className="size-4" />
        </Button>
      </div>

      {count > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <button
              key={photo.directURL}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`View photo ${index + 1}`}
              aria-current={index === activeIndex}
              className={`overflow-hidden rounded-lg border transition-smooth ${
                index === activeIndex
                  ? "border-primary ring-2 ring-ring"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
              data-ocid={`image_gallery.thumbnail.${index + 1}`}
            >
              <img
                src={photo.getDirectURL()}
                alt=""
                className="aspect-[16/10] w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-5xl border-0 bg-black/90 p-0 sm:max-w-5xl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {title} — photo {activeIndex + 1} of {count}
          </DialogTitle>
          <div className="relative flex items-center justify-center p-4 sm:p-8">
            <img
              src={activePhoto.getDirectURL()}
              alt={`${title} — view ${activeIndex + 1} of ${count}`}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {count > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:left-4"
                  onClick={prev}
                  aria-label="Previous photo"
                  data-ocid="image_gallery.prev_button"
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:right-4"
                  onClick={next}
                  aria-label="Next photo"
                  data-ocid="image_gallery.next_button"
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center justify-between px-4 pb-4 sm:px-8">
            <p className="text-sm text-white/80">
              {activeIndex + 1} / {count}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo viewer"
              data-ocid="image_gallery.close_button"
            >
              <X className="size-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
