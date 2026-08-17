import 'dotenv/config';
import { defineConfig } from '@playwright/test';
import { requireEnv } from './src/config/env';

const apiBaseURL = requireEnv('API_URL');
const adminBaseURL = requireEnv('ADMIN_URL');
const userBaseURL = requireEnv('USER_URL');

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/config/global-setup.ts',
  metadata: {
    apiBaseURL,
    adminBaseURL,
    userBaseURL,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // These tests create records in a shared environment, so avoid parallel writes and retry duplicates.
  retries: 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: apiBaseURL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: apiBaseURL,
      },
    },
    {
      name: 'user-ui',
      testMatch: /tests\/user-ui\/.*\.spec\.ts/,
      use: {
        baseURL: userBaseURL,
        timezoneId: 'Asia/Kathmandu',
      },
    },
  ],
});
