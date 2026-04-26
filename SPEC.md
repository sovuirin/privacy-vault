# SPEC.md — Privacy Vault (Reconciled)

**Status**: Verified against Codebase + Meridian Sanctuary Design System
**Date**: 2026-04-26

---

## 1. Architecture Overview
- **Framework**: Next.js 15 (App Router), TypeScript, React 19 (Beta/Latest)
- **Styling**: Tailwind CSS (Meridian Sanctuary Tokens)
- **Privacy Pattern**: 100% Client-side processing. Zero server-side persistence or transmission of user files.
- **Processing**: Forensic binary parsing via `exifreader`.

## 2. Design System: The Meridian Sanctuary
- **Aesthetic**: Solar Atelier (Premium Editorial).
- **Core Rules**:
  - **No-Line Rule**: No 1px borders; tonal layering for depth.
  - **Typography**: Space Grotesk (Display) + Geist Sans (UI).
  - **Vibe**: High-end, breathable, authoritative sanctuary.

## 3. Core Feature Flow: Forensic Scrubber

### Phase 1: Forensic Analysis (Detection)
1. **Trigger**: User drops/selects an image.
2. **Action**: `detectMetadata(file)` parses binary EXIF, IPTC, and XMP data.
3. **UI State**: `analyzing` -> `detected`.
4. **Output**: `ForensicReport` generated with `riskScore`, `violationFlags`, and `Signal` matrix (tag ID, property, hex offset).

### Phase 2: Clinical Neutralization
1. **Trigger**: User clicks "NEUTRALIZE_THREAT".
2. **Action**: `scrubImageMetadata(file)` redraws the image to a clean canvas, stripping all binary headers.
3. **UI State**: `neutralizing` -> `neutralized`.
4. **Verification**: Confirm `[+] THREAT_NEUTRALIZED` status and enable export.

## 4. Technical Data Model

```typescript
interface Signal {
  id: string;
  tagId?: string;       // 0x0112 style
  label: string;
  value: string;
  hexOffset?: string;   // 0x00AA style
  category: 'location' | 'device' | 'origin' | 'sensitive';
  isHighRisk?: boolean;
}

interface ForensicReport {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;    // 0-100 weighted
  signals: Signal[];
  violationFlags: string[];
}

interface ScrubbedImageResult {
  id: string;
  originalFile: File;
  cleanedCanvas: HTMLCanvasElement | null;
  audit: ForensicReport | null;
  isNeutralized: boolean;
  status: 'analyzing' | 'detected' | 'neutralizing' | 'neutralized' | 'error';
}
```

## 5. Screen Map & Status
- **Inspection Terminal (`/`)**: ✅ Implemented (Harmonized with Meridian Sanctuary).
- **Vault Storage (`/vault`)**: 🔶 New (Priority 2).
- **Batch ZIP Export**: 🔶 New (Priority 1).
- **Network Traffic Monitor**: 🔶 New (Priority 3).

## 6. Implementation Checklist (Audit Refinements)
- [ ] Refactor `MetadataAudit.tsx` to follow the "No-Line" rule (remove borders, use `surface-container` tiers).
- [ ] Implement "ZIP Batch Download" flow.
- [ ] Implement "Granular Neutralization" (Per-field toggle).
- [ ] Migrate component structure to `components/forensic/` for better isolation.