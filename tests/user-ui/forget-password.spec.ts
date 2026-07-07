import { test, expect } from '@playwright/test';
import { createUserData } from '../../src/test-data/user-data';
import { registerMember } from '../../src/ui/user-registration.ui';

test.describe('Forget Password', () => {
  test('User can reset password @regression', async ({ page }) => {
    test.setTimeout(90000);

    const newPassword = 'Test@1234';
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register Now' }).click();

    const userData = createUserData('member');
    await registerMember(page, userData);

    await expect(page).toHaveURL('/');
    await page.locator('img[src="/avatar.png"]').click();
    await page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await expect(page.getByRole('heading', { name: 'Sign Out' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign Out' }).click();

    await expect(page).toHaveURL('/login');
    await page.getByRole('link', { name: 'Forgot Password?' }).click();
    await expect(page).toHaveURL('/forgot-password');

    await page.getByLabel('EMAIL ADDRESS').fill(userData.email);
    await page.getByRole('button', { name: 'SUBMIT' }).click();
    await expect(page.getByRole('heading', { name: 'Enter OTP Code' })).toBeVisible();

    const emailPage = await page.context().newPage();
    await emailPage.goto('https://www.yopmail.com');
    await emailPage.locator('#login').fill(userData.email);
    await emailPage.locator('#login').press('Enter');

    const emailFrame = emailPage.frameLocator('#ifmail');
    const otpText = await emailFrame.getByText(/^OTP Code:/).textContent({ timeout: 60000 });

    const match = otpText?.match(/OTP Code:\s*([A-Z0-9]+)/);

    if (!match) {
      throw new Error(`Could not find OTP in text: ${otpText}`);
    }

    const otpCode = match[1];

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
