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
