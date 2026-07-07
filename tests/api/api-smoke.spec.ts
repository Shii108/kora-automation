import { test, expect } from '@playwright/test';
import { adminLogin } from '../../src/api/auth.api';

test.describe('API smoke checks', () => {
  test('API health endpoint returns ok @smoke', async ({ request }) => {
    const response = await request.get('/api/v1/health');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeTruthy();
  });

  test('API docs route is available @smoke', async ({ request }) => {
    const response = await request.get('/docs');

    expect(response.status()).toBe(200);
  });

  test('Protected API routes require authentication @smoke', async ({ request }) => {
    const protectedRoutes = ['/api/v1/membership-plans', '/api/v1/passes', '/api/v1/sessions'];

    for (const route of protectedRoutes) {
      const response = await request.get(route);

      expect(response.status()).toBe(401);
    }
  });

  test('Admin can login and receive access token @smoke', async ({ request }) => {
    const response = await adminLogin(
      request,
      process.env.ADMIN_EMAIL as string,
      process.env.ADMIN_PASSWORD as string,
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.accessToken).toBeTruthy();
  });
});
