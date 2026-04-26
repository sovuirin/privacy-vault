# Task 5: Integration & Final Audit (src/app/page.tsx)

## Goal
Update `src/app/page.tsx` to support the two-phase metadata audit and neutralization flow.

## Instructions
1. Import `MetadataAudit` from `@/components/MetadataAudit`.
2. In the `Home` component, update the `useImageScrubber` destructuring to include `neutralizeImage`.
3. In `renderToolContent` (under `case "images"`):
   - Locate the section where `processedImages.length > 0` is handled.
   - Refactor the UI to show a list of `MetadataAudit` components for each image in `processedImages`.
   - Ensure `MetadataAudit` is passed the `image` and `onNeutralize` (which should call `neutralizeImage`).
   - Place the audit reports above `ImageDownload` and `ImagePreview`.
   - Update the "ready" status summary to reflect that analysis is complete and neutralization is the next step.
4. Clean up any redundant messages (e.g., the old "Metadata has been removed" message if the image isn't neutralized yet).
5. Verify that the flow works as expected.

## UI/UX Considerations
- If multiple images are uploaded, the audit reports should be stacked or organized cleanly.
- Maintain the "Frontier Dark" aesthetic.

## Files for Reference
- `src/app/page.tsx` (Target file)
- `src/hooks/useImageScrubber.ts` (Hook provides `neutralizeImage`)
- `src/components/MetadataAudit.tsx` (Component to integrate)

## Verification
- Verify that uploading an image shows the `MetadataAudit` component.
- Verify that clicking "NEUTRALIZE METADATA" triggers the scrubbing and updates the UI to "SIGNAL NEUTRALIZED".
- Verify that `ImageDownload` and `ImagePreview` only show/work for neutralized images (or as appropriate).
- Run `npm run lint` and `tsc` check.
