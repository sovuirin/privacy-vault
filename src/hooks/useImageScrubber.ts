"use client";

import { useState, useCallback } from "react";
import {
  scrubImageMetadata,
  isValidImageFormat,
  ImageMetadata,
  detectMetadata,
  MetadataAudit,
} from "@/lib/metadata";

export interface ScrubbedImageResult {
  id: string;
  originalFile: File;
  cleanedCanvas: HTMLCanvasElement | null;
  metadata: ImageMetadata | null;
  audit: MetadataAudit | null;
  isNeutralized: boolean;
  status: 'analyzing' | 'detected' | 'neutralizing' | 'neutralized' | 'error';
}

export interface UseImageScrubberReturn {
  processedImages: ScrubbedImageResult[];
  isProcessing: boolean;
  error: string | null;
  handleImageUpload: (files: File[]) => Promise<void>;
  neutralizeImage: (id: string) => Promise<void>;
  reset: () => void;
}

export function useImageScrubber(): UseImageScrubberReturn {
  const [processedImages, setProcessedImages] = useState<ScrubbedImageResult[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (files: File[]) => {
    if (!files.length) {
      return;
    }

    setError(null);
    setIsProcessing(true);

    const maxSize = 10 * 1024 * 1024;
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    for (const file of files) {
      if (!isValidImageFormat(file)) {
        fileErrors.push(`${file.name}: unsupported format`);
        continue;
      }

      if (file.size > maxSize) {
        fileErrors.push(`${file.name}: exceeds 10MB`);
        continue;
      }

      validFiles.push(file);
    }

    try {
      const settledResults = await Promise.allSettled(
        validFiles.map(async (file) => {
          const { canvas, metadata } = await scrubImageMetadata(file);
          return {
            id: `${file.name}-${file.lastModified}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
            originalFile: file,
            cleanedCanvas: canvas,
            metadata,
          };
        })
      );

      const successfulResults: ScrubbedImageResult[] = [];

      settledResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successfulResults.push(result.value);
          return;
        }

        const file = validFiles[index];
        const reason =
          result.reason instanceof Error
            ? result.reason.message
            : "failed to load image";
        fileErrors.push(`${file.name}: ${reason}`);
      });

      if (successfulResults.length) {
        setProcessedImages((prev) => [...prev, ...successfulResults]);
      }

      if (fileErrors.length) {
        setError(
          `Some files were skipped: ${fileErrors
            .slice(0, 4)
            .join("; ")}${fileErrors.length > 4 ? "..." : ""}`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process image(s)";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProcessedImages([]);
    setError(null);
  }, []);

  return {
    processedImages,
    isProcessing,
    error,
    handleImageUpload,
    reset,
  };
}
