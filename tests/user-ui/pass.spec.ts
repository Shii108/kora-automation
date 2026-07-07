import { test, expect } from '@playwright/test';
import { createPassData } from '../../src/test-data/pass-data';
import { createUserData } from '../../src/test-data/user-data';
import { createPass } from '../../src/api/pass.api';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { registerMember } from '../../src/ui/user-registration.ui';
import { stripePayment } from '../../src/ui/stripe-payment';
import { queryDatabase } from '../../utils/db';

test.describe('Pass purchase', () => {
  test('User can buy pass with Stripe and payment is stored in database @regression', async ({
    page,
    request,
  }) => {
    // API call to create a pass plan.
    const accessToken = await getAdminAccessToken(request);
    const passData = await createPassData();
    const response = await createPass(request, accessToken, passData);
    await expect(response).toHaveProperty('id');

    // UI call to register a member.
    const userData = createUserData('member');
    await registerMember(page, userData);
    await expect(page).toHaveURL('/');

    await page.getByRole('button', { name: 'Membership' }).click();
    await expect(page).toHaveURL(/\/membership/);

    await page.getByRole('button', { name: 'PASSES' }).click();
    const passCard = page
      .getByRole('heading', { name: passData.name })
      .locator('xpath=ancestor::div[contains(@class, "flex") and contains(@class, "flex-col")][1]');
    await expect(passCard).toBeVisible();

    await passCard.getByRole('button', { name: 'BEGIN NOW' }).click();
    await page.getByRole('button', { name: 'NEXT' }).click();

    const today = new Date();
    const todayLabel = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    await page.getByRole('button', { name: todayLabel }).click();
    const nextButton = page.getByRole('dialog').getByRole('button', { name: 'Next', exact: true });
    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();
    await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByRole('button', { name: 'PAY NOW' }).click();
    await expect(page.getByRole('button', { name: 'GO BACK' })).toBeVisible();
    await page.locator('img[alt="Stripe"]').click();
    await expect(page.locator('input[value="stripe"]')).toBeChecked();
    await page.getByRole('button', { name: 'PAY NOW' }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.com/i);

    await stripePayment(page, userData.fullName);

    await page.getByRole('button', { name: 'Pay' }).click();

    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.getByRole('heading', { name: 'PAYMENT SUCCESSFUL' })).toBeVisible({
      timeout: 30000,
    });

    const referenceNumber = await page.getByText(/^CHK-/).textContent();

    expect(referenceNumber).toBeTruthy();

    const checkoutCode = referenceNumber!.trim();
    // Verify payment exists in database.

    const query = 'SELECT * FROM checkout_sessions WHERE checkout_code = $1';
    const result = await queryDatabase(query, [checkoutCode]);
    expect(result.rowCount).toBe(1);
    expect(result.rows[0].status).toBe('paid');
  });
});
