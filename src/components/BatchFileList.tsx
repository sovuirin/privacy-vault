"use client";

import type { BatchFile } from "@/hooks/useBatchProcessor";

interface BatchFileListProps {
  files: BatchFile[];
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

function outcomeLabel(file: BatchFile): string | null {
  if (file.outcome === "cleaned") return "Cleaned";
  if (file.outcome === "limited") return "Limited";
  if (file.outcome === "unsupported") return "Not available";
  return null;
}

function outcomeClasses(file: BatchFile): string {
  if (file.outcome === "cleaned") {
    return "border-[rgba(134,211,187,0.24)] bg-[rgba(134,211,187,0.1)] text-[#86d3bb]";
  }
  if (file.outcome === "limited") {
    return "border-[rgba(214,181,108,0.3)] bg-[rgba(214,181,108,0.12)] text-[#e1cc91]";
  }
  return "border-[rgba(255,159,159,0.22)] bg-[rgba(255,159,159,0.1)] text-[#ffb3b3]";
}

export function BatchFileList({
  files,
  onRemove,
  onDownload,
}: BatchFileListProps) {
  if (files.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[#938cb4]">
          No files selected yet. Upload files to start reviewing them.
        </p>
      </div>
    );
  }

  const completedCount = files.filter((f) => f.status === "completed").length;
  const failedCount = files.filter((f) => f.status === "failed").length;

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Files ({files.length})</h3>
        <div className="text-sm text-[#b9b2d9]">
          {completedCount > 0 && (
            <span className="mr-3 text-[#86d3bb]">✓ {completedCount} ready</span>
          )}
          {failedCount > 0 && (
            <span className="text-[#ff9f9f]">✗ {failedCount} need review</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.04)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="truncate font-medium text-white">
                    {file.file.name}
                  </p>
                  <span className="flex-shrink-0 text-xs text-[#938cb4]">
                    ({(file.file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      file.status === "completed"
                        ? "bg-[#86d3bb]"
                        : file.status === "failed"
                          ? "bg-[#ff9f9f]"
                          : "bg-[#6d9cff]"
                    }`}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>

                {file.summary && (
                  <p className="mt-2 text-sm text-[#d8d3ee]">{file.summary}</p>
                )}

                {file.metadata?.metadataTypes?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {file.metadata.metadataTypes.map((type) => (
                      <span
                        key={`${file.id}-${type}`}
                        className="rounded-full border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 text-[11px] font-semibold text-[#d8d3ee]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : null}

                {file.error && (
                  <p className="mt-2 text-xs text-[#ff9f9f]">{file.error}</p>
                )}
              </div>

              <div className="ml-4 flex flex-shrink-0 flex-col items-end gap-2">
                {outcomeLabel(file) ? (
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${outcomeClasses(file)}`}
                  >
                    {outcomeLabel(file)}
                  </span>
                ) : null}

                <div className="flex items-center gap-2">
                  {file.status === "completed" && file.result ? (
                    <button
                      onClick={() => onDownload(file.id)}
                      className="rounded p-2 transition-colors hover:bg-[rgba(109,156,255,0.12)]"
                      title="Download"
                    >
                      <svg
                        className="h-5 w-5 text-[#6d9cff]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  ) : null}

                  <button
                    onClick={() => onRemove(file.id)}
                    className="rounded p-2 transition-colors hover:bg-[rgba(255,159,159,0.12)]"
                    title="Remove"
                  >
                    <svg
                      className="h-5 w-5 text-[#ff9f9f]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
