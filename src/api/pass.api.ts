import { APIRequestContext, expect } from '@playwright/test';
import { apiUrl } from '../config/urls';

export async function createPass(request: APIRequestContext, accessToken: string, passData: any) {
  const response = await request.post(apiUrl('/api/v1/passes'), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    data: passData,
  });

  expect(response.status()).toBe(201);
  return await response.json();
}
