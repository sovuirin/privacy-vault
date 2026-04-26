"use client";

import { useState, useCallback, useMemo } from "react";
import { 
  detectMetadata, 
  scrubImageMetadata, 
  buildCleanedImageBlob,
  isValidImageFormat,
  ForensicReport,
  BatchFile,
  AggregatedReport,
} from "@/lib/metadata";

// Removed ScrubbedImageResult in favor of lib/metadata BatchFile

export interface UseImageScrubberReturn {
  files: BatchFile[];
  selectedFileId: string | null;
  aggregatedReport: AggregatedReport | null;
  isProcessing: boolean;
  error: string | null;
  handleImageUpload: (files: File[]) => Promise<void>;
  neutralizeImage: (id: string) => Promise<void>;
  analyzeBatch: () => Promise<void>;
  neutralizeBatch: () => Promise<void>;
  selectFile: (id: string | null) => void;

  reset: () => void;
}

export function useImageScrubber(): UseImageScrubberReturn {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aggregatedReport = useMemo(() => {
    if (files.length === 0) return null;

    const reports = files.map(f => f.report).filter((r): r is ForensicReport => r !== null);
    
    const aggregated: AggregatedReport = {
      totalFiles: files.length,
      totalHighRiskSignals: reports.reduce((acc, r) => acc + r.signals.filter(s => s.isHighRisk).length, 0),
      highestRiskScore: reports.length > 0 ? Math.max(...reports.map(r => r.riskScore)) : 0,
      averageRiskScore: reports.length > 0 ? reports.reduce((acc, r) => acc + r.riskScore, 0) / reports.length : 0,
      uniqueDeviceModels: Array.from(new Set(reports.map(r => r.signals.find(s => s.id === 'Model')?.value).filter((v): v is string => !!v))),
      hasLocationData: reports.some(r => r.signals.some(s => s.category === 'location')),
    };
    return aggregated;
  }, [files]);

  const selectFile = useCallback((id: string | null) => setSelectedFileId(id), []);

  const analyzeBatch = useCallback(async () => {
    setIsProcessing(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    await Promise.allSettled(pendingFiles.map(async (entry) => {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'analyzing' } : f));
      try {
        const report = await detectMetadata(entry.file);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, report, status: 'detected' } : f));
      } catch (err) {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }));
    setIsProcessing(false);
  }, [files]);

  const neutralizeBatch = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    
    // Process all files that aren't already neutralized
    const targetFiles = files.filter(f => !f.isNeutralized && f.status !== 'error');

    if (targetFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    await Promise.allSettled(targetFiles.map(async (entry) => {
      try {
        // If file is pending, we must analyze it first to generate the report
        if (entry.status === 'pending' || entry.status === 'analyzing') {
          setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'analyzing' } : f));
          const report = await detectMetadata(entry.file);
          setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, report, status: 'detected' } : f));
        }

        // Now neutralize
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'neutralizing' } : f));
        const { canvas } = await scrubImageMetadata(entry.file);
        const blob = await buildCleanedImageBlob(canvas);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'neutralized', isNeutralized: true, neutralizedBlob: blob } : f));
      } catch (err) {
        console.error(`Failed to neutralize ${entry.file.name}:`, err);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
        setError(prev => prev ? `${prev}; Failed: ${entry.file.name}` : `Neutralization failed for: ${entry.file.name}`);
      }
    }));
    
    setIsProcessing(false);
  }, [files]);

  const handleImageUpload = useCallback(async (newFiles: File[]) => {
    if (!newFiles.length) return;

    setError(null);
    setIsProcessing(true);

    const maxSize = 10 * 1024 * 1024;
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    for (const file of newFiles) {
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

    const batchEntries: BatchFile[] = validFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      report: null,
      status: 'pending',
      isNeutralized: false,
    }));

    setFiles(prev => [...prev, ...batchEntries]);
    
    // Automatically trigger analysis for newly added files
    setIsProcessing(true);
    await Promise.allSettled(batchEntries.map(async (entry) => {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'analyzing' } : f));
      try {
        const report = await detectMetadata(entry.file);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, report, status: 'detected' } : f));
      } catch (err) {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'error' } : f));
      }
    }));
    
    setIsProcessing(false);

    if (fileErrors.length) {
      setError(`Some files were skipped: ${fileErrors.slice(0, 4).join("; ")}${fileErrors.length > 4 ? "..." : ""}`);
    }
  }, []);

  const neutralizeImage = useCallback(async (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'neutralizing' } : f));
    try {
      const entry = files.find(f => f.id === id);
      if (!entry) throw new Error("File not found");

      const { canvas } = await scrubImageMetadata(entry.file);
      const blob = await buildCleanedImageBlob(canvas);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'neutralized', isNeutralized: true, neutralizedBlob: blob } : f));
    } catch (err) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f));
    }
  }, [files]);

  const reset = useCallback(() => {
    setFiles([]);
    setSelectedFileId(null);
    setError(null);
  }, []);

  return {
    files,
    selectedFileId,
    aggregatedReport,
    isProcessing,
    error,
    handleImageUpload,
    neutralizeImage,
    analyzeBatch,
    neutralizeBatch,
    selectFile,
    reset,
  };
}


