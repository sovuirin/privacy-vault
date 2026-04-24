# Trace: Research & Design Phase (Metadata Audit)

**Date**: 2026-04-24
**Objective**: Define the "Trust through Transparency" evolution for Privacy Vault.

## Decisions Made
1. **Library**: Selected `exifreader` over `exif-reader` for its client-side robustness and zero dependencies.
2. **Aesthetic**: Shifted from generic "Privacy" to "Intelligence Agency / Frontier Dark" (clinical, precision-focused).
3. **UI Flow**: Changed from passive auto-scrub to active "Analysis -> Neutralization" flow to increase perceived value.
4. **Terminology**: Adopted "SIGNAL DETECTED" and "SIGNAL NEUTRALIZED" to reinforce the aesthetic.

## Assets Created
- `docs/superpowers/LESSONS.md`: Captured technical insights on canvas redraw vs active parsing.
- `.stitch/DESIGN.md`: Established the visual DNA.
- `docs/superpowers/specs/2026-04-24-metadata-audit-design.md`: Detailed the technical and visual specification.

## Next Steps
- Implement `detectMetadata` in `lib/metadata.ts`.
- Build `MetadataAudit.tsx` component.
- Update `useImageScrubber` to handle the two-phase flow.
