// POMs are illustrative and assumed to be defined elsewhere as per SDS
import { CampaignListPage } from '../page-objects/campaign/CampaignListPage';
import { CampaignEditorPage } from '../page-objects/campaign/CampaignEditorPage';

Cypress.Commands.add('getByTestId', (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

Cypress.Commands.add('login', (username?: string, password?: string, userRole: 'admin' | 'campaignManager' = 'admin') => {
  const user = {
    admin: {
      username: username || Cypress.env('ADMIN_USERNAME') || 'admin@example.com',
      password: password || Cypress.env('ADMIN_PASSWORD') || 'password123',
    },
    campaignManager: {
      username: username || Cypress.env('CAMPAIGN_MANAGER_USERNAME') || 'manager@example.com',
      password: password || Cypress.env('CAMPAIGN_MANAGER_PASSWORD') || 'password123',
    }
  };
  const selectedUser = user[userRole];

  cy.session([selectedUser.username, selectedUser.password, userRole], () => {
    cy.visit('/login'); // Adjust to your login page URL
    cy.getByTestId('username-input').clear().type(selectedUser.username);
    cy.getByTestId('password-input').clear().type(selectedUser.password, { log: false });
    cy.getByTestId('login-button').click();
    cy.url().should('not.include', '/login'); // Verify navigation post-login
    cy.getByTestId('dashboard-welcome-message').should('be.visible'); // Example verification
  }, {
    cacheAcrossSpecs: true
  });
});

Cypress.Commands.add('apiLogin', (userRole: 'admin' | 'campaignManager' = 'admin') => {
  const credentials = {
      admin: {
          username: Cypress.env('ADMIN_USERNAME') || 'admin@example.com',
          password: Cypress.env('ADMIN_PASSWORD') || 'password123',
      },
      campaignManager: {
          username: Cypress.env('CAMPAIGN_MANAGER_USERNAME') || 'manager@example.com',
          password: Cypress.env('CAMPAIGN_MANAGER_PASSWORD') || 'password123',
      }
  };
  const selectedUser = credentials[userRole];

  return cy.task('performApiLogin', selectedUser).then((response: any) => { // Assuming response structure { access_token: '...' }
      if (response && response.access_token) {
        Cypress.env('authToken', response.access_token);
      } else {
        // Log an error or throw if token is not found, to help with debugging
        console.error('API Login did not return an access_token:', response);
        throw new Error('API Login failed to retrieve access token.');
      }
      return response; // Return the full response for potential further use
  });
});


Cypress.Commands.add('logout', () => {
  // Example: Click logout button, verify navigation to login page
  // These test IDs are examples and should match your application
  cy.getByTestId('user-menu-button').click();
  cy.getByTestId('logout-button').click();
  cy.url().should('include', '/login');
});

Cypress.Commands.add('navigateTo', (pageUrl: string) => {
  cy.visit(pageUrl);
});

Cypress.Commands.add('createCampaignViaUI', (campaignDetails: { name: string; budget: number; startDate: string; endDate: string; network: string }) => {
    const campaignListPage = new CampaignListPage();
    const campaignEditorPage = new CampaignEditorPage();

    campaignListPage.visit();
    campaignListPage.clickCreateCampaign();

    campaignEditorPage.fillCampaignName(campaignDetails.name);
    campaignEditorPage.setBudget(campaignDetails.budget);
    campaignEditorPage.setSchedule(campaignDetails.startDate, campaignDetails.endDate);
    campaignEditorPage.selectAdNetwork(campaignDetails.network);
    campaignEditorPage.saveCampaign();

    campaignListPage.verifyCampaignExists(campaignDetails.name);
});