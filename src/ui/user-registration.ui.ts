import { expect, Page } from '@playwright/test';

type UserData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export async function registerMember(page: Page, userData: UserData) {
  await page.goto('/login');
  await expect(page).toHaveURL(/\/login/);

  await page.getByRole('link', { name: 'Register Now' }).click();
  await expect(page).toHaveURL(/\/register/);

  await page.getByLabel('Full Name').fill(userData.fullName);
  await page.getByLabel('Email').fill(userData.email);
  await page.getByLabel('Password').fill(userData.password);
  await page.getByLabel('Phone Number').fill(userData.phoneNumber);

  await page.getByRole('button', { name: 'Register' }).click();
}
