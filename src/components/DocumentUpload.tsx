"use client";

import { useRef, useState } from "react";
import { FileUp, FileText } from "lucide-react";
import { motion } from "framer-motion";

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
      className={`relative w-full rounded-[3rem] p-1 transition-all duration-700 overflow-hidden cursor-pointer ${
        isDragging ? "bg-primary shadow-2xl scale-[1.01]" : "bg-white/40 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/60"
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

      <div className={`w-full py-16 rounded-[2.9rem] flex flex-col items-center justify-center space-y-6 border-2 border-dashed transition-all duration-700 ${
        isDragging ? "border-white/40 bg-primary/10" : "border-black/5"
      }`}>
        <motion.div 
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-700 ${
            isDragging ? "bg-white text-primary" : "bg-white/60 text-on-background shadow-inner"
          }`}
        >
          {isDragging ? <FileUp size={28} /> : <FileText size={28} />}
        </motion.div>

        <div className="text-center space-y-2 px-8">
          <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-700 ${
            isDragging ? "text-white" : "text-on-background"
          }`}>
            {isProcessing ? "Analyzing Document Structure..." : isDragging ? "Ready for Deep-Scrub" : "Vault Document Import"}
          </h3>
          <p className={`text-xs font-light max-w-xs mx-auto leading-relaxed transition-colors duration-700 ${
            isDragging ? "text-white/70" : "text-on-background/40"
          }`}>
            Removing hidden properties, revision history, and user identifiers.
          </p>
        </div>

        <div className="flex gap-2">
          {["PDF", "DOCX", "XLSX"].map((ext) => (
            <span key={ext} className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest transition-colors duration-700 ${
              isDragging ? "bg-white/20 text-white" : "bg-white/60 text-on-background/60 shadow-sm"
            }`}>
              {ext}
            </span>
          ))}
        </div>
      </div>
      
      {/* Whisper Border Glow */}
      {!isDragging && (
        <div className="absolute inset-0 rounded-[3rem] border border-white/40 pointer-events-none" />
      )}
    </div>
  );
}
