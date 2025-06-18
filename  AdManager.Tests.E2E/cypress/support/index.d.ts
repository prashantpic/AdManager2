// load type definitions from Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('submit-button')
     */
    getByTestId(testId: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to log in a user via UI using cy.session for caching.
     * Credentials can be passed directly or sourced from Cypress environment variables.
     * @example cy.login('admin@example.com', 'password123', 'admin')
     * @example cy.login(undefined, undefined, 'campaignManager') // uses env vars for campaignManager
     */
    login(username?: string, password?: string, userRole?: 'admin' | 'campaignManager'): Chainable<void>;

    /**
     * Custom command to log in a user via API task.
     * Stores the authentication token (access_token) in `Cypress.env('authToken')`.
     * The task 'performApiLogin' is expected to return an object containing `access_token`.
     * @example cy.apiLogin('admin').then(response => { expect(response.access_token).to.exist; })
     */
    apiLogin(userRole?: 'admin' | 'campaignManager'): Chainable<any>; // Replace 'any' with a more specific type if the token response structure is well-defined.

    /**
     * Custom command to log out the current user.
     * Assumes specific data-testid attributes for user menu and logout button.
     * @example cy.logout()
     */
    logout(): Chainable<void>;

    /**
     * Custom command to navigate to a specific page URL using `cy.visit()`.
     * @example cy.navigateTo('/dashboard')
     */
    navigateTo(pageUrl: string): Chainable<void>;

    /**
     * Custom command to create a campaign through the UI.
     * This command utilizes CampaignListPage and CampaignEditorPage POMs.
     * @example cy.createCampaignViaUI({ name: 'Test Campaign Q1', budget: 1000, startDate: '2024-01-01', endDate: '2024-03-31', network: 'Google Ads' })
     */
    createCampaignViaUI(campaignDetails: { name: string; budget: number; startDate: string; endDate: string; network: string }): Chainable<void>;
  }
}