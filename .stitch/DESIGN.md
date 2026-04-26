# Design System: Privacy Vault (The Meridian Sanctuary)

## 1. Visual Theme & Atmosphere
**The Meridian Sanctuary (Solar Atelier)** — A premium, editorial interface that feels like a high-end architectural workspace bathed in warm, diffused natural light. It prioritizes breathable clarity and agency over technical noise. The atmosphere is intellectual, secure, and unapologetically high-end.

- **Density:** 3 (Art Gallery Airy - extreme focus on white space)
- **Variance:** 6 (Intentional Asymmetry - editorial layouts)
- **Motion:** 7 (Fluid, "springy" transitions; staggered cascade reveals)

## 2. Color Palette & Roles
- **Natural Parchment** (#FBF9F1) — Primary background surface (Canvas)
- **Sovereign Surface** (#FFFFFF) — Card and container fill for "bright" lift
- **Parchment Accent** (#F5F4EC) — Tonal background shift for depth (replaces borders)
- **Obsidian Ink** (#1B1C17) — Primary text (Deep charcoal with purple undertone)
- **Muted Steel** (#71717A) — Secondary labels and muted metadata
- **Sovereign Purple** (#5D39E0) — Primary accent for high-intent actions (CTAs)
- **Sunrise Gold** (#705D00) — Single-pixel luxury accent for success/status dots
- **Risk Rose** (#EF4444) — Sophisticated danger accent for "Detected Risks"

## 3. Typography Rules
- **Display/Headlines**: **Space Grotesk** — Geometric, authoritative. Apply -2% letter spacing for high-end "Swiss" feel.
- **Interface/Body**: **Geist Sans** — Clean, modern Sans-Serif. Primary font for all functional UI and navigation.
- **Forensic/Data**: **JetBrains Mono** — The "Human Craft" signature. Used strictly for raw data, hex offsets, and labels.
- **Hierarchy**: Established through large margins and weight. Titles use `tracking-tight`.

## 4. Component Stylings: The Geometric Blueprint

### 4.1 The Forensic Matrix (Bento Grid)
- **Structure**: Uniform grid with 1x1 (square) and 2x1 (landscape) aspect ratios.
- **Internal Alignment**: 
    - **Labels**: Top-left (Space Grotesk, 10px, uppercase, `tracking-tight`).
    - **Values**: Bottom-right (Geist Sans, Large/Bold).
    - **Status Dots**: Top-right (Sunrise Gold for clean, Risk Rose for threat).
- **Style**: No borders. Cards use `Sovereign Surface (#FFFFFF)` with a soft, diffused shadow.

### 4.2 The Risk Score Hero
- Large, asymmetrical circular gauge anchored 1/3rd into the layout.
- Animated numerical score using Space Grotesk.

### 4.3 Navigation & Action
- **TopAppBar**: Glassmorphic (#FFFFFF/80 with 24px blur). No borders.
- **Buttons**: 8px rounding. Primary action uses a subtle linear gradient (135°) from Sovereign Purple (#5D39E0) to its variant (#7657FA).
- **Floating Ghost Button**: Transparent background with `Sovereign Purple` text and hover elevation. Used for "Back to Overview" transitions.

## 5. Layout Principles: The Horizon Philosophy
- **The "No-Line" Rule**: Prohibit 1px solid borders. Boundaries must be defined strictly through tonal background shifts (e.g., `Parchment Accent` against `Natural Parchment`) or negative space.
- **The "No-Sidebar" Rule**: Sidebars are forbidden. All navigation is handled via the TopAppBar or contextual overlays.
- **Asymmetry**: Offset headlines and grid placements to maintain an editorial, non-templated feel.

## 6. Interaction: Parallel Batch Mode
- **Aggregate State**: The Hero shows the "Batch Risk Index". Matrix cards show collective insights (Sum of threats, device counts).
- **Vault Gallery**: A minimalist row of small thumbnails below the hero. Clicking a thumbnail initiates the drill-down transition.
- **Detail State**: The UI focuses on a single file. The Floating Ghost Button allows returning to the Aggregate view.

## 7. Motion & Interaction
- **Staggered Orchestration**: Elements mount via cascade delays (waterfall reveals).
- **Spring Physics**: `stiffness: 100, damping: 20` for a weighty, premium feel.
- **Perpetual Micro-Interactions**: Slow "breath" loop on active buttons and primary status indicators.

## 8. Anti-Patterns (Banned)
- No emojis anywhere.
- No `Inter` or generic system fonts.
- No 1px solid borders or dividers.
- No pure black (#000000).
- No generic "3 equal cards" feature rows.
- No AI copywriting clichés ("Elevate", "Seamless", "Next-Gen").
- No `LABEL // YEAR` formatting.
