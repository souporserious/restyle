/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    diff: {
      // printing the full CSS diff would be very verbose
      expand: false,
      truncateThreshold: 20,
    },
    exclude: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    typecheck: {
      exclude: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      screenshotFailures: false,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
  },
})
