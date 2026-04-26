"use client";

import { useState, useCallback } from "react";
import {
  scrubImageMetadata,
  isValidImageFormat,
  ImageMetadata,
  detectMetadata,
  ForensicReport,
} from "@/lib/metadata";

export interface ScrubbedImageResult {
  id: string;
  originalFile: File;
  cleanedCanvas: HTMLCanvasElement | null;
  metadata: ImageMetadata | null;
  audit: ForensicReport | null;
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
          const id = crypto.randomUUID();
          
          setProcessedImages((prev) => [
            ...prev,
            {
              id,
              originalFile: file,
              cleanedCanvas: null,
              metadata: null,
              audit: null,
              isNeutralized: false,
              status: "analyzing",
            },
          ]);

          try {
            const audit = await detectMetadata(file);
            setProcessedImages((prev) =>
              prev.map((img) =>
                img.id === id ? { ...img, audit, status: "detected" } : img
              )
            );
            return id;
          } catch (err) {
            setProcessedImages((prev) =>
              prev.map((img) =>
                img.id === id ? { ...img, status: "error" } : img
              )
            );
            throw err;
          }
        })
      );

      settledResults.forEach((result, index) => {
        if (result.status === "rejected") {
          const file = validFiles[index];
          const reason =
            result.reason instanceof Error
              ? result.reason.message
              : "failed to analyze image";
          fileErrors.push(`${file.name}: ${reason}`);
        }
      });

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

  const neutralizeImage = useCallback(
    async (id: string) => {
      setError(null);
      setIsProcessing(true);

      setProcessedImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, status: "neutralizing" } : img
        )
      );

      try {
        const image = processedImages.find((img) => img.id === id);
        if (!image) {
          throw new Error("Image not found");
        }

        const { canvas, metadata } = await scrubImageMetadata(
          image.originalFile
        );

        setProcessedImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  cleanedCanvas: canvas,
                  metadata,
                  isNeutralized: true,
                  status: "neutralized",
                }
              : img
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to neutralize image";
        setError(errorMessage);
        setProcessedImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, status: "error" } : img
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [processedImages]
  );

  const reset = useCallback(() => {
    setProcessedImages([]);
    setError(null);
  }, []);

  return {
    processedImages,
    isProcessing,
    error,
    handleImageUpload,
    neutralizeImage,
    reset,
  };
}
