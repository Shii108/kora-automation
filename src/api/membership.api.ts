import { APIRequestContext, expect } from '@playwright/test';
import { apiUrl } from '../config/urls';

export async function createMembership(
  request: APIRequestContext,
  accessToken: string,
  membershipData: any,
) {
  const response = await request.post(apiUrl('/api/v1/membership-plans'), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    data: membershipData,
  });

  expect(response.status()).toBe(201);
  return await response.json();
}
