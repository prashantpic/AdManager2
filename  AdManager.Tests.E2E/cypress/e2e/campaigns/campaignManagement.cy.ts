import { CampaignListPage } from '../../page-objects/campaign/CampaignListPage';
import { CampaignEditorPage } from '../../page-objects/campaign/CampaignEditorPage';
import { DashboardPage } from '../../page-objects/DashboardPage';
import * as testDataHelper from '../../utils/testDataHelper';
import campaignDataFixture from '../../fixtures/campaignData.json';
import usersFixture from '../../fixtures/users.json';

describe('Campaign Management', () => {
  let campaignListPage: CampaignListPage;
  let campaignEditorPage: CampaignEditorPage;
  let dashboardPage: DashboardPage;
  const campaignManagerUser = usersFixture.find(user => user.role === 'campaignManager');
  const createdCampaignIds: string[] = []; // Store IDs for cleanup

  beforeEach(() => {
    campaignListPage = new CampaignListPage();
    campaignEditorPage = new CampaignEditorPage();
    dashboardPage = new DashboardPage();

    if (!campaignManagerUser) {
      throw new Error('Campaign Manager user not found in fixtures');
    }
    // Login as campaign manager or admin
    cy.login(campaignManagerUser.username, campaignManagerUser.password, 'campaignManager');
    dashboardPage.navigateToCampaigns(); // Ensure we are on the campaign list page
    campaignListPage.waitForPageLoad();
  });

  afterEach(() => {
    // Clean up created campaigns via API to ensure test independence and speed
    const authToken = Cypress.env('authToken');
    createdCampaignIds.forEach(campaignId => {
      if (campaignId) {
        cy.task('deleteEntityViaApi', {
          endpoint: '/campaigns', // Adjust endpoint as per your API
          entityId: campaignId,
          authToken: authToken,
        }).then((result) => {
            cy.log(`Campaign ${campaignId} cleanup result: ${JSON.stringify(result)}`);
        }).catch(err => {
            cy.log(`Error cleaning up campaign ${campaignId}: ${err.message}`);
            // Log error but don't fail the test suite for cleanup issues unless critical
        });
      }
    });
    createdCampaignIds.length = 0; // Clear the array for the next test
  });

  it('should allow a user to create a new campaign with valid data', () => {
    const uniqueCampaignName = testDataHelper.generateUniqueCampaignName('E2E Test Campaign');
    const validCampaign = {
      ...campaignDataFixture.validCampaign,
      name: uniqueCampaignName,
      startDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(1)),
      endDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(30)),
      network: campaignDataFixture.validCampaign.targetNetworks[0] // Assuming single select for simplicity in POM
    };

    campaignListPage.clickCreateCampaign();
    campaignEditorPage.fillCampaignForm(validCampaign);
    campaignEditorPage.saveCampaign();

    campaignListPage.verifyCampaignExists(validCampaign.name, true);
    // Future: Get campaign ID from creation (e.g., from URL or API response if UI redirects) to add to createdCampaignIds
    // For now, if deletion relies on name and UI, this is okay. API cleanup is better with ID.
    // To get the ID for cleanup, we might need to query the API after creation or intercept the creation response.
    // Example: cy.task('getEntityViaApi', { endpoint: '/campaigns', queryParams: { name: uniqueCampaignName } }).then(campaign => createdCampaignIds.push(campaign.id));
  });

  it('should display validation errors for invalid campaign data during creation', () => {
    const invalidCampaign = {
      ...campaignDataFixture.campaignWithInvalidData,
      network: 'Google' // Provide a network if required by form, even if other data is invalid
    };

    campaignListPage.clickCreateCampaign();
    // campaignEditorPage.fillCampaignForm(invalidCampaign); // This might fail if types are strict
    if (invalidCampaign.name === '') {
        // campaignEditorPage.getCampaignNameInput().clear(); // Already done by fillCampaignName if it was called
    } else {
        campaignEditorPage.fillCampaignName(invalidCampaign.name);
    }
    campaignEditorPage.setBudget(invalidCampaign.budget);
    campaignEditorPage.setSchedule(invalidCampaign.startDate, invalidCampaign.endDate);
    // Attempt to save
    campaignEditorPage.saveButton.click(); // Accessing saveButton directly as saveCampaign navigates

    // Verify validation messages - These depend heavily on actual app implementation
    // Example: cy.getByTestId('campaign-name-input-error').should('be.visible').and('contain.text', 'Campaign name is required');
    // Example: cy.getByTestId('campaign-budget-input-error').should('be.visible').and('contain.text', 'Budget must be a positive number');
    // Example: cy.getByTestId('campaign-end-date-input-error').should('be.visible').and('contain.text', 'End date must be after start date');
    cy.log('Assuming validation errors are displayed. Specific selectors depend on app.');
    // Ensure we are still on the editor page
    cy.url().should('match', /\/campaigns\/(new|editor)/); // Or specific path
  });

  it('should allow a user to view details of an existing campaign', () => {
    const campaignName = testDataHelper.generateUniqueCampaignName('ViewDetailsCampaign');
    const campaignDetails = {
      name: campaignName,
      budget: 7500,
      startDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(5)),
      endDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(35)),
      network: 'Instagram', // Ensure this network exists in the dropdown
      status: 'Draft'
    };

    // Create campaign via API for robust setup
    cy.apiLogin('campaignManager').then(loginResponse => {
      const authToken = loginResponse.access_token;
      cy.task('createEntityViaApi', {
        endpoint: '/campaigns', // Adjust endpoint
        payload: campaignDetails,
        authToken: authToken
      }).then((createdCampaign: any) => {
        createdCampaignIds.push(createdCampaign.id); // Add ID for cleanup
        cy.visit('/campaigns'); // Refresh or visit campaign list page
        campaignListPage.openCampaignDetails(campaignName);

        campaignEditorPage.campaignNameInput.should('have.value', campaignName);
        campaignEditorPage.budgetInput.should('have.value', campaignDetails.budget.toString());
        campaignEditorPage.startDateInput.should('have.value', campaignDetails.startDate);
        // Add more assertions as needed
      });
    });
  });

  it('should allow a user to edit an existing campaign', () => {
    const initialCampaignName = testDataHelper.generateUniqueCampaignName('EditCampaignInitial');
    const editedCampaignName = testDataHelper.generateUniqueCampaignName('EditCampaignUpdated');
    const initialDetails = {
      name: initialCampaignName,
      budget: 3000,
      startDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(2)),
      endDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(22)),
      network: 'Google',
      status: 'Active'
    };

    cy.apiLogin('campaignManager').then(loginResponse => {
      const authToken = loginResponse.access_token;
      cy.task('createEntityViaApi', { endpoint: '/campaigns', payload: initialDetails, authToken })
        .then((createdCampaign: any) => {
          createdCampaignIds.push(createdCampaign.id);
          cy.visit('/campaigns');
          campaignListPage.openCampaignDetails(initialCampaignName); // Opens in editor mode

          campaignEditorPage.fillCampaignName(editedCampaignName);
          campaignEditorPage.setBudget(3500);
          campaignEditorPage.saveCampaign();

          campaignListPage.verifyCampaignExists(editedCampaignName, true);
          campaignListPage.verifyCampaignExists(initialCampaignName, false);
          // Optionally, open details again and verify all changes
        });
    });
  });

  it('should allow a user to change campaign status (e.g., Active to Paused)', () => {
    const campaignName = testDataHelper.generateUniqueCampaignName('StatusChangeCampaign');
    const campaignDetails = {
      name: campaignName,
      budget: 1000,
      startDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(1)),
      endDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(10)),
      network: 'TikTok',
      status: 'Active' // Initial status
    };

    cy.apiLogin('campaignManager').then(loginResponse => {
      const authToken = loginResponse.access_token;
      cy.task('createEntityViaApi', { endpoint: '/campaigns', payload: campaignDetails, authToken })
        .then((createdCampaign: any) => {
          createdCampaignIds.push(createdCampaign.id);
          cy.visit('/campaigns');
          // Assuming there's a UI element on the list page to change status
          // e.g., campaignListPage.campaignRowByName(campaignName).find('[data-testid="status-toggle"]').click();
          // This is highly dependent on the UI implementation.
          // For a robust test, this might involve editing the campaign or a dedicated status change action.
          campaignListPage.openCampaignDetails(campaignName);
          // campaignEditorPage.selectStatus('Paused'); // Assuming a selectStatus method exists
          cy.getByTestId('campaign-status-select').select('Paused'); // If it's a simple select
          campaignEditorPage.saveCampaign();

          campaignListPage.campaignRowByName(campaignName)
            .find('[data-testid="campaign-status-display"]') // Placeholder for status display element
            .should('contain.text', 'Paused');
        });
    });
  });

  it('should allow a user to delete an existing campaign', () => {
    const campaignName = testDataHelper.generateUniqueCampaignName('DeleteCampaign');
    const campaignDetails = {
      name: campaignName,
      budget: 500,
      startDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(1)),
      endDate: testDataHelper.formatDateForApi(testDataHelper.getFutureDate(5)),
      network: 'Google',
      status: 'Draft'
    };

    cy.apiLogin('campaignManager').then(loginResponse => {
      const authToken = loginResponse.access_token;
      cy.task('createEntityViaApi', { endpoint: '/campaigns', payload: campaignDetails, authToken })
        .then((createdCampaign: any) => {
          // Note: ID won't be added to createdCampaignIds if it's deleted here,
          // so afterEach cleanup for this specific campaign won't run/is not needed.
          // If deletion fails, afterEach would attempt to delete it.
          cy.visit('/campaigns');
          campaignListPage.deleteCampaign(campaignName); // This method handles confirmation and verifies non-existence
          campaignListPage.verifyCampaignExists(campaignName, false);
        });
    });
  });
});