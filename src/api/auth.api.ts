import { APIRequestContext } from '@playwright/test';
import { requireEnv } from '../config/env';
import { apiUrl } from '../config/urls';

export async function adminLogin(request: APIRequestContext, email: string, password: string) {
  return await request.post(apiUrl('/api/v1/auth/admin/login'), {
    data: { email, password },
  });
}

export async function getAdminAccessToken(request: APIRequestContext) {
  const response = await adminLogin(
    request,
    requireEnv('ADMIN_EMAIL'),
    requireEnv('ADMIN_PASSWORD'),
  );

  if (!response.ok()) {
    throw new Error(`Admin login failed with HTTP ${response.status()}: ${await response.text()}`);
  }

  const body: unknown = await response.json();
  if (
    typeof body !== 'object' ||
    body === null ||
    !('accessToken' in body) ||
    typeof body.accessToken !== 'string' ||
    !body.accessToken
  ) {
    throw new Error('Admin login succeeded but the response did not contain an access token.');
  }

  return body.accessToken;
}

export async function memberLogin(request: APIRequestContext, email: string, password: string) {
  return await request.post(apiUrl('/api/v1/auth/member/login'), {
    data: { email, password },
  });
}

type MemberRegistrationData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export async function registerMemberApi(
  request: APIRequestContext,
  userData: MemberRegistrationData,
) {
  return await request.post(apiUrl('/api/v1/auth/member/register'), {
    data: {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
    },
  });
}
