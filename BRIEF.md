# BRIEF.md — Privacy Vault

**Status:** Extracted from codebase + validation research

---

## Problem Statement

Files shared with AI tools, social platforms, and work systems contain hidden metadata (GPS coordinates, camera serial numbers, timestamps, device info) that exposes personal information. Users need a simple, trustworthy way to clean files before sharing — without uploading to unknown servers.

## Target Audience

- Privacy-conscious individuals sharing photos online
- Journalists and activists protecting sources
- Professionals preparing files for AI assistants (ChatGPT, Claude, etc.)
- Anyone who shares screenshots or documents with sensitive details

## Differentiator

- **100% client-side** — files never leave the browser
- **No signup required** — friction-free
- **Simple UX** — single-page, tool-focused interface
- **Privacy-first** — no analytics, no tracking, offline-capable

## Competitive Landscape

| Competitor | Threat | Our Response |
|-----------|--------|--------------|
| MetaClean | Strong — WASM-based, verified removal | Add metadata inspection UI (priority 1) |
| ExifVoid | Medium — open source, ZIP download | Add ZIP batch download (priority 2) |
| PrivacyStrip | Medium — multi-format | Improve document support |
| MetaScrub | Low — video focus | Monitor, not core |

## Risks Acknowledged

- Canvas redraw ≠ true metadata removal — verification gaps
- No lossless JPEG stripping — quality loss on re-encode
- Limited document support vs. competitors
- Side project velocity — prioritize highest-impact wins only

## MVP Hypothesis

Adding metadata inspection UI (show what was removed) and ZIP batch download will close the two biggest gaps vs. competitors, differentiating on "trust through transparency" while keeping the simple, client-side-only UX.

---

## Extracted Sources

- README.md — Product description, feature status
- docs/research.md — Competitive analysis, validation signals
- src/app/page.tsx — Feature flow, UI structure