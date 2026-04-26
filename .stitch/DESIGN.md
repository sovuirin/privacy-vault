# Design System: Privacy Vault

## 1. Visual Theme & Atmosphere
**The Glass Monolith (Elite Minimalism)** — A restrained, gallery-airy interface that feels like a high-end luxury service. It prioritizes clarity, trust, and premium user experience over raw technical density. The atmosphere is calm, secure, and ethereal—like a private digital sanctuary.

- **Density:** 3 (Art Gallery Airy - generous whitespace)
- **Variance:** 4 (Balanced but with intentional offsets)
- **Motion:** 7 (Fluid, "springy" transitions; staggered orchestration)

## 2. Color Palette & Roles
- **Ivory Canvas** (#FDFDFD) — Primary background surface
- **Frosted Surface** (rgba(255, 255, 255, 0.4)) — Glassmorphic containers with 20px blur
- **Obsidian Ink** (#18181B) — Primary text (Zinc-900 depth)
- **Ghost Gray** (#A1A1AA) — Secondary labels and muted metadata
- **Active Emerald** (#10B981) — Refined accent for "Secure" and "Cleaned"
- **Risk Rose** (#EF4444) — Sophisticated danger accent for "Detected Risks"

## 3. Typography Rules
- **Display/Headlines**: **Cormorant Garamond** — Elegant, high-contrast Serif. Used for status reports and section headers to signal "Heritage & Trust."
- **Interface/Body**: **Geist Sans** — Clean, modern Sans-Serif. Primary font for all functional UI and navigation.
- **Forensic/Data**: **Geist Mono** — Strictly reserved for raw data strings, hex offsets, and tag IDs.
- **Hierarchy**: Established through large margins and weight. Headlines use `tracking-tight`.

## 4. The Hero: "The Inspection Point"
The Hero section is balanced and airy.
- **Centered Focus**: Large headline in Cormorant Garamond (Italic/Regular mix).
- **Floating Dropzone**: A single, minimalist upload zone with a soft "whisper shadow" and 12px rounding.
- **Visual Punctuation**: Subtle, rounded status badges (e.g., `(Secure)`) that appear with a slight "float" animation.

## 5. Component Stylings
- **Buttons**: 8px - 12px rounding (soft). No hard borders; use shadow-based depth definitions. Primary action: Obsidian Ink background with Ivory text. Secondary: Ghost Gray text with subtle glass background.
- **The Forensic Matrix**: Hidden by default. Revealed via a "Detailed Audit" toggle. Uses a clean, borderless list style instead of a dense table.
- **No-Line Rule**: Eliminate 1px borders. Use `shadow-[0_0_0_1px_rgba(0,0,0,0.05)]` for subtle definition.

## 6. Layout Principles
- **Centered Sanctuary**: Main content is contained within a 1000px max-width centered column.
- **Floating Controls**: Tool navigation uses a glassmorphic pill-shaped bar.
- **Depth Tonal Layering**: Use layered transparencies and `backdrop-filter` to create a sense of physical stacks.

## 7. Motion & Interaction
- **Staggered Orchestration**: Metadata signals "fade-in" one by one with a slight upward slide.
- **Spring Physics**: Use `stiffness: 100, damping: 20` for all interactive elements.
- **The Pulse**: A very subtle, slow "breath" animation on the primary action button.

## 8. Anti-Patterns (Banned)
- No hard black borders (#000000).
- No pure monospaced layouts (except for raw data).
- No dense tables in the primary view.
- No "Industrial" square corners (>8px rounding required).
- No emojis or generic AI-slop icons.
