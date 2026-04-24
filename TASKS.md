# TASKS.md — Privacy Vault

**Status:** Initial decomposition for priorities 1-2

---

## Epic: Metadata Inspection UI

**Goal:** Show users what metadata was detected and removed — build trust through transparency

### Tasks

- [ ] **T1.** Add EXIF parsing library (exif-js or similar)
  - *Acceptance:* Can read EXIF data from JPEG files client-side
  - *Prompt:* "Add exif-js or similar EXIF parsing library. Check package.json for conflicts, install if needed."

- [ ] **T2.** Create metadata detection function
  - *Acceptance:* Function that extracts GPS, camera, timestamps from uploaded file
  - *Prompt:* "Create a `detectMetadata(file: File)` function in src/lib that parses EXIF data and returns DetectedMetadata object with gps, camera, timestamps, device, removedFields fields. Handle cases where EXIF is missing or corrupted."

- [ ] **T3.** Add privacy score calculation
  - *Acceptance:* Returns 0-100 score based on detected metadata severity
  - *Prompt:* "Add `calculatePrivacyScore(detected: DetectedMetadata): number` function. GPS = high risk, camera serial = medium, timestamps = low. Return 0-100."

- [ ] **T4.** Build Inspection Results panel component
  - *Acceptance:* Shows detected fields, privacy score, what will be removed
  - *Prompt:* "Create InspectionPanel component in src/components that displays: detected metadata list (GPS, camera, timestamps with icons), privacy score (0-100 with color indicator), 'what will be removed' list. Use existing Tailwind tokens from CONVENTIONS.md."

- [ ] **T5.** Integrate inspection into Image Cleaner flow
  - *Acceptance:* Inspection panel shows after upload, before processing
  - *Prompt:* "Update Image Cleaner flow in page.tsx: after user selects images but before canvas processing, call detectMetadata and show InspectionPanel. Allow user to proceed or cancel."

- [ ] **T6.** Update process summary to show verification
  - *Acceptance:* After processing, show "verified removed" for each field
  - *Prompt:* "Update the processed images summary in page.tsx to show verification state — checkmarks next to each metadata type confirmed removed."

---

## Epic: ZIP Batch Download

**Goal:** Allow users to download all cleaned images as single ZIP file

### Tasks

- [ ] **T7.** Add JSZip library
  - *Acceptance:* Can create ZIP files client-side
  - *Prompt:* "Add jszip library for client-side ZIP creation. Install via npm."

- [ ] **T8.** Create ZIP generation function
  - *Acceptance:* Generates ZIP blob from array of cleaned images
  - *Prompt:* "Create `generateZipBlob(files: { filename: string, blob: Blob }[]): Promise<Blob>` function in src/lib/zip.ts."

- [ ] **T9.** Add 'Download All' button to ImageDownload
  - *Acceptance:* Button appears when 2+ images, downloads single ZIP
  - *Prompt:* "Update ImageDownload component: add 'Download All as ZIP' button that appears when there are 2+ processed images. Uses generateZipBlob function."

---

## Epic: Research & Documentation

### Completed Tasks

- [x] **T10.** Create docs/research.md
- [x] **T11.** Create BRIEF.md
- [x] **T12.** Create SPEC.md

---

## Notes

- **Dependencies:** Keep to minimum — exif-js, jszip only
- **Approach:** Prioritize client-side simplicity
- **Scope:** Image metadata first (JPEG), extend to PNG/WebP if time
- **Risk:** No new security surface for priorities 1-2

---

## Extracted Sources

- `docs/research.md` — Competitive analysis
- `SPEC.md` — Data model, screen map
- `src/lib/metadata.ts` — Current export handling