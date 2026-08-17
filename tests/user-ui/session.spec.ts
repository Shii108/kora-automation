import { test, expect } from '@playwright/test';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createInstructor } from '../../src/api/instructor.api';
import { createSession } from '../../src/api/session.api';
import { createSessionMultipartData } from '../../src/test-data/session-data';
import { createUserData } from '../../src/test-data/user-data';
import { registerMember } from '../../src/ui/user-registration.ui';
import { completeFreeCheckout } from '../../src/ui/free-checkout.ui';

test.describe('Session', () => {
  test('User can book a zero-fee session @regression @mutating', async ({ page, request }) => {
    // API setup to create a session.
    const accessToken = await getAdminAccessToken(request);
    const instructor = await createInstructor(request, accessToken);
    const sessionData = createSessionMultipartData(String(instructor.id));
    const response = await createSession(request, accessToken, sessionData);
    const session = response[0];
    expect(session.id).toBeTruthy();

    // UI setup to register a member and land on home page.
    const userData = createUserData('member');
    await registerMember(page, userData);
    await expect(page).toHaveURL('/');

    await page.goto(`/session/${session.id}`);
    await expect(page).toHaveURL(`/session/${session.id}`);
    await expect(page.getByRole('heading', { name: sessionData.name })).toBeVisible();
    await page.getByRole('button', { name: /book this session/i }).click();

    const bookForMyselfCard = page
      .getByRole('heading', { name: 'Book For Myself' })
      .locator('xpath=ancestor::div[contains(@class, "border")][1]');

    await bookForMyselfCard.click();

    await page.getByRole('button', { name: /Next/i }).click();
    await page.getByRole('button', { name: /Proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);
    await completeFreeCheckout(page);
  });
});
