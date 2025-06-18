import { LoginPage } from '../../page-objects/LoginPage';
import { DashboardPage } from '../../page-objects/DashboardPage';
import usersFixture from '../../fixtures/users.json';

describe('Authentication', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const adminUser = usersFixture.find(user => user.role === 'merchantAdmin');
  const campaignManagerUser = usersFixture.find(user => user.role === 'campaignManager');
  const invalidUser = usersFixture.find(user => user.role === 'unknown');

  beforeEach(() => {
    loginPage = new LoginPage();
    dashboardPage = new DashboardPage();
    // Clear session before each test to ensure a clean login state,
    // unless using cy.session which handles this.
    // cy.clearCookies();
    // cy.clearLocalStorage();
    // Cypress.session.clearAllSavedSessions(); // Use if issues with cached sessions persist
  });

  it('should allow a merchant admin to log in successfully', () => {
    if (!adminUser) {
        throw new Error('Admin user not found in fixtures');
    }
    // Using the custom command `cy.login()` which uses cy.session
    cy.login(adminUser.username, adminUser.password, 'admin');
    dashboardPage.verifyUserIsOnDashboard();
    dashboardPage.getWelcomeMessageText().should('not.be.empty');
  });

  it('should allow a campaign manager to log in successfully', () => {
    if (!campaignManagerUser) {
        throw new Error('Campaign manager user not found in fixtures');
    }
    // Using the custom command `cy.login()` which uses cy.session
    cy.login(campaignManagerUser.username, campaignManagerUser.password, 'campaignManager');
    dashboardPage.verifyUserIsOnDashboard(); // Assuming campaign manager also lands on a similar dashboard
    dashboardPage.getWelcomeMessageText().should('not.be.empty');
  });

  it('should display an error message for invalid credentials', () => {
    if (!invalidUser) {
        throw new Error('Invalid user not found in fixtures');
    }
    loginPage.loginAs(invalidUser.username, invalidUser.password);
    loginPage.verifyErrorMessageIsVisible('Invalid credentials'); // Adjust message as per actual app
    cy.url().should('include', '/login');
  });

  it('should prevent access to protected pages without login', () => {
    // Attempt to visit a protected page directly
    cy.visit('/dashboard', { failOnStatusCode: false }); // Allow non-2xx to check redirection
    cy.url().should('include', '/login'); // Assert redirection to login page
    loginPage.verifyErrorMessageIsVisible('You must be logged in to view this page'); // Or similar message if app shows one
  });

  it('should allow a logged-in user to log out', () => {
    if (!adminUser) {
        throw new Error('Admin user not found in fixtures');
    }
    cy.login(adminUser.username, adminUser.password, 'admin');
    dashboardPage.verifyUserIsOnDashboard();

    cy.logout(); // Uses custom command
    cy.url().should('include', '/login');
    // Optionally, verify login form elements are visible again
    loginPage.fillUsername(''); // Just to ensure LoginPage elements are interactable
  });
});