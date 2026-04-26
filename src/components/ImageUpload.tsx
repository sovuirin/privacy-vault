"use client";

import { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

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
      className={`relative w-full max-w-2xl mx-auto rounded-[3rem] p-1 transition-all duration-700 overflow-hidden cursor-pointer ${
        isDragging ? "bg-primary shadow-2xl scale-[1.02]" : "bg-white/40 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/60"
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

      <div className={`w-full py-20 rounded-[2.9rem] flex flex-col items-center justify-center space-y-8 border-2 border-dashed transition-all duration-700 ${
        isDragging ? "border-white/40 bg-primary/10" : "border-black/5"
      }`}>
        <motion.div 
          animate={isDragging ? { y: -10 } : { y: 0 }}
          className={`h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-700 ${
            isDragging ? "bg-white text-primary" : "bg-white/60 text-on-background shadow-inner"
          }`}
        >
          {isDragging ? <UploadCloud size={32} /> : <ImageIcon size={32} />}
        </motion.div>

        <div className="text-center space-y-3 px-8">
          <h3 className={`text-3xl font-bold tracking-tight transition-colors duration-700 ${
            isDragging ? "text-white" : "text-on-background"
          }`}>
            {isProcessing ? "Analyzing Patterns..." : isDragging ? "Drop to Neutralize" : "Import Sanctuary Files"}
          </h3>
          <p className={`text-sm font-light max-w-xs mx-auto leading-relaxed transition-colors duration-700 ${
            isDragging ? "text-white/70" : "text-on-background/40"
          }`}>
            Your data remains in your custody. Clinical metadata removal is performed in-browser.
          </p>
        </div>

        <div className="flex gap-2">
          {["JPG", "PNG", "WEBP"].map((ext) => (
            <span key={ext} className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-colors duration-700 ${
              isDragging ? "bg-white/20 text-white" : "bg-white/60 text-on-background/60 shadow-sm"
            }`}>
              {ext}
            </span>
          ))}
        </div>

        {!isDragging && !isProcessing && (
          <div className="btn-sovereign !rounded-full !px-12 flex items-center gap-2">
            <span>Select Files</span>
          </div>
        )}
      </div>
      
      {/* Whisper Border Glow */}
      {!isDragging && (
        <div className="absolute inset-0 rounded-[3rem] border border-white/40 pointer-events-none" />
      )}
    </div>
  );
}
