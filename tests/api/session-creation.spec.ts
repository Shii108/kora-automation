import { expect, test } from '@playwright/test';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createInstructor } from '../../src/api/instructor.api';
import { createSession } from '../../src/api/session.api';
import { createSessionMultipartData } from '../../src/test-data/session-data';

test('checking api from session @smoke', async ({ request }) => {
  const accessToken = await getAdminAccessToken(request);
  const instructor = await createInstructor(request, accessToken);
  const sessionData = createSessionMultipartData(String(instructor.id));

  const body = await createSession(request, accessToken, sessionData);
  const session = body[0];

  expect(session.id).toBeTruthy();
  expect(session.name).toBe(sessionData.name);
});
