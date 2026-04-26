# Privacy Vault: Single-Screen HUD Experience
**Date**: 2026-04-26

## Goal
Transform the multi-page Privacy Vault application into a highly immersive, non-scrolling, single-screen experience, drawing inspiration from the "Sakura Sentry" 2026 Oracle project. The experience will be responsive, adapting its navigation paradigm depending on the device.

## Architecture & Base Layer
- **Layout Constraint**: The application is strictly constrained to `100dvh` with `overflow-hidden`. No scrolling of the body is permitted.
- **Background Layer**: A persistent "Solar Atelier" canvas (`#fbf9f1`) serves as the base. 
- **Atmospheric Texture**: The background features a slow, subtle "breathing" texture or gradient mesh, providing a living, secure atmosphere without distracting from the data.

## Navigation & Layout Mechanics
The application relies on a floating HUD layout.

### Desktop & Tablet (Viewport > 768px)
- **Top Navigation Pill**: A "Premium Pill" navigation bar floats at the top center of the screen.
- **Content Cards**: Clicking a tool (e.g., Terminal, Matrix, Vault) expands its interface as a centralized, glassmorphic card floating directly below the pill. The center of the screen is the focus, flanked by the breathing texture.

### Mobile (Viewport <= 768px)
- **Bottom Dock**: The navigation pill is anchored to the bottom edge of the screen for ergonomic thumb reach.
- **Slide-up Panels**: Tapping a tool slides a glassmorphic panel up from the bottom. The panel takes up roughly 80-85% of the screen height, ensuring the atmospheric background remains visible at the top, maintaining spatial context and immersion.

## Tool Transitions (Routing & State)
- **Zero Page Loads**: Traditional page routing is replaced by state-based or shallow-routed component transitions. 
- **Animations**: Switching between tools (e.g., Terminal to Forensic Matrix) cross-fades or smoothly slides the glassmorphic cards in and out.
- **Persistence**: The background layer is isolated and undisturbed during tool transitions to ensure zero layout shift (CLS) and a highly performant, native-app feel.
