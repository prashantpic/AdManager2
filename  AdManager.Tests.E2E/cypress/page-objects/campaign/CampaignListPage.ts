import { BasePage } from '../BasePage';
import { CampaignEditorPage } from './CampaignEditorPage';

export class CampaignListPage extends BasePage {
  protected override pageUrl = '/campaigns'; // Or your specific campaigns list path

  private get createCampaignButton(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('create-campaign-button'); }
  private get campaignTable(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('campaign-list-table'); }
  
  private campaignRowByName(campaignName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.campaignTable.should('be.visible').contains('tr', campaignName);
  }

  public visit(): void {
    super.visit(this.pageUrl);
  }

  public clickCreateCampaign(): CampaignEditorPage {
    this.createCampaignButton.should('be.visible').click();
    // Assuming navigation to editor page, URL check can be added
    cy.url().should('include', '/editor'); // Or a more specific path like /campaigns/create or /campaigns/editor/new
    return new CampaignEditorPage();
  }

  public verifyCampaignExists(campaignName: string, exists: boolean = true): void {
    if (exists) {
      this.campaignRowByName(campaignName).should('exist');
    } else {
      this.campaignRowByName(campaignName).should('not.exist');
    }
  }

  public openCampaignDetails(campaignName: string): CampaignEditorPage { // Or a CampaignDetailsPage
    this.campaignRowByName(campaignName).find('[data-testid="view-campaign-button"]').should('be.visible').click();
    // Assuming navigation to editor page in view/edit mode
    // URL check can be added, e.g. cy.url().should('include', '/editor/') and campaignName or ID
    return new CampaignEditorPage();
  }

  public deleteCampaign(campaignName: string): void {
    this.campaignRowByName(campaignName).find('[data-testid="delete-campaign-button"]').should('be.visible').click();
    // Handle confirmation dialog if any
    // This assumes a confirmation button with data-testid 'confirm-delete-button'
    cy.getByTestId('confirm-delete-button').should('be.visible').click();
    this.verifyCampaignExists(campaignName, false);
  }
}