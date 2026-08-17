import { test, expect } from '@playwright/test';
import { registerMemberApi } from '../../src/api/auth.api';
import { requireEnv } from '../../src/config/env';
import { createUserData } from '../../src/test-data/user-data';

test.describe('Forgot password', () => {
  test('User can reset their password @regression @mutating', async ({ page, request }) => {
    test.setTimeout(120000);

    const newPassword = 'Test@1234';
    const userData = createUserData('member');
    const registerResponse = await registerMemberApi(request, userData);
    expect(registerResponse.status()).toBe(201);

    await page.goto('/login');
    await page.getByRole('link', { name: 'Forgot Password?' }).click();
    await expect(page).toHaveURL('/forgot-password');

    await page.getByLabel('EMAIL ADDRESS').fill(userData.email);
    await page.getByRole('button', { name: 'SUBMIT' }).click();
    await expect(page.getByRole('heading', { name: 'Enter OTP Code' })).toBeVisible();

    const emailPage = await page.context().newPage();
    const inbox = userData.email.split('@')[0];
    const inboxUrl = new URL(requireEnv('EMAIL_INBOX_URL'));
    inboxUrl.searchParams.set('login', inbox);
    await emailPage.goto(inboxUrl.toString());

    const emailFrame = emailPage.frameLocator('#ifmail');
    let otpCode: string | undefined;

    await expect
      .poll(
        async () => {
          await emailPage.locator('#refresh').click();
          const emailText = await emailFrame.locator('body').innerText();
          otpCode = emailText.match(/OTP Code:\s*([A-Z0-9]+)/)?.[1];
          return otpCode;
        },
        {
          message: `OTP email was not delivered to ${userData.email}`,
          timeout: 60000,
          intervals: [1000, 2000, 5000],
        },
      )
      .toBeTruthy();

    if (!otpCode) {
      throw new Error(`Could not find OTP for ${userData.email}`);
    }

    await emailPage.close();

    await page.getByRole('textbox', { name: 'pin input 1 of 6' }).click();
    await page.keyboard.type(otpCode);
    await page.getByRole('button', { name: 'NEXT' }).click();

    await expect(page.getByPlaceholder('Create a password')).toBeVisible();
    await page.getByPlaceholder('Create a password').fill(newPassword);
    await page.getByPlaceholder('Confirm password').fill(newPassword);
    await page.getByRole('button', { name: 'UPDATE PASSWORD' }).click();

    await expect(page).toHaveURL(/\/login/);

    await page.getByPlaceholder('Your email address').fill(userData.email);
    await page.getByPlaceholder('Your Password').fill(newPassword);
    await page.getByRole('button', { name: 'SIGN IN' }).click();

    await expect(page).toHaveURL('/');
  });
});
