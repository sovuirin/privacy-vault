"use client";

import { useEffect, useRef, useState } from "react";
import {
  applyRedactions,
  createImageCanvas,
  downloadRedactedImage,
  downloadRedactionReport,
  RedactionArea,
} from "@/lib/redaction";

interface ScreenshotRedactorProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

interface Point {
  x: number;
  y: number;
}

function scaleArea(area: RedactionArea, scaleX: number, scaleY: number) {
  const x = area.width < 0 ? area.x + area.width : area.x;
  const y = area.height < 0 ? area.y + area.height : area.y;
  const width = Math.abs(area.width);
  const height = Math.abs(area.height);

  return {
    left: x * scaleX,
    top: y * scaleY,
    width: width * scaleX,
    height: height * scaleY,
  };
}

export function ScreenshotRedactor({
  onFileSelect,
  isProcessing,
}: ScreenshotRedactorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [redactions, setRedactions] = useState<RedactionArea[]>([]);
  const [redactionMode, setRedactionMode] = useState<"blur" | "blackout">(
    "blur"
  );
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [draftArea, setDraftArea] = useState<RedactionArea | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!preview || !imgRef.current) {
      return;
    }

    const updateDisplaySize = () => {
      if (!imgRef.current) {
        return;
      }

      setDisplaySize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    };

    updateDisplaySize();
    window.addEventListener("resize", updateDisplaySize);
    return () => window.removeEventListener("resize", updateDisplaySize);
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
        setFilename(file.name);
        setRedactions([]);
        setDraftArea(null);
        setStartPoint(null);
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const clearRedactions = () => {
    setRedactions([]);
    setDraftArea(null);
  };

  const undoRedaction = () => {
    setRedactions((current) => current.slice(0, -1));
  };

  const resetImage = () => {
    setPreview(null);
    setFilename("");
    setRedactions([]);
    setDraftArea(null);
    setStartPoint(null);
    setImageSize({ width: 0, height: 0 });
    setDisplaySize({ width: 0, height: 0 });
  };

  const eventToImagePoint = (
    event: React.PointerEvent<HTMLDivElement>
  ): Point | null => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height || !imageSize.width || !imageSize.height) {
      return null;
    }

    const x = ((event.clientX - bounds.left) / bounds.width) * imageSize.width;
    const y = ((event.clientY - bounds.top) / bounds.height) * imageSize.height;

    return {
      x: Math.max(0, Math.min(imageSize.width, x)),
      y: Math.max(0, Math.min(imageSize.height, y)),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = eventToImagePoint(event);
    if (!point) {
      return;
    }

    setStartPoint(point);
    setDraftArea({
      id: "draft",
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      type: redactionMode,
      blurAmount: redactionMode === "blur" ? 14 : undefined,
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!startPoint) {
      return;
    }

    const point = eventToImagePoint(event);
    if (!point) {
      return;
    }

    setDraftArea({
      id: "draft",
      x: startPoint.x,
      y: startPoint.y,
      width: point.x - startPoint.x,
      height: point.y - startPoint.y,
      type: redactionMode,
      blurAmount: redactionMode === "blur" ? 14 : undefined,
    });
  };

  const handlePointerUp = () => {
    if (!draftArea) {
      setStartPoint(null);
      return;
    }

    if (Math.abs(draftArea.width) > 6 && Math.abs(draftArea.height) > 6) {
      setRedactions((current) => [
        ...current,
        {
          ...draftArea,
          id: `redaction-${Date.now()}-${current.length}`,
        },
      ]);
    }

    setStartPoint(null);
    setDraftArea(null);
  };

  const buildRedactedCanvas = async () => {
    if (!preview) {
      throw new Error("No screenshot loaded");
    }

    const sourceImage = new Image();
    sourceImage.src = preview;

    await new Promise<void>((resolve, reject) => {
      sourceImage.onload = () => resolve();
      sourceImage.onerror = () => reject(new Error("Could not load screenshot"));
    });

    const sourceCanvas = createImageCanvas(sourceImage);
    return applyRedactions(sourceCanvas, redactions);
  };

  const handleDownload = async (format: "png" | "jpeg") => {
    const canvas = await buildRedactedCanvas();
    downloadRedactedImage(canvas, filename || "screenshot", format);
  };

  const renderArea = (area: RedactionArea, isDraft = false) => {
    if (!displaySize.width || !displaySize.height || !imageSize.width || !imageSize.height) {
      return null;
    }

    const scaled = scaleArea(
      area,
      displaySize.width / imageSize.width,
      displaySize.height / imageSize.height
    );

    return (
      <div
        key={isDraft ? "draft" : area.id}
        className={`absolute border-2 ${
          area.type === "blackout"
            ? "border-[#ffb3b3] bg-[rgba(0,0,0,0.7)]"
            : "border-[#6d9cff] bg-[rgba(109,156,255,0.18)] backdrop-blur-[2px]"
        } ${isDraft ? "opacity-80" : ""}`}
        style={{
          left: scaled.left,
          top: scaled.top,
          width: scaled.width,
          height: scaled.height,
        }}
      >
        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-white/80" />
        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-white/80" />
        <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-white/80" />
        <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-white/80" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!preview ? (
        <div
          className="panel cursor-pointer border-2 border-dashed border-[rgba(141,115,214,0.35)] p-8 text-center transition-colors hover:border-[rgba(109,156,255,0.45)] hover:bg-[rgba(255,255,255,0.05)]"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClick();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="hidden"
            aria-label="Upload screenshot"
          />

          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-[#8d73d6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
              />
            </svg>

            <div>
              <p className="text-lg font-semibold text-white">
                Upload a screenshot
              </p>
              <p className="text-sm text-[#b9b2d9]">
                Use this before sharing chats, dashboards, prompts, or work
                tools online or with AI systems.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Redact visible details before you share
                </h3>
                <p className="text-sm text-[#b9b2d9]">
                  Add boxes to cover names, emails, prompts, API keys, account
                  numbers, or anything else you do not want to upload or post.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5">
                  <input
                    type="radio"
                    value="blur"
                    checked={redactionMode === "blur"}
                    onChange={() => setRedactionMode("blur")}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-[#d8d3ee]">Blur</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5">
                  <input
                    type="radio"
                    value="blackout"
                    checked={redactionMode === "blackout"}
                    onChange={() => setRedactionMode("blackout")}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-[#d8d3ee]">Blackout</span>
                </label>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.04)] p-3 text-sm text-[#b9b2d9]">
              Click and drag on the screenshot to create a redaction box.
              {redactions.length > 0 && (
                <span className="ml-2">{redactions.length} redaction(s) added.</span>
              )}
            </div>

            <div className="relative overflow-hidden rounded-xl bg-[rgba(255,255,255,0.05)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={preview}
                alt="Screenshot to redact"
                className="block h-auto max-h-[34rem] w-full object-contain"
                onLoad={(event) => {
                  const target = event.currentTarget;
                  setImageSize({
                    width: target.naturalWidth,
                    height: target.naturalHeight,
                  });
                  setDisplaySize({
                    width: target.clientWidth,
                    height: target.clientHeight,
                  });
                }}
              />

              <div
                className="absolute inset-0 cursor-crosshair"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {redactions.map((area) => renderArea(area))}
                {draftArea ? renderArea(draftArea, true) : null}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                  Best for
                </p>
                <p className="mt-1 text-sm text-white">
                  Screenshots that include names, prompts, dashboards, or account data
                </p>
              </div>
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                  Processing
                </p>
                <p className="mt-1 text-sm text-white">
                  Redactions are applied locally in your browser
                </p>
              </div>
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#938cb4]">
                  Output
                </p>
                <p className="mt-1 text-sm text-white">
                  Export as PNG or JPEG with your redactions applied
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={undoRedaction}
                disabled={redactions.length === 0}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Undo
              </button>
              <button
                onClick={clearRedactions}
                disabled={redactions.length === 0}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear All
              </button>
              <button
                onClick={() => void handleDownload("png")}
                disabled={redactions.length === 0}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download PNG
              </button>
              <button
                onClick={() => void handleDownload("jpeg")}
                disabled={redactions.length === 0}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download JPEG
              </button>
              <button
                onClick={() => downloadRedactionReport(filename, redactions)}
                disabled={redactions.length === 0}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download Report
              </button>
              <button onClick={resetImage} className="btn-secondary">
                Upload New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
