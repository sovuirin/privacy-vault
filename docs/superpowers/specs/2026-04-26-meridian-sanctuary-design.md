# DESIGN SPEC: Meridian Sanctuary Refactor & Batch Mode

**Status**: Draft (Awaiting User Review)
**Date**: 2026-04-26
**Topic**: Refactoring the Privacy Vault to the "Meridian Sanctuary" design system and implementing parallel batch processing.

---

## 1. Aesthetic Manifesto: The Solar Atelier
The interface must feel like a premium, architectural workspace. We prioritize **breathable clarity** and **unobstructed agency**.

- **Density**: 3 (Extreme white space).
- **Core Rule**: **The No-Line Rule**. Prohibit 1px borders. Use tonal background shifts and soft shadows for depth.
- **Typography**: 
  - **Space Grotesk**: Headlines, labels (tight tracking).
  - **Geist Sans**: Primary UI and functional text.
  - **JetBrains Mono**: Strictly for raw data (hex offsets, tag IDs).

---

## 2. Component Architecture: The Geometric Blueprint

### 2.1 The Forensic Matrix (Bento Grid)
The core data display uses a **Geometric Bento Grid**.
- **Aspect Ratios**: 1x1 (Status/Chips) and 2x1 (Detailed Data).
- **Internal Alignment**: 
  - Labels: Top-left (Space Grotesk, 10px, uppercase, tight tracking).
  - Values: Bottom-right (Geist Sans, Large/Bold).
  - Status Dots: Top-right (Sunrise Gold for clean, Risk Rose for threat).
- **Surface**: `Sovereign Surface (#FFFFFF)` against `Natural Parchment (#FBF9F1)`.

### 2.2 The Risk Score Hero
- A large, asymmetrical circular gauge.
- **Motion**: Spring-physics animation when the score changes.
- **Atmosphere**: Anchored 1/3rd into the grid for editorial balance.

---

## 3. Interaction Flow: Parallel Batch Mode

### Phase 1: Aggregate Overview
When multiple files are uploaded, the system enters **Aggregate Mode**.
- **Hero**: Displays the "Batch Risk Index" (Overall highest threat level).
- **Matrix**: Cards show collective data (e.g., "Total High-Risk Tags", "Geographic Presence").
- **Primary Action**: "NEUTRALIZE_ALL_THREATS" (Sovereign Purple gradient pill).

### Phase 2: The Vault Gallery
A minimalist row of thumbnails appears below the hero.
- **Status**: Each thumbnail has a status dot indicating its current state.
- **Interaction**: Clicking a thumbnail initiates the drill-down transition.

### Phase 3: Individual Detail (The Drill-down)
- The Bento Grid updates to show specific file metadata.
- **Back Navigation**: A **Floating Ghost Button** ("Back to Overview") appears contextually to return to the Aggregate view.

---

## 4. Technical Requirements
- **Processing**: 100% Client-side.
- **Neutralization**: Redraw image to clean canvas to strip all binary metadata headers.
- **State Management**: Manage `isBatchMode`, `selectedFileId`, and `neutralizationProgress` across the batch.

---

## 5. Motion & Polish
- **Staggered Orchestration**: Grid cards slide up with cascade delays.
- **Hover States**: Cards "lift" (negative Y translate) with an expanded soft shadow.
- **Spring Config**: `stiffness: 100, damping: 20` for a weighty, premium feel.
