import { defineConfig, devices } from '@playwright/test';

 import dotenv from 'dotenv';
 import path from 'path';
 dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
   webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
   { name: 'setup', testMatch: /auth\.setup\.ts/ }, 
   // 1) Setup projesi — testlerden önce çalışacak ve gerekli oturum dosyalarını oluşturacak
    
   // 2) Admin testleri — admin oturumu ile
    {
      name: 'chromium-admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
      testMatch: /admin-.*\.spec\.ts/,
    },
    // 3) Giriş yapmış normal kullanıcı testleri
    {
      name: 'chromium-user',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /user-.*\.spec\.ts/,
    },
    // 4) Giriş yapmamış kullanıcı testleri
    {
      name: 'chromium-logged-out',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /logged-out\.spec\.ts/,
    },
  ],
});
