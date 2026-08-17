import { test, expect } from '@playwright/test';
import { createPassData } from '../../src/test-data/pass-data';
import { createUserData } from '../../src/test-data/user-data';
import { createPass } from '../../src/api/pass.api';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { registerMember } from '../../src/ui/user-registration.ui';
import { completeFreeCheckout } from '../../src/ui/free-checkout.ui';

test.describe('Pass purchase', () => {
  test('User can activate a free pass @regression @mutating', async ({ page, request }) => {
    // API call to create a pass plan.
    const accessToken = await getAdminAccessToken(request);
    const passData = await createPassData();
    const response = await createPass(request, accessToken, passData);
    await expect(response).toHaveProperty('id');

    // UI call to register a member.
    const userData = createUserData('member');
    await registerMember(page, userData);
    await expect(page).toHaveURL('/');

    await page.goto('/membership');
    await expect(page).toHaveURL(/\/membership/);

    await page.getByRole('button', { name: 'PASSES' }).click();
    const passCard = page
      .getByRole('heading', { name: passData.name })
      .locator('xpath=ancestor::div[contains(@class, "flex") and contains(@class, "flex-col")][1]');
    await expect(passCard).toBeVisible();

    await passCard.getByRole('button', { name: 'BEGIN NOW' }).click();
    await page.getByRole('button', { name: 'NEXT' }).click();

    const todayLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kathmandu',
    }).format(new Date());
    await page.getByRole('button', { name: todayLabel }).click();
    const nextButton = page.getByRole('dialog').getByRole('button', { name: 'Next', exact: true });
    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();
    await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
    await expect(page).toHaveURL(/\/checkout/);
    await completeFreeCheckout(page);
  });
});
