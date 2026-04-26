"use client";

import { useMemo, useState } from "react";
import {
  buildCleanedFilename,
  downloadCleanedImage,
  ExportFormat,
  ExportOptions,
} from "@/lib/metadata";
import type { ScrubbedImageResult } from "@/hooks/useImageScrubber";

interface ImageDownloadProps {
  images: ScrubbedImageResult[];
}

function formatLabel(format: ExportFormat): string {
  if (format === "jpeg") return "JPEG";
  if (format === "webp") return "WebP";
  return "PNG";
}

export function ImageDownload({ images }: ImageDownloadProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [qualityPercent, setQualityPercent] = useState(92);
  const [targetSizeKB, setTargetSizeKB] = useState<string>("");
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const options = useMemo<Partial<ExportOptions>>(
    () => ({
      format,
      quality: qualityPercent / 100,
      targetSizeKB: targetSizeKB.trim()
        ? Math.max(20, Number.parseInt(targetSizeKB, 10) || 0)
        : null,
    }),
    [format, qualityPercent, targetSizeKB]
  );

  if (!images.length) {
    return null;
  }

  const handleSingleDownload = async (image: ScrubbedImageResult) => {
    if (!image.cleanedCanvas) return;
    await downloadCleanedImage(
      image.cleanedCanvas,
      image.originalFile.name,
      options
    );
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      for (const image of images) {
        if (!image.cleanedCanvas) continue;
        await downloadCleanedImage(
          image.cleanedCanvas,
          image.originalFile.name,
          options
        );
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const isQualityDisabled = format === "png";
  const isTargetSizeDisabled = format === "png";

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="text-[#86d3bb]">✓</span> Export Settings
        </h3>
        <p className="mb-4 mt-1 text-sm text-[#b9b2d9]">
          Choose the format you want before sharing the cleaned file anywhere
          else.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="text-sm text-[#d8d3ee]">
            <span className="mb-2 block font-semibold">Format</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="field"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </label>

          <label className="text-sm text-[#d8d3ee]">
            <span className="mb-2 block font-semibold">
              Quality: {qualityPercent}%
            </span>
            <input
              type="range"
              min={35}
              max={100}
              step={1}
              value={qualityPercent}
              onChange={(e) => setQualityPercent(Number(e.target.value))}
              disabled={isQualityDisabled}
              className="w-full accent-[var(--pv-blue)] disabled:opacity-50"
            />
            <span className="text-xs text-[#938cb4]">
              {isQualityDisabled
                ? "PNG ignores quality settings"
                : "Lower quality creates smaller files"}
            </span>
          </label>

          <label className="text-sm text-[#d8d3ee]">
            <span className="mb-2 block font-semibold">Target size (KB)</span>
            <input
              type="number"
              min={20}
              value={targetSizeKB}
              onChange={(e) => setTargetSizeKB(e.target.value)}
              placeholder="Optional"
              disabled={isTargetSizeDisabled}
              className="field disabled:opacity-50"
            />
            <span className="text-xs text-[#938cb4]">
              {isTargetSizeDisabled
                ? "PNG export keeps original canvas dimensions"
                : "Best-effort: quality and dimensions may be reduced"}
            </span>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="btn-primary disabled:opacity-60"
          >
            {isDownloadingAll
              ? "Preparing cleaned downloads..."
              : `Download All Cleaned Files (${images.length})`}
          </button>
          <span className="self-center text-xs text-[#b9b2d9]">
            Cleaned files download as {formatLabel(format)} after local
            processing in your browser.
          </span>
        </div>
        <p className="mt-3 text-xs text-[#938cb4]">
          Browser note: bulk export triggers one cleaned download per image.
        </p>
      </div>

      <div className="space-y-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="card flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {image.originalFile.name}
              </p>
              <p className="text-xs text-[#b9b2d9]">
                {(image.originalFile.size / 1024).toFixed(1)} KB original •{" "}
                {image.cleanedCanvas?.width ?? "?"} × {image.cleanedCanvas?.height ?? "?"}
              </p>
              <p className="mt-1 text-xs text-[#938cb4]">
                Exports as {buildCleanedFilename(image.originalFile.name, format)}
              </p>
            </div>
            <button
              onClick={() => handleSingleDownload(image)}
              className="btn-primary whitespace-nowrap"
            >
              Download Cleaned File
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.04)] p-3 text-xs text-[#b9b2d9]">
        <p>
          <strong>Privacy Note:</strong> All processing happens in your browser.
          Your image is never sent to a server.
        </p>
      </div>
    </div>
  );
}
