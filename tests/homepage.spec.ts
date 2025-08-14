import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/PropMate/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Vào app' }).first().click();

  // Expects the URL to contain login (since user is not authenticated)
  await expect(page).toHaveURL(/.*login/);
});