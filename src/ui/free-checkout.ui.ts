import { expect, Page } from '@playwright/test';

export async function completeFreeCheckout(page: Page) {
  const selectAll = page.getByRole('checkbox', { name: 'Select All' });
  await selectAll.check();
  await expect(selectAll).toBeChecked();
  await expect(page.getByText(/Rs\.\s*0/).first()).toBeVisible();

  const payNow = page.getByRole('button', { name: 'PAY NOW' });
  await expect(payNow).toBeEnabled();
  await payNow.click();

  await expect(page.getByRole('button', { name: 'GO BACK' })).toBeVisible();
  await payNow.click();

  await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 30000 });
  await expect(page.getByRole('heading', { name: 'PAYMENT SUCCESSFUL' })).toBeVisible({
    timeout: 30000,
  });

  const referenceNumber = await page.getByText(/^CHK-/).textContent();
  expect(referenceNumber).toBeTruthy();
}
