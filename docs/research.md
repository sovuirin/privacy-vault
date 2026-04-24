# Privacy Vault — Research & Validation Notes

**Date:** 2026-04-20
**Source:** Project intake session

---

## App State

| Feature | Status | Quality |
|---------|--------|---------|
| Image Cleaner | ✅ Production | Solid — canvas redraw removes metadata, supports batch, export formats |
| Screenshot Redactor | ✅ Beta | Usable — blur/blackout drawing, PNG/JPEG export |
| Document Cleaner | 🔶 Limited | PDF best-effort, Office metadata display only |

## Validation Signals

### Strong
- Clear problem: hidden metadata leaks privacy before sharing to AI tools, social platforms
- Client-side only — strong differentiator (all competitors emphasize this)
- Privacy-focused audience exists (journalists, activists, privacy enthusiasts)
- Simple, friction-free UX — no signup required

### Weak / Gaps
- No metadata verification — users can't see what was removed
- Canvas redraw causes quality loss (not true binary stripping)
- No ZIP batch download
- No selective removal (GPS-only, keep camera settings)
- Limited document support (PDF best-effort, Office display-only)

---

## Competitive Landscape

| Competitor | Key Advantage | Our Gap |
|------------|--------------|---------|
| MetaClean (metaclean.app) | WebAssembly, parses 80+ EXIF tags, shows GPS map on interactive map | No verification, no GPS map display |
| ExifVoid (exifvoid.com) | Batch up to 10, ZIP download, open source | No batch ZIP, not open source |
| PrivacyStrip (privacystrip.com) | Multi-format (PDF, DOCX, video), serverless | Limited document support |
| MetaScrub (metascrub.io) | Video metadata, simple UI | No video support |

---

## Recommended Priorities

| Priority | Feature | Competitive Rationale |
|----------|---------|----------------------|
| 1 | Metadata inspection UI — Show what was removed (GPS location, camera make/model, timestamps) | Matches MetaClean's key differentiator. Users trust the tool when they can see before/after |
| 2 | ZIP batch download | Simple win, matches ExifVoid |
| 3 | Lossless JPEG binary stripping | Match competitors (requires WASM potentially) |
| 4 | Selective removal (GPS-only mode) | Gap in current competitors |
| 5 | Video metadata tool | Match MetaScrub |

---

## Security Notes

### On WASM (WebAssembly)
- **What it is:** Binary format that runs in browsers at near-native speed. Compiled code (like ExifTool C++) runs sandboxed.
- **Security profile:** Sandboxed, no network access, memory-safe
- **When needed:** Priority 3 (lossless stripping) — optional, not required for priorities 1-2
- **Risk:** Comparable to existing client-side JS code

### Approach Risk Comparison

| Approach | Risk Level | Notes |
|----------|------------|-------|
| Canvas redraw (current) | Lowest | Introduces quality loss |
| JavaScript EXIF parsing | Low | Same origin as current JS |
| ExifTool WASM | Low | Sandboxed, no network |

**Priorities 1-2 add zero new security surface.** If we later add WASM for priority 3, it actually *improves* privacy (true removal) with comparable security.

---

## WASM Clarification Summary

- **Not required for priorities 1-2** — plain JavaScript handles metadata inspection fine
- **Optional for priority 3** — improves quality but not essential initially
- **No new security risk** — comparable sandbox model to existing client-side code
- **Privacy benefit** — true binary stripping vs. current canvas redraw