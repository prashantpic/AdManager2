import { BasePage } from './BasePage';
import { CampaignListPage } from './campaign/CampaignListPage';

export class DashboardPage extends BasePage {
  protected override pageUrl = '/dashboard'; // Or your specific dashboard path

  private get welcomeMessage(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('dashboard-welcome-message'); }
  private get campaignsNavLink(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('nav-campaigns-link'); }

  public visit(): void {
    super.visit(this.pageUrl);
  }

  public getWelcomeMessageText(): Cypress.Chainable<string> {
    return this.welcomeMessage.should('be.visible').invoke('text');
  }

  public navigateToCampaigns(): CampaignListPage {
    this.campaignsNavLink.should('be.visible').click();
    cy.url().should('include', '/campaigns'); // Assuming this is the campaigns list path
    return new CampaignListPage();
  }

  public verifyUserIsOnDashboard(): void {
    cy.url().should('include', this.pageUrl);
    this.welcomeMessage.should('be.visible');
  }
}