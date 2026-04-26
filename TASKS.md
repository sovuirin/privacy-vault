# TASKS.md — Privacy Vault

**Status:** Ready for Construction (Phase 4 Audit Verified)

---

## Epic: Forensic Metadata Audit UI

**Goal:** Provide a high-density, tactical inspection view of image metadata to build user trust.

### Tasks

- [x] **T1. Core State Refinement**
  - *Acceptance:* `src/types/vault.ts` includes `AuditMatrix`, `ViolationFlag`, and `MetadataSignal` types.
- [x] **T2. Forensic Detection Engine**
  - *Acceptance:* `detectMetadata` returns granular TAG_ID and HEX_OFFSET data using `exifreader`.
- [x] **T3. Meridian Sanctuary UI (Refactored T3/T4/T5)**
  - *Acceptance:* Premium Bento-Grid Audit Matrix. Horizon navigation (Top bar). "No-Line" design rule.
  - *Status:* COMPLETED (Replaced legacy industrial table).
- [x] **T4. Optional Data Density**
  - *Acceptance:* Toggle between "Executive View" and "Clinical Density" in Forensic Matrix.
- [x] **T5. Risk Index Visualization**
  - *Acceptance:* Premium circular gauge (RiskScoreHero) with Sovereign Purple styling.

---

## Epic: Meridian Sanctuary Logic (Batch & Parallel)

**Goal:** Implement high-performance parallel batch processing and master-detail navigation.

### Tasks

- [x] **T6. Forensic Data Model Extension**
  - *Acceptance:* `BatchFile` and `AggregatedReport` support in `lib/metadata.ts`.
- [x] **T7. Batch State Management Hook**
  - *Acceptance:* `useImageScrubber` supports multi-file state and memoized aggregate stats.
- [x] **T8. Parallel Processing Loops**
  - *Acceptance:* `analyzeBatch` and `neutralizeBatch` functions implemented.
- [x] **T9. Master-Detail UI Logic**
  - *Acceptance:* Support for 'aggregate' vs 'detail' modes in `ForensicMatrix`.

---

## Epic: ZIP Batch Download

**Goal:** Allow users to download all cleaned images as single ZIP file

### Tasks

- [ ] **T6.** Add JSZip library and generation function
- [ ] **T7.** Add 'Download All as ZIP' button to ImageDownload component.

---

## Epic: Research & Documentation

### Completed Tasks

- [x] **T10.** Create docs/research.md
- [x] **T11.** Create BRIEF.md
- [x] **T12.** Create SPEC.md
- [x] **T13.** Phase 4 Audit & Reconciliation (docs/superpowers/audit/reconciliation_report.md)

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