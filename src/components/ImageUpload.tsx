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
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) {
      onImageSelect(files);
    }
  };

  return (
    <div
      className={`panel-strong cursor-pointer border-2 border-dashed p-8 text-center transition-all ${
        isDragging
          ? "border-[rgba(109,156,255,0.7)] bg-[rgba(109,156,255,0.14)] shadow-[0_0_40px_rgba(109,156,255,0.12)]"
          : "border-[rgba(141,115,214,0.35)] bg-[rgba(255,255,255,0.04)] hover:border-[rgba(109,156,255,0.5)] hover:bg-[rgba(255,255,255,0.06)]"
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        className="hidden"
        aria-label="Upload image file"
      />

      <div className="space-y-4">
        <svg
          className="mx-auto h-12 w-12 text-[#6d9cff]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>

        <div>
          <p className="text-lg font-semibold text-white">
            {isProcessing
              ? "Cleaning images locally..."
              : isDragging
                ? "Drop files to start"
                : "Drop image files here"}
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#b9b2d9]">
            Clean hidden metadata before sending images to chat tools, image
            generators, social apps, or work systems. Nothing is uploaded to a
            server.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="pill">JPEG</span>
          <span className="pill">PNG</span>
          <span className="pill">WebP</span>
          <span className="pill">GIF</span>
          <span className="pill">BMP</span>
          <span className="pill">Up to 10 MB each</span>
        </div>
      </div>
    </div>
  );
}
