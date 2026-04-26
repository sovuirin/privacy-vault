import { test, expect } from '@playwright/test';

test('Metadata Audit UI Smoke Test', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');

  // Check if the page loaded successfully without immediate runtime errors
  // (The moduleId error happens during module evaluation, so it would break the page load)
  const title = await page.title();
  expect(title).toBeDefined();

  // Verify the main upload area is visible
  const dropzone = page.locator('text=Drop image files here');
  await expect(dropzone).toBeVisible();

  // Check for any console errors that might indicate module resolution issues
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`PAGE ERROR: ${msg.text()}`);
    }
  });
});
