# Design System: Privacy Vault

## 1. Visual Theme & Atmosphere
**Industrial Privacy (High-Rigidity)** — A tactical, high-precision interface that feels like a physical hardware manual translated into a digital clean room. It prioritizes data integrity over decorative comfort. The atmosphere is clinical, secure, and authoritative.

- **Density:** 7 (Data-dense, utility-first)
- **Variance:** 6 (Asymmetric, grid-bound layouts)
- **Motion:** 3 (Mechanical, "clicky" state changes; no soft springs)

## 2. Color Palette & Roles
- **Sterile Canvas** (#FAFAFA) — Primary background
- **Vault Surface** (#FFFFFF) — Interactive containers
- **Terminal Black** (#09090B) — Primary text (Zinc-950)
- **Metadata Gray** (#52525B) — Secondary labels and logs
- **Structural Line** (#E4E4E7) — 1px borders (Zinc-200)
- **Active Emerald** (#10B981) — Functional accent for "Cleaned" and "Safe"
- **Risk Rose** (#F43F5E) — Danger accent for "Detected Risks"

## 3. Typography Rules
- **Display & Body:** Geist Mono — 100% Monospace usage. 
- **Hierarchy:** Established through tracking (`tracking-tighter` for headers, `tracking-wider` for labels) and weight (700 for actions, 400 for data).
- **Anti-Pattern:** Never use Sans-Serif or Serif fonts. The entire UI must feel like a generated report.

## 4. The Hero: "The Inspection Point"
The Hero section is asymmetric.
- **Left Align:** Large headline in Geist Mono (Bold, tracking-tighter).
- **Inline Tagging:** Embed small, high-contrast metadata tags (e.g., `[GPS:LOCKED]`, `[EXIF:EXPOSED]`) directly within the headline text as visual punctuation. These tags should have a solid Terminal Black background with Active Emerald or Risk Rose text.
- **No Filler:** No "Welcome" text. The UI starts immediately with the "Drop Zone".

## 5. Component Stylings
- **Buttons:** 0px rounding (square). 1px solid Terminal Black border. Invert colors on hover (Black bg, White text). -2px "click" transform.
- **Cards/Containers:** Square corners. No shadows. Separation via 1px Structural Lines.
- **Status Badges:** `[ SQUARE BRACKETS ]` instead of pills. Monospace text only.
- **Inputs:** Underline style (bottom border only) for a blueprint/form feel. Focus state: 2px Active Emerald bottom border.

## 6. Layout Principles
- **The Split View:** Fixed-width left sidebar for controls; expansive right-side "Lightbox" for image inspection and scrubbing logs.
- **The Grid:** All elements must align to a strict 8px terminal grid. 
- **Responsive:** Collapse to a single-column "Report" view on mobile.

## 7. Motion & Interaction
- **Scanline Shimmer:** A horizontal 1px line that moves vertically across images during the "Scrubbing" phase.
- **Instant Snap:** Tab switching and modal opens should feel "instant" or use a 100ms sharp fade. No elastic bouncing.

## 8. Anti-Patterns (Banned)
- No rounded corners (> 2px).
- No Inter, Roboto, or system sans-serifs.
- No shadows or depth (Flat UI only).
- No emojis or generic Lucide icons (use custom-styled SVGs or character-based icons).
- No "Success!" or "Error!" headers — use `[STATUS:CLEANED]` or `[ERROR:FILE_CORRUPT]`.
