const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    viewportWidth: 1366,
    viewportHeight: 768,
    env: {
      ADMIN_EMAIL: 'socio_formador@talk.com',
      ADMIN_PASSWORD: 'socio_formador123',
    }
  }
});