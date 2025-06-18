export abstract class BasePage {
  protected pageUrl: string = '/'; // Default, should be overridden by subclasses
  protected pageTitleSelector: string = 'title'; // Example, adjust if needed

  constructor() {
    // Constructor logic if needed
  }

  visit(path?: string): void {
    cy.visit(path || this.pageUrl);
  }

  getPageTitle(): Cypress.Chainable<string> {
    return cy.get(this.pageTitleSelector).invoke('text');
  }

  waitForPageLoad(): void {
    // Implement generic wait for page load, e.g., waiting for a common element
    // or using cy.location('pathname').should('eq', this.pageUrl)
    cy.get('body', { timeout: Cypress.config('pageLoadTimeout') }).should('be.visible'); // Basic check
    if (this.pageUrl !== '/') {
        cy.url().should('include', this.pageUrl);
    }
  }

  // Common header/footer elements can be defined here
  getGlobalSearchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('global-search-input');
  }
}