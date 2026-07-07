export type UserRole = 'admin' | 'member' | 'instructor';

export function createUserData(role: UserRole) {
  const timestamp = Date.now();
  const phoneNumber = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

  return {
    fullName: `${role} User ${timestamp}`,
    email: `${role}_${timestamp}@yopmail.com`,
    password: 'Test@123',
    phoneNumber,
    role,
  };
}
