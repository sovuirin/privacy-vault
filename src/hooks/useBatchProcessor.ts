"use client";

import { useState, useCallback } from "react";
import {
  cleanDocumentMetadata,
  DocumentCleanupOutcome,
  DocumentMetadata,
  downloadCleanedDocument,
} from "@/lib/documents";

export type ProcessingQuality = "high" | "medium" | "low";
export type ExportFormat = "png" | "jpeg" | "webp";

export interface QualitySettings {
  quality: ProcessingQuality;
  format: ExportFormat;
  maxWidth?: number;
  maxHeight?: number;
  jpegQuality?: number;
}

export interface BatchFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error?: string;
  result?: Blob | null;
  metadata?: DocumentMetadata;
  outcome?: DocumentCleanupOutcome;
  summary?: string;
}

export interface UseBatchProcessorReturn {
  files: BatchFile[];
  processing: boolean;
  settings: QualitySettings;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearAll: () => void;
  updateSettings: (newSettings: Partial<QualitySettings>) => void;
  processBatch: () => Promise<void>;
  downloadAll: () => void;
  downloadFile: (id: string) => void;
}

const DEFAULT_SETTINGS: QualitySettings = {
  quality: "medium",
  format: "png",
  jpegQuality: 0.85,
};

export function useBatchProcessor(): UseBatchProcessorReturn {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [settings, setSettings] = useState<QualitySettings>(DEFAULT_SETTINGS);

  const addFiles = useCallback((newFiles: File[]) => {
    const now = Date.now();
    const batchFiles: BatchFile[] = newFiles.map((file, index) => ({
      id: `${file.name}-${now}-${index}`,
      file,
      status: "pending",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...batchFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<QualitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const processBatch = useCallback(async () => {
    setProcessing(true);

    try {
      for (const file of files) {
        if (file.status !== "pending") {
          continue;
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: "processing", progress: 35 } : f
          )
        );

        try {
          const result = await cleanDocumentMetadata(file.file);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status:
                      result.outcome === "unsupported" ? "failed" : "completed",
                    progress: 100,
                    result: result.blob,
                    metadata: result.metadata,
                    outcome: result.outcome,
                    summary: result.summary,
                    error:
                      result.outcome === "unsupported"
                        ? result.summary
                        : undefined,
                  }
                : f
            )
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "failed",
                    progress: 100,
                    error:
                      error instanceof Error
                        ? error.message
                        : "Processing failed",
                  }
                : f
            )
          );
        }
      }
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const downloadFile = useCallback((id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file?.result) {
      return;
    }

    downloadCleanedDocument(file.result, file.file.name);
  }, [files]);

  const downloadAll = useCallback(() => {
    files
      .filter((file) => file.status === "completed" && file.result)
      .forEach((file) => {
        if (file.result) {
          downloadCleanedDocument(file.result, file.file.name);
        }
      });
  }, [files]);

  return {
    files,
    processing,
    settings,
    addFiles,
    removeFile,
    clearAll,
    updateSettings,
    processBatch,
    downloadAll,
    downloadFile,
  };
}
