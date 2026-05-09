import { defineConfig, devices } from '@playwright/test'

const reporters: Array<[string] | [string, Record<string, unknown>]> = process.env.CI
  ? [
      ['list'],
      ['blob'],
      [
        '@estruyf/github-actions-reporter',
        {
          title: 'Playwright E2E Results',
          useDetails: true,
          showError: true,
          showArtifactsLink: true,
        },
      ],
    ]
  : [['list'], ['html', { open: 'never' }]]

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
