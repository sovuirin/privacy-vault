# SPEC: Metadata Audit & Neutralization

**Status**: Draft
**Date**: 2026-04-24
**Topic**: High-precision metadata detection and clinical neutralization UI.

---

## 1. Problem Statement
Users need "Trust through Transparency." The current passive metadata removal feels like a "black box." We need to show what is being removed to prove value and build trust.

## 2. Goals
- Actively parse original file metadata before scrubbing.
- Present findings in a "High Signal" Intelligence Agency aesthetic.
- Split the flow into "Detection" and "Neutralization" phases.
- Maintain 100% client-side processing.

## 3. Architecture
- **Library**: `exifreader` (client-side parsing).
- **Core Functionality**:
  - `detectMetadata(file: File)`: Returns a `MetadataAudit` object.
  - `scrubImageMetadata(file: File)`: Refactored to be an explicit action after detection.
- **State Management**: Update `useImageScrubber` to track `auditState` (None -> Detected -> Neutralized).

## 4. Component Design: `MetadataAudit.tsx`
- **Location**: `src/components/MetadataAudit.tsx`.
- **Primary View (Report Card)**:
  - Summarizes leaks into categories: **Location**, **Device**, **Origin**, **Sensitive**.
  - Shows "SIGNAL DETECTED" badges.
  - Action Button: **"Neutralize Metadata"**.
- **Secondary View (Detailed Audit)**:
  - Tactical toggle reveals raw values (GPS, Model, etc.) in monospaced font.
- **Result View**:
  - Global status: **"SIGNAL NEUTRALIZED: [TIMESTAMP]"**.
  - Success color: `var(--pv-gold)`.

## 5. UI/UX Flow
1. **Upload**: User adds image.
2. **Analysis**: UI shows "Analyzing..." then reveals the `MetadataAudit` Report Card.
3. **Action**: User reviews "SIGNAL DETECTED" and clicks **"Neutralize Metadata"**.
4. **Completion**: UI updates to "SIGNAL NEUTRALIZED". Download/Export options (via `QualitySettings` and `ImageDownload`) are enabled.

## 6. Aesthetic Guardrails
- **Precision**: 0.5px borders, clinical spacing.
- **Motion**: Subtle slide-up transitions for the toggle.
- **Vibe**: Intelligence Agency / High-end Cyber-Security.
