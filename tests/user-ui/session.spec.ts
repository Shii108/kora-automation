import { test, expect } from '@playwright/test';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createInstructor } from '../../src/api/instructor.api';
import { createSession } from '../../src/api/session.api';
import { createSessionMultipartData } from '../../src/test-data/session-data';
import { createUserData } from '../../src/test-data/user-data';
import { registerMember } from '../../src/ui/user-registration.ui';
import { stripePayment } from '../../src/ui/stripe-payment';
import { queryDatabase } from '../../utils/db';

test.describe('Session', () => {
  test('User can book paid session with Stripe and payment is stored in database @regression', async ({
    page,
    request,
  }) => {
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
    const query = 'SELECT * FROM checkout_sessions WHERE checkout_code = $1';
    const result = await queryDatabase(query, [checkoutCode]);
    expect(result.rowCount).toBe(1);
    expect(result.rows[0].status).toBe('paid');
  });

  test('User can book free session @regression', async ({ page, request }) => {
    // API setup to create a free upcoming session.
    const accessToken = await getAdminAccessToken(request);
    const instructor = await createInstructor(request, accessToken);
    const sessionData = createSessionMultipartData(String(instructor.id));
    sessionData.isFree = 'true';
    sessionData.price = '0';
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
    await expect(page.getByText(/Rs\.\s*0/).first()).toBeVisible();
    await page.getByRole('button', { name: /book this session/i }).click();

    const bookForMyselfCard = page
      .getByRole('heading', { name: 'Book For Myself' })
      .locator('xpath=ancestor::div[contains(@class, "border")][1]');

    await bookForMyselfCard.click();

    await page.getByRole('button', { name: /Next/i }).click();
    await page.getByRole('button', { name: /Proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText(/Rs\.\s*0/).first()).toBeVisible();

    await page.getByRole('button', { name: 'PAY NOW' }).click();
    await expect(page.getByRole('button', { name: 'GO BACK' })).toBeVisible();
    await page.getByRole('button', { name: 'PAY NOW' }).click();
    await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 30000 });
    await expect(page.getByRole('heading', { name: 'PAYMENT SUCCESSFUL' })).toBeVisible({
      timeout: 30000,
    });

    const referenceNumber = await page.getByText(/^CHK-/).textContent();
    expect(referenceNumber).toBeTruthy();

    const checkoutCode = referenceNumber!.trim();
    const query = 'SELECT * FROM checkout_sessions WHERE checkout_code = $1';
    const result = await queryDatabase(query, [checkoutCode]);
    expect(result.rowCount).toBe(1);
    expect(result.rows[0].status).toBe('paid');
  });
});
