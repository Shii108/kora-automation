import { APIRequestContext } from '@playwright/test';
import { apiUrl } from '../config/urls';

export async function adminLogin(request: APIRequestContext, email: string, password: string) {
  return await request.post(apiUrl('/api/v1/auth/admin/login'), {
    data: { email, password },
  });
}

export async function getAdminAccessToken(request: APIRequestContext) {
  const response = await adminLogin(
    request,
    process.env.ADMIN_EMAIL as string,
    process.env.ADMIN_PASSWORD as string,
  );

  const body = await response.json();
  return body.accessToken;
}

export async function memberLogin(request: APIRequestContext, email: string, password: string) {
  return await request.post(apiUrl('/api/v1/auth/member/login'), {
    data: { email, password },
  });
}
