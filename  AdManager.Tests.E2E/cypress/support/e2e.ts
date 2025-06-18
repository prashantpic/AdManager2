// Import custom commands
import './commands';

// Import global styles or polyfills if needed for the AUT in test mode
// import '../../src/styles/globals.css'; // Example if app styles are needed

// Global beforeEach hook
beforeEach(() => {
  // Example: Clear local storage or cookies if needed before each test
  // cy.clearLocalStorage();
  // cy.clearCookies();

  // Example: Intercept common API calls to stub responses globally for certain test suites
  // cy.intercept('GET', '/api/user/profile', { fixture: 'profile.json' }).as('userProfile');
});

// Global afterEach hook
// afterEach(() => {
  // Perform cleanup actions after each test
// });

// Handle uncaught exceptions from the application
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // Customize this based on expected/ignorable application errors during tests
  // console.error('Uncaught exception:', err);
  // return false;

  // For now, let Cypress fail on uncaught exceptions unless specific ones are known.
  // Returning true will allow Cypress to fail the test.
  return true;
});