# Refactor useImageScrubber for Two-Phase Flow

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `useImageScrubber` to support a state machine flow (None -> Detected -> Neutralized).

**Architecture:** Split image processing into "Analyze" (metadata detection) and "Neutralize" (metadata removal) phases.

**Tech Stack:** React, TypeScript, ExifReader (via @/lib/metadata)

---

### Task 1: Update Interfaces and Imports

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Update imports and interfaces**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useImageScrubber.ts
git commit -m "chore(hooks): update interfaces for two-phase flow"
```

### Task 2: Refactor handleImageUpload for Analyze phase

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Modify handleImageUpload to perform only Analyze phase**

```typescript
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
      const successfulResults: ScrubbedImageResult[] = [];

      // We'll process each file one by one to handle status updates properly if needed,
      // or use Promise.all and then update. Let's stick to parallel for efficiency.
      const settledResults = await Promise.allSettled(
        validFiles.map(async (file) => {
          const id = `${file.name}-${file.lastModified}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
          
          // Initial entry
          setProcessedImages(prev => [...prev, {
            id,
            originalFile: file,
            cleanedCanvas: null,
            metadata: null,
            audit: null,
            isNeutralized: false,
            status: 'analyzing'
          }]);

          try {
            const audit = await detectMetadata(file);
            
            setProcessedImages(prev => prev.map(img => 
              img.id === id ? { ...img, audit, status: 'detected' } : img
            ));
            
            return id;
          } catch (err) {
             setProcessedImages(prev => prev.map(img => 
              img.id === id ? { ...img, status: 'error' } : img
            ));
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
```

Wait, updating state inside `map` might be problematic with many files. I should probably collect results and update once if possible, but the requirement is to set status to 'analyzing' then 'detected'.

Actually, if I update state inside `map`, it might cause many re-renders.

Better approach:
1. Create all 'analyzing' entries.
2. Process them.
3. Update to 'detected'.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(hooks): refactor handleImageUpload for Analyze phase"
```

### Task 3: Implement neutralizeImage function

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Add neutralizeImage function**

```typescript
  const neutralizeImage = useCallback(async (id: string) => {
    setProcessedImages(prev => prev.map(img => 
      img.id === id ? { ...img, status: 'neutralizing' } : img
    ));
    setIsProcessing(true);
    setError(null);

    try {
      const image = processedImages.find(img => img.id === id);
      if (!image) {
        throw new Error("Image not found");
      }

      const { canvas, metadata } = await scrubImageMetadata(image.originalFile);
      
      setProcessedImages(prev => prev.map(img => 
        img.id === id ? { 
          ...img, 
          cleanedCanvas: canvas, 
          metadata, 
          isNeutralized: true, 
          status: 'neutralized' 
        } : img
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to neutralize image";
      setError(errorMessage);
      setProcessedImages(prev => prev.map(img => 
        img.id === id ? { ...img, status: 'error' } : img
      ));
    } finally {
      setIsProcessing(false);
    }
  }, [processedImages]);
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(hooks): implement neutralizeImage phase"
```

### Task 4: Finalize hook and return

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Update return object and isProcessing logic**

Ensure `neutralizeImage` is returned and `isProcessing` is handled correctly.

- [ ] **Step 2: Verify with a simple test or type check**

Run `tsc` to ensure no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(hooks): final refactor for useImageScrubber"
```
