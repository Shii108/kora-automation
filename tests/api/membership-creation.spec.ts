import { test, expect } from '@playwright/test';
import { getAdminAccessToken } from '../../src/api/auth.api';
import { createMembershipData } from '../../src/test-data/membership-data';
import { createMembership } from '../../src/api/membership.api';

test.describe('Membership Creation API Tests', () => {
  test('Create Membership @smoke', async ({ request }) => {
    const accessToken = await getAdminAccessToken(request);
    const membershipData = await createMembershipData();
    const response = await createMembership(request, accessToken, membershipData);
    expect(response).toHaveProperty('id');
  });
});
