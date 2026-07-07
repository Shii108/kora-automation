import { test, expect } from '@playwright/test';
import { createUserData } from '../../src/test-data/user-data';
import { registerMember } from '../../src/ui/user-registration.ui';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createMembershipData } from '../../src/test-data/membership-data';
import { createMembership } from '../../src/api/membership.api';
import { stripePayment } from '../../src/ui/stripe-payment';
import { queryDatabase } from '../../utils/db';

test('User can buy membership with Stripe and payment is stored in database @regression', async ({
  page,
  request,
}) => {
  // API call to create a membership plan.
  const accessToken = await getAdminAccessToken(request);
  const membershipData = await createMembershipData();
  const response = await createMembership(request, accessToken, membershipData);
  await expect(response).toHaveProperty('id');

  // UI call to register a member.
  const userData = createUserData('member');
  await registerMember(page, userData);
  await expect(page).toHaveURL('/');

  await page.getByRole('button', { name: 'Membership' }).click();
  await expect(page).toHaveURL(/\/membership/);

  const membershipCard = page
    .getByRole('heading', { name: membershipData.name })
    .locator('xpath=ancestor::div[contains(@class, "flex") and contains(@class, "flex-col")][1]');
  await expect(membershipCard).toBeVisible();

  await membershipCard.getByRole('button', { name: 'BEGIN NOW' }).click();
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
