import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { createUserData } from '../../src/test-data/user-data';
import { memberLogin, getAdminAccessToken } from '../../src/api/auth.api';

test.describe('Login API Tests', () => {
  test('Member Creation and Login @smoke', async ({ request }) => {
    const userData = createUserData('member');

    const registerResponse = await request.post('/api/v1/auth/member/register', {
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
      },
    });

    expect(registerResponse.status()).toBe(201);

    const loginResponse = await memberLogin(request, userData.email, userData.password);

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    expect(loginBody).toHaveProperty('accessToken');
  });

  test('Member cannot login with wrong password @regression', async ({ request }) => {
    const userData = createUserData('member');

    const registerResponse = await request.post('/api/v1/auth/member/register', {
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
      },
    });

    expect(registerResponse.status()).toBe(201);

    const loginResponse = await memberLogin(request, userData.email, 'WrongPassword123!');

    expect(loginResponse.status()).toBe(400);
    const loginBody = await loginResponse.json();
    expect(loginBody.message).toContain('Invalid email or password');
  });

  test('Instructor Creation @regression', async ({ request }) => {
    const accessToken = await getAdminAccessToken(request);
    expect(accessToken).toBeTruthy();

    const userData = createUserData('instructor');

    const createInstructorResponse = await request.post('/api/v1/instructors', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        fullName: userData.fullName,
        email: userData.email,
        isActive: true,
        phoneNumber: userData.phoneNumber,
        bio: `THIS WAS THE INSTRUCTOR CREATED IN ${new Date()}`,
      },
    });
    expect(createInstructorResponse.status()).toBe(201);
    const instructorBody = await createInstructorResponse.json();
    expect(instructorBody.fullName).toBe(userData.fullName);
    expect(instructorBody.email).toBe(userData.email);
  });
});
