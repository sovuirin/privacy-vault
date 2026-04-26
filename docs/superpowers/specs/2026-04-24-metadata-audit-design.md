# SPEC: Forensic Metadata Audit (Meridian Update)

**Status**: Reconciled
**Date**: 2026-04-26
**Aesthetic**: Meridian Sanctuary (Solar Atelier)

---

## 1. Problem Statement
Users require "Trust through Forensic Transparency." The system must bridge the gap between "Black Box" scrubbing and professional-grade metadata intelligence, presenting risks with editorial clarity.

## 2. Aesthetic Strategy: "The Solar Atelier"
- **Typography**: **Space Grotesk** for status labels (`display-sm`) to signal authority. **Geist Sans** for the inspection report.
- **Hierarchy**: Use **Tonal Layering** (Level 0 to Level 2) instead of borders.
- **Micro-Interaction**: A scanline "shimmer" is only visible during the `analyzing` and `neutralizing` phases.

## 3. The Forensic Engine (`lib/metadata.ts`)
- **Signal Extraction**: Extracts binary-level data (Hex offsets, Tag IDs) using `exifreader`.
- **Risk Scoring**: 
  - Weight: `signals.length * 5` + `highRiskCount * 20`.
  - Level: High (>70), Medium (30-70), Low (<30).
- **Violation Flags**: Human-readable constants (e.g., `FLAG_GPS_PRECISION_ERR`) for quick triage.

## 4. UI Component: `MetadataAudit.tsx`
- **Primary View**: The **Forensic Matrix**.
  - No horizontal/vertical lines. Use `1.5rem` vertical spacing.
  - Hovering a signal shifts the background to `surface-container-high`.
- **The "Sovereign Gauge"**:
  - A large, animated numeric score (0-100) using Space Grotesk.
  - Color transitions from **Obsidian Ink** to **Risk Rose** based on score.
- **Neutralization Trigger**:
  - A pill-shaped button with a **Sovereign Purple** gradient.
  - On hover: `shadow-[0_0_40px_-10px_#5D39E0]`.
  - Transform: -1px on active.

## 5. State Machine: "Analyze → Neutralize"
1. **`analyzing`**: Skeleton loaders active.
2. **`detected`**: Reveal `ForensicReport`. Matrix is populated.
3. **`neutralizing`**: Progress circle overlay on the action button.
4. **`neutralized`**: UI locks. Show `[+] THREAT_NEUTRALIZED` banner in **Sunrise Gold**.

## 6. Anti-Patterns
- **No Borders**: All borders must be removed and replaced with background shifts.
- **No Tables**: Replace the `<table>` element with a `flex-col` list for a more editorial feel.
- **No generic monospacing**: Mono is strictly for hex/tag data.
