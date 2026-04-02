"use client";

import type {
  ProcessingQuality,
  ExportFormat,
  QualitySettings as QualitySettingsType,
} from "@/hooks/useBatchProcessor";

interface QualitySettingsProps {
  settings: QualitySettingsType;
  onSettingsChange: (settings: Partial<QualitySettingsType>) => void;
}

export function QualitySettings({
  settings,
  onSettingsChange,
}: QualitySettingsProps) {
  return (
    <div className="card mb-6">
      <h3 className="mb-4 text-lg font-bold text-white">Processing Options</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#d8d3ee]">
            Quality Level
          </label>
          <div className="space-y-2">
            {(["high", "medium", "low"] as ProcessingQuality[]).map((q) => (
              <label key={q} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="quality"
                  value={q}
                  checked={settings.quality === q}
                  onChange={(e) =>
                    onSettingsChange({
                      quality: e.target.value as ProcessingQuality,
                    })
                  }
                  className="h-4 w-4 text-sky-500"
                />
                <span className="text-sm text-[#d8d3ee]">
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                  <span className="ml-1 text-xs text-[#938cb4]">
                    {q === "high" && "(Original size, lossless)"}
                    {q === "medium" && "(Optimized, good quality)"}
                    {q === "low" && "(Compressed, smallest file)"}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#d8d3ee]">
            Export Format
          </label>
          <div className="space-y-2">
            {(["png", "jpeg", "webp"] as ExportFormat[]).map((f) => (
              <label key={f} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={settings.format === f}
                  onChange={(e) =>
                    onSettingsChange({
                      format: e.target.value as ExportFormat,
                    })
                  }
                  className="h-4 w-4 text-sky-500"
                />
                <span className="text-sm text-[#d8d3ee]">
                  {f.toUpperCase()}
                  <span className="ml-1 text-xs text-[#938cb4]">
                    {f === "png" && "(Lossless, larger)"}
                    {f === "jpeg" && "(Compressed, smaller)"}
                    {f === "webp" && "(Modern, best compression)"}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {settings.format !== "png" && (
        <div className="mt-6 border-t border-[rgba(157,139,210,0.18)] pt-6">
          <label className="mb-3 block text-sm font-semibold text-[#d8d3ee]">
            Compression Quality:{" "}
            {settings.jpegQuality
              ? Math.round(settings.jpegQuality * 100)
              : 85}
            %
          </label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={settings.jpegQuality || 0.85}
            onChange={(e) =>
              onSettingsChange({ jpegQuality: parseFloat(e.target.value) })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[rgba(255,255,255,0.08)]"
          />
          <p className="mt-2 text-xs text-[#938cb4]">
            Lower values = smaller files, higher values = better quality
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-[rgba(109,156,255,0.22)] bg-[rgba(109,156,255,0.08)] p-3">
        <p className="text-xs text-[#d8d3ee]">
          <strong>Tip:</strong> Use &quot;Low&quot; quality for batch processing
          many images quickly. Use &quot;High&quot; quality when preserving
          detail is important.
        </p>
      </div>
    </div>
  );
}
