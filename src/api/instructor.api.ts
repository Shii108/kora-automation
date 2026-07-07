import { APIRequestContext, expect } from '@playwright/test';
import { apiUrl } from '../config/urls';
import { createUserData } from '../test-data/user-data';

export async function createInstructor(request: APIRequestContext, accessToken: string) {
  const userData = createUserData('instructor');

  const response = await request.post(apiUrl('/api/v1/instructors'), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    data: {
      fullName: userData.fullName,
      email: userData.email,
      isActive: true,
      phoneNumber: userData.phoneNumber,
      bio: `Instructor created at ${new Date().toISOString()}`,
    },
  });

  expect(response.status()).toBe(201);

  return await response.json();
}
