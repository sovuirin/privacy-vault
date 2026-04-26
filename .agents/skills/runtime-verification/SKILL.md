# Runtime Verification Skill

This skill ensures that UI changes actually work in a real browser environment, catching issues like "moduleId is not a function" or hydration mismatches that static builds miss.

## Mandate

Before claiming any UI task as "Done" or "Verified", you MUST execute a runtime smoke test.

## Execution Steps

1. **Start Dev Server**: Ensure `npm run dev` is running (check background processes).
2. **Create Smoke Test**: If one doesn't exist, create a Playwright spec in `tests/smoke.spec.ts`.
   ```typescript
   import { test, expect } from '@playwright/test';
   test('Page Hydration Test', async ({ page }) => {
     await page.goto('/');
     await expect(page.locator('body')).toBeVisible();
     // Check for React component readiness
   });
   ```
3. **Run Test**: Execute `npx playwright test`.
4. **Audit Console**: Verify no console errors related to module resolution or circular dependencies.

## Naming Standards

To prevent the "not a function" runtime error caused by Webpack module collisions:
- Interfaces/Types: Use `*Model`, `*Report`, or `*Data` suffixes.
- Components: Keep the plain name or use `*View` / `*Component`.
- **NEVER** name a type and a component identically in the same dependency graph.
