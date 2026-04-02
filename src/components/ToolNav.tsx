"use client";

export type ToolType = "images" | "documents" | "screenshots";

interface ToolNavProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export function ToolNav({ currentTool, onToolChange }: ToolNavProps) {
  const betaBadge = (
    <span className="rounded-full border border-[rgba(214,181,108,0.3)] bg-[rgba(214,181,108,0.12)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#d6b56c]">
      Beta
    </span>
  );

  return (
    <div className="mb-8 rounded-2xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] p-2 backdrop-blur-sm">
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => onToolChange("images")}
          className={`rounded-xl px-4 py-3 font-semibold transition whitespace-nowrap ${
            currentTool === "images"
              ? "bg-[rgba(109,156,255,0.12)] text-white shadow-lg ring-1 ring-[rgba(109,156,255,0.35)]"
              : "text-[#b9b2d9] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Image Cleaner
          </span>
        </button>

        <button
          onClick={() => onToolChange("documents")}
          className={`rounded-xl px-4 py-3 font-semibold transition whitespace-nowrap ${
            currentTool === "documents"
              ? "bg-[rgba(109,156,255,0.12)] text-white shadow-lg ring-1 ring-[rgba(109,156,255,0.35)]"
              : "text-[#b9b2d9] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Document Cleaner
            {betaBadge}
          </span>
        </button>

        <button
          onClick={() => onToolChange("screenshots")}
          className={`rounded-xl px-4 py-3 font-semibold transition whitespace-nowrap ${
            currentTool === "screenshots"
              ? "bg-[rgba(109,156,255,0.12)] text-white shadow-lg ring-1 ring-[rgba(109,156,255,0.35)]"
              : "text-[#b9b2d9] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
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
            Screenshot Redactor
            {betaBadge}
          </span>
        </button>
      </div>
    </div>
  );
}
