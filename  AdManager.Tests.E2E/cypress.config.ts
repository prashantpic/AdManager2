import { defineConfig } from 'cypress';
import registerApiTasks from './cypress/tasks'; // Adjusted path as per SDS: ./cypress/tasks/index.ts exports default registerTasks

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    reporter: 'spec', // Default reporter
    // Example for Mochawesome reporter (ensure mochawesome and mochawesome-merge are installed)
    // reporter: 'mochawesome',
    // reporterOptions: {
    //   reporterEnabled: 'mochawesome',
    //   mochawesomeReporterOptions: {
    //     reportDir: 'cypress/reports/mochawesome',
    //     overwrite: false,
    //     html: true,
    //     json: true,
    //     charts: true,
    //     quiet: true,
    //   },
    // },
    setupNodeEvents(on, config) {
      // Register tasks
      registerApiTasks(on, config);

      // You can add other Node event listeners here
      // For example, to handle browser launch options or plugins

      return config;
    },
    env: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080/api/v1',
      ADMIN_USERNAME: process.env.CYPRESS_ADMIN_USERNAME || 'admin@example.com',
      ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD || 'password123',
      CAMPAIGN_MANAGER_USERNAME: process.env.CYPRESS_CAMPAIGN_MANAGER_USERNAME || 'manager@example.com',
      CAMPAIGN_MANAGER_PASSWORD: process.env.CYPRESS_CAMPAIGN_MANAGER_PASSWORD || 'password123',
      // Add other environment variables as needed
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 15000,
  },
  // Component testing configuration (if needed in the future)
  // component: {
  //   devServer: {
  //     framework: 'next', // or 'react', 'vue', etc.
  //     bundler: 'webpack', // or 'vite'
  //   },
  // },
});