"use client";

import type { BatchFile } from "@/hooks/useBatchProcessor";
import { Download, Trash2, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BatchFileListProps {
  files: BatchFile[];
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

export function BatchFileList({
  files,
  onRemove,
  onDownload,
}: BatchFileListProps) {
  if (files.length === 0) {
    return (
      <div className="py-12 text-center bg-surface-low/30 rounded-3xl border border-dashed border-on-background/5">
        <p className="label-luxe opacity-40">No files in sanctuary yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="label-luxe opacity-100">Files in Vault ({files.length})</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 size={12} />
            {files.filter(f => f.status === 'completed').length} Verified
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-surface-lowest p-6 rounded-[2rem] shadow-sm border border-on-background/5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                    file.status === 'completed' ? 'bg-secondary/10 text-secondary' : 'bg-surface-low text-on-background/40'
                  }`}>
                    {file.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} className="animate-spin-slow" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold tracking-tight text-on-background truncate">
                      {file.file.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="label-luxe text-[8px] opacity-40">{(file.file.size / 1024).toFixed(1)} KB</span>
                      {file.metadata?.metadataTypes?.length ? (
                        <div className="flex gap-1">
                          {file.metadata.metadataTypes.map((type) => (
                            <span key={type} className="text-[7px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                              {type}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <button
                      onClick={() => onDownload(file.id)}
                      className="p-3 rounded-xl bg-surface-low text-on-background/40 hover:bg-primary hover:text-white transition-all"
                    >
                      <Download size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(file.id)}
                    className="p-3 rounded-xl bg-surface-low text-on-background/40 hover:bg-on-background hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar for active state */}
              {file.status === 'processing' && (
                <div className="mt-4 h-1 w-full bg-surface-low rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${file.progress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
