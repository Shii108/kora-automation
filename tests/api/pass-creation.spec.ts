import { test, expect } from '@playwright/test';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createPassData } from '../../src/test-data/pass-data';
import { createPass } from '../../src/api/pass.api';

test.describe('Pass Creation API Tests', () => {
  test('Create Pass @smoke', async ({ request }) => {
    const accessToken = await getAdminAccessToken(request);
    const passData = await createPassData();
    const response = await createPass(request, accessToken, passData);
    expect(response).toHaveProperty('id');
  });
});
