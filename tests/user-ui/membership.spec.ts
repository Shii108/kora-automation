import { test, expect } from '@playwright/test';
import { createUserData } from '../../src/test-data/user-data';
import { registerMember } from '../../src/ui/user-registration.ui';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createMembershipData } from '../../src/test-data/membership-data';
import { createMembership } from '../../src/api/membership.api';
import { completeFreeCheckout } from '../../src/ui/free-checkout.ui';

test('User can activate a free membership @regression @mutating', async ({ page, request }) => {
  // API call to create a membership plan.
  const accessToken = await getAdminAccessToken(request);
  const membershipData = await createMembershipData();
  const response = await createMembership(request, accessToken, membershipData);
  await expect(response).toHaveProperty('id');

  // UI call to register a member.
  const userData = createUserData('member');
  await registerMember(page, userData);
  await expect(page).toHaveURL('/');

  await page.goto('/membership');
  await expect(page).toHaveURL(/\/membership/);

  const membershipCard = page
    .getByRole('heading', { name: membershipData.name })
    .locator('xpath=ancestor::div[contains(@class, "flex") and contains(@class, "flex-col")][1]');
  await expect(membershipCard).toBeVisible();

  await membershipCard.getByRole('button', { name: 'BEGIN NOW' }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await completeFreeCheckout(page);
});
