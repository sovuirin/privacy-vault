# CONVENTIONS.md — Pattern Master (v5.5)

This document defines the architectural patterns and UI standards for **privacy-vault**. 

## I. Architecture
- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS.
- **Data Layer**: Supabase (SSR), PostgreSQL.
- **Patterns**:
    - **Proxy Pattern**: Standardize on `src/proxy.ts` over `middleware.ts` for Next.js 16.2.4+ (Turbopack compatibility).
    - **Server-First**: Prefer Server Components and Server Actions.
    - **Type-Safe Actions**: Standardize on `ActionResult<T>` signatures.

## II. Design System (Zen Tier)
- **Aesthetic**: Solar Light / Deep Dark (Glassmorphism + depth-tonal layering).
- **No-Line Rule**: Eliminate 1px borders. Use shadow-based depth definitions (e.g., `shadow-[0_0_0_1px_rgba(255,255,255,0.05)]`) for a more layered, premium aesthetic.
- **Glassmorphism**: `bg-white/40 backdrop-blur-[24px] border border-white/20`.

## III. File Structure
- `src/app/`: Managed routes.
- `src/components/ui/`: Shared base components.
- `src/components/features/`: Domain-specific components.
- `scripts/`: OS-level automation tools.

## IV. Development
- **Dev Server**: Standard Port: `3001` (to avoid Port 3000 conflicts in WSL2/Docker).
- **Commands**: Use `npm run dev -- -p 3001`.
- **E2E Testing**: Ensure `playwright.config.ts` targets Port `3001`.

---
**Template Version**: 5.5
**Project Context**: privacy-vault
**Last Updated**: 2026-04-20
