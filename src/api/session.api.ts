import { APIRequestContext, expect } from '@playwright/test';
import { apiUrl } from '../config/urls';

export async function createSession(
  request: APIRequestContext,
  accessToken: string,
  sessionData: any,
) {
  const response = await request.post(apiUrl('/api/v1/sessions'), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    multipart: sessionData,
  });

  expect(response.status()).toBe(201);
  return await response.json();
}
