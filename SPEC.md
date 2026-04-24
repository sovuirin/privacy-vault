# SPEC.md — Privacy Vault

**Status:** Inferred from codebase + validation research

---

## Architecture Overview

- **Framework:** Next.js 15 (App Router), TypeScript, React 18
- **Styling:** Tailwind CSS
- **Pattern:** Client-side only processing
- **Rendering:** Static export compatible

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 18 + TypeScript |
| Build | Next.js 15 |
| Styling | Tailwind CSS |
| State | Zustand |
| Bundling | Webpack |

## Data Model

### Current (In-Memory)

```typescript
interface ScrubbedImageResult {
  id: string;
  originalFile: File;
  cleanedCanvas: HTMLCanvasElement;
  metadata: ImageMetadata;
}

interface ImageMetadata {
  filename: string;
  size: number;
  dimensions: { width: number; height: number };
  hasMetadata: boolean;
  metadataTypes: string[];
}
```

### Extended (Priority 1)

```typescript
interface DetectedMetadata {
  gps: { latitude: number; longitude: number } | null;
  camera: { make: string; model: string; serialNumber: string } | null;
  timestamps: { created: string; modified: string } | null;
  device: { software: string; host: string } | null;
  removedFields: string[];
}

interface InspectionResult {
  file: File;
  detected: DetectedMetadata;
  privacyScore: number; // 0-100
}
```

## Screen Map

| Screen | Route | Status |
|--------|-------|--------|
| Home / Tool Selection | `/` | ✅ Implemented |
| Image Cleaner | `/` (tab) | ✅ Implemented |
| Document Cleaner | `/` (tab) | ✅ Implemented |
| Screenshot Redactor | `/` (tab) | ✅ Implemented |

### Future Screens (Priority 1)

| Screen | Route | Status |
|--------|-------|--------|
| Metadata Inspection Modal | `/` (inline modal) | 🔶 New |
| Inspection Results Panel | `/` (inline panel) | 🔶 New |

## Core Feature Flow

### Current Image Cleaner Flow

1. Upload images (via drag/drop or file picker)
2. Canvas redraw strips metadata implicitly
3. Display summary (metadata "removed")
4. Choose export format (PNG/JPEG/WebP) + quality
5. Download cleaned files

### Priority 1 — Metadata Inspection Flow

1. Upload images
2. **NEW:** Parse EXIF binary data via JS library
3. Display inspection results:
   - What was detected (GPS, camera, timestamps)
   - Privacy risk score
   - What will be removed
4. User confirms or adjusts
5. Process removal
6. Display verification (after state)

### Priority 2 — ZIP Batch Download Flow

1. Multiple images processed
2. "Download All" button → generate ZIP
3. Client-side ZIP creation (JSZip or similar)
4. Single download for all cleaned files

## Auth Flow

- **None** — No authentication required
- **No user accounts** — Privacy-first design

## Edge Cases

| Edge Case | Current Handling | Priority 1 Handling |
|-----------|------------------|---------------------|
| No EXIF data | Report "no metadata" | Show "clean" state |
| Corrupted EXIF | Skip silently | Show warning |
| Large files | Reject >10MB | Add chunked processing |
| Unsupported format | Show "unsupported" error | More specific error |
| GPS-only removal | N/A | Toggle UI per-field |

## MVP Boundary

- Image metadata inspection (JPEG primary)
- ZIP batch download (up to 20 files)
- Client-side only (no server)
- No new tech dependencies (prioritize simplicity)

---

## Extracted Sources

- `src/app/page.tsx` — Main UI flow, tool selection
- `src/hooks/useImageScrubber.ts` — Processing logic
- `src/lib/metadata.ts` — Export, format handling
- `CONVENTIONS.md` — Architecture patterns
- `docs/research.md` — Validation signals