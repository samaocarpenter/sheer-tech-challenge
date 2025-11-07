import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.nhs.uk/medicines/');
  await expect(page.getByText('Medicines A to Z')).toBeVisible();


  await page.close();
});