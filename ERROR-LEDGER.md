# Error Ledger & RCA

## [2026-04-25] Runtime Module Resolution Error

**Status**: RESOLVED
**Incident**: `__webpack_modules__[moduleId] is not a function` on page load after Metadata Audit integration.

### Root Cause Analysis (RCA)
- **Technical**: Naming collision between `interface MetadataAudit` (in `metadata.ts`) and `export function MetadataAudit` (in `MetadataAudit.tsx`). Webpack bundled the component but the runtime registry confused it with the type object during circular evaluation, resulting in a "not a function" error when React tried to render the component.
- **Process**: The implementation plan lacked an **Automated Smoke Test** phase. Static verification (`npm run build`) passed because TypeScript correctly separated types and values, but it missed the runtime module resolution failure.

### Prevention Measures
1. **Naming Hygiene**: Renamed interface to `ForensicReport`. Established a new standard: Data models must use `*Report`, `*Model`, or `*Data` suffixes.
2. **Mandatory Runtime Tests**: Added `tests/smoke.spec.ts` and updated `GEMINI.md` to require Playwright smoke tests for all UI changes.
3. **New Skill**: Created `.agents/skills/runtime-verification` to codify the runtime check process.

### Resolution
- Renamed interface to `ForensicReport`.
- Standardized `import type` usage.
- Integrated automated smoke test.

## [2026-04-26] CSS Syntax & Hook Rules Violation
**Status**: RESOLVED
**Incident**: Production build failures and React runtime warnings during the "Sanctuary" refactor.

### Root Cause Analysis (RCA)
- **Tailwind Opacity Error**: Attempted to use `@apply bg-[var(--background)]/80`. Tailwind's JIT compiler cannot resolve opacity modifiers on raw CSS variables unless they are transformed into color-space components first.
- **Hook Rule Breach**: Called `useState` after a conditional `if (!data) return null` in `ForensicMatrix.tsx`. This violates the React "Rules of Hooks" which require hooks to be called in the exact same order on every render.

### Prevention Measures
1. **Standardized RGBA**: Mandated the use of standard CSS RGBA properties for variables with opacity in `globals.css`.
2. **Hook Ordering Lints**: Strengthened ESLint configuration to fail build on hook order violations.
3. **Protocol Enforcement**: Re-emphasized the **Subagent-Driven Development** (SDD) phase 4 requirement for pre-commit linting.
