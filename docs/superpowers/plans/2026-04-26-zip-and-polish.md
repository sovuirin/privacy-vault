# Plan: Meridian Sanctuary — ZIP Batch Export & Aesthetic Polish

Implement the capability to export all neutralized files as a single ZIP archive and perform a high-fidelity aesthetic refactor of the batch gallery to meet the "Solar Atelier" premium standards.

## User Review Required

> [!IMPORTANT]
> This plan involves adding a new dependency (`jszip`).
> We will also be refactoring several UI components to strictly enforce the "No-Line" design rule, which may change the visual structure (removing explicit borders in favor of tonal layering).

## Open Questions
- Do we want to include the original filenames or prefixed "cleaned_" filenames in the ZIP?
- Should the ZIP download triggered automatically after "Neutralize All", or stay as a manual user action?

## Proposed Changes

### [Core] [ZIP Export Utility]

#### [NEW] [zip.ts](file:///home/soverwatch/privacy-vault/src/lib/zip.ts)
- Implement `generateBatchZip(files: BatchFile[]): Promise<Blob>` using `jszip`.
- Handle blob creation and filename mapping.

### [Logic] [Batch State Extension]

#### [MODIFY] [useImageScrubber.ts](file:///home/soverwatch/privacy-vault/src/hooks/useImageScrubber.ts)
- Add `isZipping` state to track generation progress.
- Implement `downloadBatchAsZip` function.

### [UI] [The Solar Atelier Refinement]

#### [MODIFY] [BatchFileList.tsx](file:///home/soverwatch/privacy-vault/src/components/BatchFileList.tsx)
- **Visuals**: Refactor grid to use "Solar Atelier" bento-grid logic.
- **Polish**: Add premium micro-animations (staggered entry, hover scale-up).
- **Feature**: Add "Download All as ZIP" button in the header.
- **Rule**: Apply "No-Line" rule (remove group borders, use `bg-surface-low` for depth).

#### [MODIFY] [ForensicMatrix.tsx](file:///home/soverwatch/privacy-vault/src/components/ForensicMatrix.tsx)
- **Refinement**: Ensure full adherence to the "No-Line" rule and "Geist Sans" typography.
- **Logic**: Optimize for "Aggregate" vs "Detail" transitions.

#### [MODIFY] [RiskScoreHero.tsx](file:///home/soverwatch/privacy-vault/src/components/RiskScoreHero.tsx)
- **Polish**: Add a subtle "aura" or glow effect to the score circle when in "High Risk" state.

## Verification Plan

### Automated Tests
- `npm run lint`
- `npm run build`
- **Smoke Test**: `npx playwright test tests/smoke.spec.ts` (Verify that the "Download ZIP" button appears and triggers a download).

### Manual Verification
- Upload 3+ images.
- Neutralize all.
- Click "Download All as ZIP".
- Verify that the resulting ZIP contains all 3 cleaned images.
- Observe the transitions between batch view and detail view for smoothness.
