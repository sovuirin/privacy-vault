"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  isProcessing: boolean;
}

export function ImageUpload({ onImageSelect, isProcessing }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) {
      onImageSelect(files);
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
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) {
      onImageSelect(files);
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
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
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
            <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest">
            {isProcessing ? "[ ANALYZING_SOURCE ]" : isDragging ? "[ DROP_FILES_NOW ]" : "DROP_SOURCE_FILES"}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto">
            Client-side forensic scrubbing. No data transmission to remote nodes.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {["JPG", "PNG", "WEBP", "GIF"].map((ext) => (
            <span key={ext} className="text-[9px] font-black border border-gray-200 px-2 py-0.5 tracking-tighter">
              [{ext}]
            </span>
          ))}
        </div>

        <button className="btn-tactical bg-[#09090B] text-white">
          BROWSE_LOCAL_STORAGE
        </button>
      </div>
    </div>
  );
}
