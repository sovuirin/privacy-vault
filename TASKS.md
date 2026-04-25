# TASKS.md — Privacy Vault

**Status:** Ready for Construction (Phase 4 Audit Verified)

---

## Epic: Forensic Metadata Audit UI

**Goal:** Provide a high-density, tactical inspection view of image metadata to build user trust.

### Tasks

- [x] **T1. Core State Refinement**
  - *Acceptance:* `src/types/vault.ts` includes `AuditMatrix`, `ViolationFlag`, and `MetadataSignal` types. Zustand store supports log streaming.
- [x] **T2. Forensic Detection Engine**
  - *Acceptance:* `detectMetadata` returns granular TAG_ID and HEX_OFFSET data using `exifreader`.
- [x] **T3. High-Density Audit Matrix Component**
  - *Acceptance:* Industrial UI table showing granular forensic signals. 1px borders, Geist Mono, no rounding.
- [x] **T4. Risk Index & Violation Flags**
  - *Acceptance:* Visual RISK_INDEX (0-100) and specific forensic violation tags (e.g., [FLAG_GPS_PRECISION]).
- [x] **T5. Terminal Processing Log**
  - *Acceptance:* Scrolling log showing real-time neutralization steps. (Integrated as clinical status status view in MetadataAudit)

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