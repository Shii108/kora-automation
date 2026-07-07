import { Page } from '@playwright/test';

export async function stripePayment(page: Page, name: string) {
  await page.getByLabel('Card number').fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM / YY').fill('12/70');
  await page.getByPlaceholder('CVC').fill('123');
  await page.getByLabel('Cardholder name').fill(name);
}
