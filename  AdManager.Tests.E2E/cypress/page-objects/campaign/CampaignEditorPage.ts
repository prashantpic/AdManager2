import { BasePage } from '../BasePage';
import { CampaignListPage } from './CampaignListPage';

export interface CampaignFormData {
  name: string;
  budget: number;
  startDate: string; // Expected format e.g., 'YYYY-MM-DD'
  endDate: string;   // Expected format e.g., 'YYYY-MM-DD'
  network: string; // This should match a value or text in the select options
}

export class CampaignEditorPage extends BasePage {
  // pageUrl might vary based on create vs edit, or use a dynamic one
  // For instance, when creating it might be /campaigns/create
  // When editing it might be /campaigns/edit/:id
  // We can override visit or pass path if BasePage.visit() is used
  // protected override pageUrl = '/campaigns/editor'; // Example, might need adjustment

  private get campaignNameInput(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('campaign-name-input'); }
  private get budgetInput(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('campaign-budget-input'); }
  private get startDateInput(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('campaign-start-date-input'); }
  private get endDateInput(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('campaign-end-date-input'); }
  private get adNetworkSelect(): Cypress.Chainable<JQuery<HTMLSelectElement>> { return cy.getByTestId('ad-network-select') as Cypress.Chainable<JQuery<HTMLSelectElement>>; }
  private get saveButton(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('save-campaign-button'); }
  private get cancelButton(): Cypress.Chainable<JQuery<HTMLElement>> { return cy.getByTestId('cancel-campaign-button'); }

  // Optionally, a more specific visit method if the URL pattern is consistent for new/edit
  // public visitCreateMode(): void {
  //   super.visit('/campaigns/create'); // Example path
  // }
  // public visitEditMode(campaignId: string): void {
  //   super.visit(`/campaigns/edit/${campaignId}`); // Example path
  // }

  public fillCampaignName(name: string): void {
    this.campaignNameInput.should('be.visible').clear().type(name);
  }

  public setBudget(amount: number): void {
    this.budgetInput.should('be.visible').clear().type(amount.toString());
  }

  public setSchedule(startDate: string, endDate: string): void {
    // Logic to handle date pickers
    // This is simplified for standard input type="date" or text inputs
    // Real date pickers (e.g., from a UI library) might need more complex interaction
    // (clicking to open, selecting year/month/day)
    this.startDateInput.should('be.visible').clear().type(startDate);
    this.endDateInput.should('be.visible').clear().type(endDate);
  }

  public selectAdNetwork(networkName: string): void {
    // This assumes a standard <select> element.
    // For custom dropdowns (e.g., div-based), interaction would be:
    // 1. Click the dropdown trigger.
    // 2. Wait for options to appear.
    // 3. Click the option containing `networkName`.
    this.adNetworkSelect.should('be.visible').select(networkName);
  }

  public saveCampaign(): CampaignListPage {
    this.saveButton.should('be.visible').click();
    // Add assertion for navigation to campaign list page or success message
    cy.url().should('include', '/campaigns'); // Or the specific path of campaign list
    return new CampaignListPage();
  }

  public cancelEditing(): CampaignListPage {
    this.cancelButton.should('be.visible').click();
    // Add assertion for navigation back or confirmation
    cy.url().should('include', '/campaigns'); // Or the specific path of campaign list
    return new CampaignListPage();
  }

  public fillCampaignForm(campaignData: CampaignFormData): void {
    this.fillCampaignName(campaignData.name);
    this.setBudget(campaignData.budget);
    this.setSchedule(campaignData.startDate, campaignData.endDate);
    this.selectAdNetwork(campaignData.network);
  }

  public verifyCampaignFormValues(campaignData: Partial<CampaignFormData>): void {
    if (campaignData.name !== undefined) {
      this.campaignNameInput.should('have.value', campaignData.name);
    }
    if (campaignData.budget !== undefined) {
      this.budgetInput.should('have.value', campaignData.budget.toString());
    }
    if (campaignData.startDate !== undefined) {
      this.startDateInput.should('have.value', campaignData.startDate);
    }
    if (campaignData.endDate !== undefined) {
      this.endDateInput.should('have.value', campaignData.endDate);
    }
    if (campaignData.network !== undefined) {
      this.adNetworkSelect.should('have.value', campaignData.network); // For select, checks selected option's value
    }
  }

  public getCampaignNameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.campaignNameInput;
  }

  public getBudgetInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.budgetInput;
  }

  public getStartDateInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.startDateInput;
  }

  public getEndDateInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.endDateInput;
  }

  public getAdNetworkSelect(): Cypress.Chainable<JQuery<HTMLSelectElement>> {
    return this.adNetworkSelect;
  }
}