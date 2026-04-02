"use client";

import { useRef } from "react";

interface DocumentUploadProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export function DocumentUpload({
  onFilesSelect,
  isProcessing,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesSelect(selectedFiles);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files || []);
    const documents = files.filter((f) =>
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(f.type)
    );

    if (documents.length > 0) {
      onFilesSelect(documents);
    }
  };

  return (
    <div
      className="panel cursor-pointer border-2 border-dashed border-[rgba(134,211,187,0.28)] p-8 text-center transition-colors hover:border-[rgba(134,211,187,0.45)] hover:bg-[rgba(255,255,255,0.05)]"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
        accept=".pdf,.docx,.pptx,.xlsx"
        onChange={handleFileChange}
        disabled={isProcessing}
        multiple
        className="hidden"
        aria-label="Upload document files"
      />

      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-[#86d3bb]"
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

        <div>
          <p className="text-lg font-semibold text-white">
            {isProcessing
              ? "Preparing documents..."
              : "Drop document files here"}
          </p>
          <p className="text-sm text-[#b9b2d9]">
            PDF, DOCX, PPTX, and XLSX are supported. This feature is coming
            later.
          </p>
        </div>
      </div>
    </div>
  );
}
