"use client";

import { useEffect, useRef } from "react";
import { BatchFile } from "@/lib/metadata";

interface ImagePreviewProps {
  images: BatchFile[];
}

interface GalleryItemProps {
  image: BatchFile;
}

function GalleryItem({ image }: GalleryItemProps) {
  const cleanedCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!cleanedCanvasRef.current || !image.neutralizedCanvas) {
      return;
    }

    const canvas = cleanedCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    canvas.width = image.neutralizedCanvas.width;
    canvas.height = image.neutralizedCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image.neutralizedCanvas, 0, 0);
  }, [image.id, image.neutralizedCanvas]);

  return (
    <article className="card overflow-hidden p-0">
      <div className="border-b border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.04)] p-4">
        <h3 className="break-all text-base font-semibold text-white">
          {image.file.name}
        </h3>
        <p className="mt-1 text-sm text-[#b9b2d9]">
          Metadata removed
        </p>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-xl bg-[rgba(255,255,255,0.05)]">
          <canvas
            ref={cleanedCanvasRef}
            className="max-h-72 h-auto w-full object-contain"
          />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {image.report?.signals.map((signal) => (
              <span
                key={signal.id}
                className="rounded-full border border-[rgba(134,211,187,0.22)] bg-[rgba(134,211,187,0.1)] px-2.5 py-1 text-[11px] font-semibold text-[#86d3bb]"
              >
                {signal.label} removed
              </span>
            ))}
          </div>

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                Original Size
              </dt>
              <dd className="mt-1 text-white">
                {(image.file.size / 1024).toFixed(2)} KB
              </dd>
            </div>
            <div className="rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                Dimensions
              </dt>
              <dd className="mt-1 text-white">
                {image.neutralizedCanvas?.width ?? "?"} × {image.neutralizedCanvas?.height ?? "?"}px
              </dd>
            </div>
            <div className="rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                Processing
              </dt>
              <dd className="mt-1 text-white">In your browser</dd>
            </div>
            <div className="rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                Result
              </dt>
              <dd className="mt-1 text-white">Visual image preserved</dd>
            </div>
          </dl>

          <p className="text-xs text-[#938cb4]">
            The exported image keeps the same visible pixels while embedded
            metadata is stripped from the file.
          </p>
        </div>
      </div>
    </article>
  );
}

export function ImagePreview({ images }: ImagePreviewProps) {
  if (!images.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#938cb4]">
          Results
        </p>
        <h2 className="text-xl font-bold text-white">
          Review your files before downloading
        </h2>
        <p className="text-sm text-[#b9b2d9]">
          Each file includes a preview and the details of what was removed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {images.map((image) => (
          <GalleryItem key={image.id} image={image} />
        ))}
      </div>
    </section>
  );
}
