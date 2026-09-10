import { useEffect } from "react";
import { X } from "lucide-react";
import { useStudio } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Lightbox() {
  const src = useStudio((s) => s.lightbox);
  const close = useStudio((s) => s.closeLightbox);

  useEffect(() => {
    if (!src) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, close]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/88 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged rendering"
      onClick={close}
    >
      <Button
        type="button"
        variant="pill"
        size="sm"
        className="absolute top-4 right-4"
        onClick={close}
      >
        <X className="size-4" />
        Close
      </Button>
      <img
        src={src}
        alt=""
        className="max-h-[88vh] max-w-full rounded-lg object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
