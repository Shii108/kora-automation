import { randomUUID } from 'node:crypto';

export type UserRole = 'admin' | 'member' | 'instructor';

export function createUserData(role: UserRole) {
  const timestamp = Date.now();
  const uniqueId = randomUUID().slice(0, 8);
  const phoneNumber = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

  return {
    fullName: `E2E ${role} User ${timestamp} ${uniqueId}`,
    email: `e2e_${role}_${timestamp}_${uniqueId}@yopmail.com`,
    password: 'Test@123',
    phoneNumber,
    role,
  };
}
