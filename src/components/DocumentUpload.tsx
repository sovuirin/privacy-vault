"use client";

import { useRef, useState } from "react";

interface DocumentUploadProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export function DocumentUpload({
  onFilesSelect,
  isProcessing,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

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
      className={`border border-[#09090B] p-12 text-center transition-all bg-white relative overflow-hidden group cursor-pointer ${
        isDragging ? "bg-[#10B981]/5 border-[#10B981]" : "hover:border-[#10B981]"
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.pptx,.xlsx"
        onChange={handleFileChange}
        disabled={isProcessing}
        multiple
        className="hidden"
      />

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#09090B]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#09090B]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#09090B]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#09090B]" />

      <div className="space-y-6">
        <div className="mx-auto w-12 h-12 flex items-center justify-center border border-[#09090B]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest">
            {isProcessing ? "[ PREPARING_VAULT ]" : isDragging ? "[ RELEASE_DOCUMENTS ]" : "DROP_VAULT_DOCUMENTS"}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto">
            Deep-scrub forensic analysis for metadata and hidden properties.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {["PDF", "DOCX", "PPTX", "XLSX"].map((ext) => (
            <span key={ext} className="text-[9px] font-black border border-gray-200 px-2 py-0.5 tracking-tighter">
              [{ext}]
            </span>
          ))}
        </div>

        <button className="btn-tactical bg-[#09090B] text-white">
          SCAN_LOCAL_DIRECTORIES
        </button>
      </div>
    </div>
  );
}
