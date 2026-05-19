/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

const isBrowserTest = process.env.VITEST_BROWSER === '1'

export default defineConfig({
  plugins: [react()],
  test: {
    include: isBrowserTest
      ? ['test/unit/**/*.test.tsx']
      : ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.test-d.tsx'],
    exclude: ['dist/**', 'node_modules/**'],
    typecheck: {
      include: ['src/**/*.test-d.tsx'],
      exclude: ['dist/**', 'node_modules/**'],
    },
    diff: {
      // printing the full CSS diff would be very verbose
      expand: false,
      truncateThreshold: 20,
    },
    environment: 'node',
    browser: isBrowserTest
      ? {
          enabled: true,
          provider: playwright(),
          headless: true,
          screenshotFailures: false,
          instances: [
            { browser: 'chromium' },
            { browser: 'firefox' },
            { browser: 'webkit' },
          ],
        }
      : undefined,
  },
})
