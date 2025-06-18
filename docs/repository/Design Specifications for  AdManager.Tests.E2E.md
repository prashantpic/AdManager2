# Software Design Specification for AdManager.Tests.E2E (REPO-E2ETEST-005)

## 1. Introduction

### 1.1 Purpose
This document outlines the software design specifications for the End-to-End (E2E) test suite (`AdManager.Tests.E2E`) for the Ad Manager Platform. The primary purpose of this test suite is to validate complete user journeys, critical business processes, and the integration of various platform components, including User Interfaces (UIs) and backend APIs. This ensures overall system integrity and adherence to requirements.

### 1.2 Scope
The scope of this E2E test suite includes:
-   Testing merchant-facing UI flows developed with React/Next.js, primarily within the Merchant Ad Manager Portal.
-   Testing backend API integrations that span multiple microservices, particularly those critical for user journeys.
-   Validating authentication, campaign management, analytics reporting, and other core functionalities from an end-user perspective.
-   Ensuring tests are maintainable, reliable, and can be integrated into CI/CD pipelines.

### 1.3 Technologies
-   **UI E2E Testing Framework:** Cypress (v13.6.4 or later)
-   **API E2E Testing (within Cypress tasks or as standalone utility):** Jest (v29.7.0 or later) with Supertest
-   **Programming Language:** TypeScript (v5.3.3 or later)
-   **Runtime Environment:** Node.js (v20.11.1 LTS or later)

## 2. Test Architecture

The E2E test suite follows a structured approach leveraging Cypress's capabilities and the Page Object Model (POM) design pattern for UI tests. Backend API interactions for setup, teardown, or complex assertions are handled via Cypress tasks invoking Node.js scripts that may use Supertest/Jest.

The main components of the architecture are:
-   **Cypress Configuration:** Defines global settings, environment variables, and test execution parameters.
-   **Support Code:** Includes custom commands, global hooks, and type definitions to enhance and streamline test writing.
-   **Page Object Models (POMs):** Abstract UI elements and interactions for specific pages, improving test maintainability and readability.
-   **Test Fixtures:** Store static test data (e.g., user credentials, sample campaign data).
-   **Test Utilities:** Provide helper functions for dynamic test data generation and common API client interactions.
-   **Cypress Tasks:** Allow execution of Node.js code from Cypress tests, enabling backend API calls, database interactions, or other operations not directly supported by Cypress's browser environment.
-   **Test Specifications:** Contain the actual E2E test scenarios, written using Cypress and leveraging POMs, custom commands, and fixtures.

## 3. Detailed Design Specifications

This section details the design for each file within the `AdManager.Tests.E2E` repository.

### 3.1 Core Configuration Files

#### 3.1.1 `package.json`
-   **Purpose:** Manages project dependencies, scripts for test execution, and other development tasks.
-   **Key Dependencies:**
    -   `cypress`: Core Cypress framework.
    -   `typescript`: For writing tests in TypeScript.
    -   `@types/node`: Node.js type definitions.
    -   `supertest`: For making HTTP assertions in API tasks.
    -   `@types/supertest`: Type definitions for Supertest.
    -   `jest`: Test runner (can be used for API tasks or utility function testing).
    -   `@types/jest`: Type definitions for Jest.
    -   `ts-jest`: Jest preprocessor for TypeScript.
    -   Reporting libraries (e.g., `mochawesome`, `junit-reporter`) as dev dependencies.
-   **Key Scripts:**
    -   `"cy:open"`: `"cypress open"` (Opens Cypress Test Runner UI).
    -   `"cy:run"`: `"cypress run"` (Runs Cypress tests headlessly).
    -   `"cy:run:headed"`: `"cypress run --headed"` (Runs Cypress tests with browser visible).
    -   `"cy:run:spec <spec_path>"`: `"cypress run --spec <spec_path>"` (Runs a specific spec file).
    -   `"cy:report"`: Script to merge and generate reports (if using reporters like Mochawesome).
    -   `"test:api"`: (Optional) If standalone API tests using Jest/Supertest are implemented separate from Cypress tasks.
-   **Implemented Features:** Dependency Management, Test Execution Scripts.
-   **Requirement Mapping:** REQ-POA-022, 5.8 (Testability - Automated tests integration into CI/CD).

#### 3.1.2 `cypress.config.ts`
-   **Purpose:** Central Cypress configuration, defining how tests are discovered, run, and reported.
-   **Implementation Details:**
    typescript
    import { defineConfig } from 'cypress';
    import registerApiTasks from './cypress/tasks'; // Assuming tasks are in cypress/tasks/index.ts

    export default defineConfig({
      e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000', // Example, fetch from env
        specPattern: 'cypress/e2e/**/*.cy.ts',
        supportFile: 'cypress/support/e2e.ts',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true, // Enable video recording
        videosFolder: 'cypress/videos',
        screenshotsFolder: 'cypress/screenshots',
        screenshotOnRunFailure: true,
        reporter: 'spec', // Default, can be changed to mochawesome, junit etc.
        // reporterOptions: { // Example for mochawesome
        //   reporterEnabled: 'mochawesome',
        //   mochawesomeReporterOptions: {
        //     reportDir: 'cypress/reports/mochawesome',
        //     overwrite: false,
        //     html: true,
        //     json: true,
        //     charts: true,
        //   },
        // },
        setupNodeEvents(on, config) {
          // register tasks
          registerApiTasks(on, config); // Example registration
          // implement other node event listeners here
          return config;
        },
        env: { // Define environment variables accessible in tests via Cypress.env()
          API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001/api',
          // Add other env vars as needed
        },
        defaultCommandTimeout: 10000, // Increased default timeout
        pageLoadTimeout: 60000,
        requestTimeout: 15000,
        responseTimeout: 15000,
      },
      // Component testing configuration can be added here if needed in the future
      // component: {
      //   devServer: {
      //     framework: 'next',
      //     bundler: 'webpack',
      //   },
      // },
    });
    
-   **Implemented Features:** Cypress Global Configuration, E2E Test Environment Setup, Reporter Configuration, Task Registration.
-   **Requirement Mapping:** REQ-POA-022, 5.8, 3.2.7 (Maintainability - end-to-end tests).

#### 3.1.3 `tsconfig.json`
-   **Purpose:** Configuration for the TypeScript compiler, ensuring type safety and proper compilation of test code.
-   **Implementation Details:**
    json
    {
      "compilerOptions": {
        "target": "es2018",
        "module": "commonjs",
        "lib": ["es2018", "dom"],
        "strict": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "dist", // Optional: specify output directory if compiling
        "sourceMap": true, // Optional: for debugging
        "types": ["cypress", "node", "jest", "@testing-library/cypress"] // Include relevant types
      },
      "include": [
        "cypress/**/*.ts",
        "cypress/tasks/**/*.ts"
        // Add other paths if necessary
      ],
      "exclude": [
        "node_modules"
      ]
    }
    
-   **Implemented Features:** TypeScript Compilation Settings.
-   **Requirement Mapping:** 5.8.

#### 3.1.4 `.env.example`
-   **Purpose:** Template file showing necessary environment variables for running the tests. Not for storing actual secrets.
-   **Content Example:**
    env
    # Base URL for the Ad Manager Merchant Portal UI
    CYPRESS_BASE_URL=http://localhost:3000

    # User Credentials for testing different roles
    CYPRESS_ADMIN_USERNAME=admin@example.com
    CYPRESS_ADMIN_PASSWORD=your_admin_password
    CYPRESS_CAMPAIGN_MANAGER_USERNAME=manager@example.com
    CYPRESS_CAMPAIGN_MANAGER_PASSWORD=your_manager_password

    # Base URL for the Ad Manager Backend API
    API_BASE_URL=http://localhost:8080/api/v1

    # Other sensitive keys or config specific to test environment
    # EXAMPLE_API_KEY=your_api_key_for_testing_external_service
    
-   **Implemented Features:** Environment Configuration Guide.
-   **Requirement Mapping:** REQ-POA-022, 5.8.

### 3.2 Cypress Support Files

#### 3.2.1 `cypress/support/e2e.ts`
-   **Purpose:** This file is processed and loaded automatically before E2E test files. It's a great place to put global configuration and behavior that modifies Cypress.
-   **Implementation Details:**
    typescript
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
      // For now, let Cypress fail on uncaught exceptions unless specific ones are known
      return true;
    });
    
-   **Implemented Features:** Global Test Setup, Custom Command Imports.
-   **Requirement Mapping:** 3.2.7.

#### 3.2.2 `cypress/support/commands.ts`
-   **Purpose:** Contains custom Cypress commands to simplify common test steps and interactions with the application under test.
-   **Implementation Details (Examples):**
    typescript
    // Augment the Cypress Chainable interface in index.d.ts

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

      return cy.task('performApiLogin', selectedUser).then((token: any) => { // `any` to be replaced by actual token type
          // Store the token for subsequent API requests if needed directly via cy.request
          // e.g., window.localStorage.setItem('authToken', token.access_token);
          // Or use cy.wrap(token).as('authToken');
          Cypress.env('authToken', token.access_token); // Store in Cypress.env for cy.request
          return token;
      });
    });


    Cypress.Commands.add('logout', () => {
      // Example: Click logout button, verify navigation to login page
      cy.getByTestId('user-menu-button').click();
      cy.getByTestId('logout-button').click();
      cy.url().should('include', '/login');
    });

    Cypress.Commands.add('navigateTo', (pageUrl: string) => {
      cy.visit(pageUrl);
    });

    Cypress.Commands.add('createCampaignViaUI', (campaignDetails: { name: string; budget: number; startDate: string; endDate: string; network: string }) => {
        const campaignListPage = new CampaignListPage(); // Assuming POM definition
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
    
-   **Implemented Features:** Reusable Test Actions, UI Interaction Abstractions, API Interaction Wrappers.
-   **Requirement Mapping:** 3.2.7.
-   **Note:** `CampaignListPage` and `CampaignEditorPage` are illustrative POMs.

#### 3.2.3 `cypress/support/index.d.ts`
-   **Purpose:** Provides TypeScript type safety and autocompletion for custom Cypress commands.
-   **Implementation Details:**
    typescript
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
         * Custom command to log in a user via UI.
         * @example cy.login('admin@example.com', 'password123')
         * @example cy.login(undefined, undefined, 'campaignManager') // uses env vars
         */
        login(username?: string, password?: string, userRole?: 'admin' | 'campaignManager'): Chainable<void>;

        /**
         * Custom command to log in a user via API task.
         * Stores token in Cypress.env('authToken')
         * @example cy.apiLogin('admin').then(token => { ... })
         */
        apiLogin(userRole?: 'admin' | 'campaignManager'): Chainable<any>; // Replace 'any' with actual token response type

        /**
         * Custom command to log out the current user.
         * @example cy.logout()
         */
        logout(): Chainable<void>;

        /**
         * Custom command to navigate to a specific page URL.
         * @example cy.navigateTo('/dashboard')
         */
        navigateTo(pageUrl: string): Chainable<void>;

        /**
         * Custom command to create a campaign through the UI.
         * @example cy.createCampaignViaUI({ name: 'Test Campaign', ... })
         */
        createCampaignViaUI(campaignDetails: { name: string; budget: number; startDate: string; endDate: string; network: string }): Chainable<void>;
      }
    }
    
-   **Implemented Features:** Custom Command Typing.
-   **Requirement Mapping:** 3.2.7.

### 3.3 Test Data (Fixtures)

#### 3.3.1 `cypress/fixtures/users.json`
-   **Purpose:** Provides consistent user data for authentication tests and role-based access control verifications.
-   **Structure:**
    json
    [
      {
        "username": "admin@admanager.com",
        "password": "SecurePassword123!",
        "role": "merchantAdmin",
        "description": "Merchant Admin User"
      },
      {
        "username": "manager@admanager.com",
        "password": "AnotherSecurePassword456!",
        "role": "campaignManager",
        "description": "Campaign Manager User"
      },
      {
        "username": "invalid_user@admanager.com",
        "password": "InvalidPassword",
        "role": "unknown",
        "description": "User for testing invalid login"
      }
    ]
    
-   **Implemented Features:** User Test Data.
-   **Requirement Mapping:** 3.2.7, 7.6 (User Acceptance Testing - UAT test cases foundation).

#### 3.3.2 `cypress/fixtures/campaignData.json`
-   **Purpose:** Provides various campaign configurations for testing different scenarios of campaign lifecycle management.
-   **Structure (Example):**
    json
    {
      "validCampaign": {
        "name": "Summer Sale Campaign 2024",
        "budget": 5000,
        "startDate": "2024-07-01",
        "endDate": "2024-07-31",
        "targetNetworks": ["Google", "Instagram"],
        "status": "Draft"
      },
      "campaignForEditing": {
        "name": "Ongoing Q3 Promotion",
        "budget": 2500,
        "startDate": "2024-07-01",
        "endDate": "2024-09-30",
        "targetNetworks": ["TikTok"],
        "status": "Active"
      },
      "campaignWithInvalidData": {
        "name": "", // Invalid: empty name
        "budget": -100, // Invalid: negative budget
        "startDate": "2024-08-01",
        "endDate": "2024-07-15", // Invalid: end date before start date
        "targetNetworks": [],
        "status": "Draft"
      }
    }
    
-   **Implemented Features:** Campaign Test Data.
-   **Requirement Mapping:** 3.2.7, 7.6.

### 3.4 Page Object Models (POMs)

The Page Object Model (POM) design pattern will be used to create an abstraction layer for UI elements and interactions. Each page in the application will have a corresponding POM class.

#### 3.4.1 `cypress/page-objects/BasePage.ts`
-   **Purpose:** A base class for all POMs, containing common elements or functionalities.
-   **Implementation Details:**
    typescript
    export abstract class BasePage {
      protected pageUrl: string = '/'; // Default, should be overridden by subclasses

      visit(path?: string): void {
        cy.visit(path || this.pageUrl);
      }

      getPageTitle(): Cypress.Chainable<string> {
        return cy.title();
      }

      waitForPageLoad(): void {
        // Implement generic wait for page load, e.g., waiting for a common element
        // or using cy.location('pathname').should('eq', this.pageUrl)
        cy.get('body').should('be.visible'); // Basic check
      }

      // Common header/footer elements can be defined here
      getGlobalSearchInput() {
        return cy.getByTestId('global-search-input');
      }
    }
    
-   **Implemented Features:** Common Page Interactions.
-   **Requirement Mapping:** 3.2.7.

#### 3.4.2 `cypress/page-objects/LoginPage.ts`
-   **Purpose:** Encapsulates UI elements and interaction logic for the login page.
-   **Implementation Details:**
    typescript
    import { BasePage } from './BasePage';

    export class LoginPage extends BasePage {
      protected override pageUrl = '/login'; // Or your specific login path

      private get usernameInput() { return cy.getByTestId('username-input'); }
      private get passwordInput() { return cy.getByTestId('password-input'); }
      private get loginButton() { return cy.getByTestId('login-button'); }
      private get errorMessage() { return cy.getByTestId('error-message'); } // Assuming an error message element

      fillUsername(username: string): void {
        this.usernameInput.clear().type(username);
      }

      fillPassword(password: string): void {
        this.passwordInput.clear().type(password, { log: false });
      }

      submitLogin(): void {
        this.loginButton.click();
      }

      loginAs(username: string, password: string): void {
        this.visit();
        this.fillUsername(username);
        this.fillPassword(password);
        this.submitLogin();
      }

      getErrorMessageText(): Cypress.Chainable<string> {
        return this.errorMessage.invoke('text');
      }

      verifyErrorMessageIsVisible(message?: string): void {
        this.errorMessage.should('be.visible');
        if (message) {
            this.errorMessage.should('contain.text', message);
        }
      }
    }
    
-   **Implemented Features:** Login Page Interactions.
-   **Requirement Mapping:** 3.2.7, 7.6.

#### 3.4.3 `cypress/page-objects/DashboardPage.ts`
-   **Purpose:** Encapsulates UI elements and interaction logic for the main dashboard page after login.
-   **Implementation Details:**
    typescript
    import { BasePage } from './BasePage';

    export class DashboardPage extends BasePage {
      protected override pageUrl = '/dashboard'; // Or your specific dashboard path

      private get welcomeMessage() { return cy.getByTestId('dashboard-welcome-message'); }
      private get campaignsNavLink() { return cy.getByTestId('nav-campaigns-link'); }
      // Add other common dashboard elements

      getWelcomeMessageText(): Cypress.Chainable<string> {
        return this.welcomeMessage.invoke('text');
      }

      navigateToCampaigns(): void {
        this.campaignsNavLink.click();
        // Add assertion for campaign page URL or title
      }

      verifyUserIsOnDashboard(): void {
        cy.url().should('include', this.pageUrl);
        this.welcomeMessage.should('be.visible');
      }
    }
    
-   **Implemented Features:** Dashboard Page Interactions, Navigation.
-   **Requirement Mapping:** 3.2.7, 7.6.

#### 3.4.4 `cypress/page-objects/campaign/CampaignListPage.ts`
-   **Purpose:** Encapsulates UI elements and interaction logic for the page listing advertising campaigns.
-   **Implementation Details:**
    typescript
    import { BasePage } from '../BasePage';
    import { CampaignEditorPage } from './CampaignEditorPage';

    export class CampaignListPage extends BasePage {
      protected override pageUrl = '/campaigns'; // Or your specific campaigns list path

      private get createCampaignButton() { return cy.getByTestId('create-campaign-button'); }
      private get campaignTable() { return cy.getByTestId('campaign-list-table'); }
      private campaignRowByName(campaignName: string) {
        return this.campaignTable.contains('tr', campaignName);
      }

      clickCreateCampaign(): CampaignEditorPage {
        this.createCampaignButton.click();
        return new CampaignEditorPage();
      }

      verifyCampaignExists(campaignName: string, exists: boolean = true): void {
        if (exists) {
          this.campaignRowByName(campaignName).should('exist');
        } else {
          this.campaignRowByName(campaignName).should('not.exist');
        }
      }

      openCampaignDetails(campaignName: string): CampaignEditorPage { // Or a CampaignDetailsPage
        this.campaignRowByName(campaignName).find('[data-testid="view-campaign-button"]').click();
        return new CampaignEditorPage(); // Assuming edit page is also details page
      }

      deleteCampaign(campaignName: string): void {
        this.campaignRowByName(campaignName).find('[data-testid="delete-campaign-button"]').click();
        // Handle confirmation dialog if any
        cy.getByTestId('confirm-delete-button').click();
        this.verifyCampaignExists(campaignName, false);
      }
    }
    
-   **Implemented Features:** Campaign List Interactions.
-   **Requirement Mapping:** 3.2.7, 7.6.

#### 3.4.5 `cypress/page-objects/campaign/CampaignEditorPage.ts`
-   **Purpose:** Encapsulates UI elements and interaction logic for creating or editing an advertising campaign.
-   **Implementation Details:**
    typescript
    import { BasePage } from '../BasePage';
    import { CampaignListPage } from './CampaignListPage';

    export class CampaignEditorPage extends BasePage {
      // pageUrl might vary based on create vs edit, or use a dynamic one
      // protected override pageUrl = '/campaigns/editor';

      private get campaignNameInput() { return cy.getByTestId('campaign-name-input'); }
      private get budgetInput() { return cy.getByTestId('campaign-budget-input'); }
      private get startDateInput() { return cy.getByTestId('campaign-start-date-input'); }
      private get endDateInput() { return cy.getByTestId('campaign-end-date-input'); }
      private get adNetworkSelect() { return cy.getByTestId('ad-network-select'); } // Assuming a select element
      private get saveButton() { return cy.getByTestId('save-campaign-button'); }
      private get cancelButton() { return cy.getByTestId('cancel-campaign-button'); }

      fillCampaignName(name: string): void {
        this.campaignNameInput.clear().type(name);
      }

      setBudget(amount: number): void {
        this.budgetInput.clear().type(amount.toString());
      }

      setSchedule(startDate: string, endDate: string): void {
        // Logic to handle date pickers
        this.startDateInput.clear().type(startDate); // Simplified, real date pickers need more interaction
        this.endDateInput.clear().type(endDate);
      }

      selectAdNetwork(networkName: string): void {
        this.adNetworkSelect.select(networkName); // If it's a standard select
        // For custom dropdowns, more complex interaction might be needed
      }

      saveCampaign(): CampaignListPage {
        this.saveButton.click();
        return new CampaignListPage();
      }

      cancelEditing(): CampaignListPage {
        this.cancelButton.click();
        return new CampaignListPage();
      }

      fillCampaignForm(campaignData: { name: string; budget: number; startDate: string; endDate: string; network: string }): void {
        this.fillCampaignName(campaignData.name);
        this.setBudget(campaignData.budget);
        this.setSchedule(campaignData.startDate, campaignData.endDate);
        this.selectAdNetwork(campaignData.network);
      }
    }
    
-   **Implemented Features:** Campaign Form Interactions.
-   **Requirement Mapping:** 3.2.7, 7.6.

### 3.5 Cypress Tasks (for Backend Interactions)

#### 3.5.1 `cypress/tasks/index.ts`
-   **Purpose:** Barrel file for exporting Cypress tasks for easy registration in `cypress.config.ts`.
-   **Implementation Details:**
    typescript
    // cypress/tasks/index.ts
    import * as apiTasks from './apiTasks';
    // import * as dbTasks from './dbTasks'; // If you add database tasks

    const registerTasks = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
      on('task', {
        ...apiTasks,
        // ...dbTasks,
        log(message: string | object) { // Example generic task
          console.log(message);
          return null;
        },
        table(message: any[][]) { // Example task for logging tables
          console.table(message);
          return null;
        }
      });
    };

    export default registerTasks;
    
-   **Implemented Features:** Task Aggregation.
-   **Requirement Mapping:** 3.2.7.

#### 3.5.2 `cypress/tasks/apiTasks.ts`
-   **Purpose:** Defines Node.js tasks for backend API interactions using Supertest/Jest, callable from Cypress tests. Primarily for test data setup/teardown or complex API verifications.
-   **Implementation Details (Illustrative using Supertest):**
    typescript
    // cypress/tasks/apiTasks.ts
    import supertest from 'supertest';

    // API_BASE_URL should ideally come from config passed to tasks or env var
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';
    const request = supertest(API_BASE_URL);

    interface ApiCallOptions {
      endpoint: string;
      payload?: object;
      authToken?: string;
      entityId?: string;
    }

    export const createEntityViaApi = async ({ endpoint, payload, authToken }: ApiCallOptions): Promise<object> => {
      console.log(`[API Task] Creating entity at ${endpoint}`);
      let req = request.post(endpoint).send(payload);
      if (authToken) {
        req = req.set('Authorization', `Bearer ${authToken}`);
      }
      const response = await req;
      if (response.status >= 400) {
        console.error('[API Task] Error creating entity:', response.body);
        throw new Error(`API Error (${response.status}): ${JSON.stringify(response.body)}`);
      }
      return response.body;
    };

    export const deleteEntityViaApi = async ({ endpoint, entityId, authToken }: ApiCallOptions): Promise<object> => {
      console.log(`[API Task] Deleting entity ${entityId} at ${endpoint}/${entityId}`);
      let req = request.delete(`${endpoint}/${entityId}`);
      if (authToken) {
        req = req.set('Authorization', `Bearer ${authToken}`);
      }
      const response = await req;
      if (response.status >= 400 && response.status !== 404) { // Allow 404 if already deleted
        console.error('[API Task] Error deleting entity:', response.body);
        throw new Error(`API Error (${response.status}): ${JSON.stringify(response.body)}`);
      }
      return response.body;
    };

    export const getEntityViaApi = async ({ endpoint, entityId, authToken }: ApiCallOptions): Promise<object | null> => {
        console.log(`[API Task] Getting entity ${entityId} from ${endpoint}/${entityId}`);
        let req = request.get(`${endpoint}/${entityId}`);
        if (authToken) {
            req = req.set('Authorization', `Bearer ${authToken}`);
        }
        const response = await req;
        if (response.status === 404) return null;
        if (response.status >= 400) {
            console.error('[API Task] Error getting entity:', response.body);
            throw new Error(`API Error (${response.status}): ${JSON.stringify(response.body)}`);
        }
        return response.body;
    };

    export const performApiLogin = async (userCredentials: { username: string, password: string }): Promise<any> => { // Replace any with token response type
        console.log(`[API Task] Logging in user ${userCredentials.username}`);
        const response = await request
            .post('/auth/login') // Adjust to your actual auth endpoint
            .send(userCredentials);

        if (response.status >= 400) {
            console.error('[API Task] Login failed:', response.body);
            throw new Error(`API Login Error (${response.status}): ${JSON.stringify(response.body)}`);
        }
        console.log('[API Task] Login successful, token obtained.');
        return response.body; // Assuming body contains { access_token: '...' }
    };

    // Add other API tasks as needed
    
-   **Implemented Features:** Backend API Interactions via Tasks, Test Data Setup/Teardown via API.
-   **Requirement Mapping:** 3.2.7.

### 3.6 Utility Files

#### 3.6.1 `cypress/utils/apiClient.ts`
-   **Purpose:** Centralizes API request logic for `cy.request`, handling base URLs, common headers, and authentication tokens.
-   **Implementation Details:**
    typescript
    // cypress/utils/apiClient.ts

    const getApiBaseUrl = () => Cypress.env('API_BASE_URL') || 'http://localhost:8080/api/v1';

    interface RequestOptions {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      url: string;
      body?: any;
      token?: string | null; // Explicitly allow null
      headers?: { [key: string]: string };
      failOnStatusCode?: boolean;
    }

    const makeRequest = (options: RequestOptions): Cypress.Chainable<Cypress.Response<any>> => {
      const requestUrl = `${getApiBaseUrl()}${options.url.startsWith('/') ? options.url : '/' + options.url}`;
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const authToken = options.token ?? Cypress.env('authToken'); // Use passed token or env token

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      return cy.request({
        method: options.method,
        url: requestUrl,
        body: options.body,
        headers: headers,
        failOnStatusCode: options.failOnStatusCode !== undefined ? options.failOnStatusCode : true,
      });
    };

    export const apiClient = {
      get: (url: string, token: string | null = null, headers?: { [key: string]: string }) =>
        makeRequest({ method: 'GET', url, token, headers }),
      post: (url: string, body: any, token: string | null = null, headers?: { [key: string]: string }) =>
        makeRequest({ method: 'POST', url, body, token, headers }),
      put: (url: string, body: any, token: string | null = null, headers?: { [key: string]: string }) =>
        makeRequest({ method: 'PUT', url, body, token, headers }),
      delete: (url: string, token: string | null = null, headers?: { [key: string]: string }) =>
        makeRequest({ method: 'DELETE', url, token, headers }),
      patch: (url: string, body: any, token: string | null = null, headers?: { [key: string]: string }) =>
        makeRequest({ method: 'PATCH', url, body, token, headers }),
    };
    
-   **Implemented Features:** API Request Abstraction.
-   **Requirement Mapping:** 3.2.7.

#### 3.6.2 `cypress/utils/testDataHelper.ts`
-   **Purpose:** Provides utilities to create dynamic and unique data for test cases, reducing hardcoding and test flakiness.
-   **Implementation Details:**
    typescript
    // cypress/utils/testDataHelper.ts

    export const generateUniqueString = (prefix: string = 'test'): string => {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    };

    export const generateUniqueCampaignName = (prefix: string = 'Campaign'): string => {
      return generateUniqueString(prefix);
    };

    export const getRandomEmail = (domain: string = 'e2etest.com'): string => {
      return `${generateUniqueString('user')}@${domain}`;
    };

    export const formatDateForApi = (date: Date): string => {
      // Example: YYYY-MM-DD format
      return date.toISOString().split('T')[0];
    };

    export const getFutureDate = (days: number): Date => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    };

    export const getPastDate = (days: number): Date => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    };
    
-   **Implemented Features:** Dynamic Test Data Generation.
-   **Requirement Mapping:** 3.2.7.

### 3.7 Test Specification Files (`cypress/e2e/**/*.cy.ts`)

#### 3.7.1 General Structure
All spec files will follow a standard structure:
-   Imports for POMs, utility functions, and fixture types.
-   `describe` or `context` blocks for grouping related tests.
-   `beforeEach` or `before` hooks for setup (e.g., login, data seeding via API tasks).
-   `it` blocks for individual test cases, with descriptive names.
-   `afterEach` or `after` hooks for cleanup (e.g., deleting test data via API tasks).
-   Assertions using Cypress's built-in assertion library (`should`, `expect`).

#### 3.7.2 `cypress/e2e/auth/login.cy.ts`
-   **Purpose:** Validates the authentication flows of the Ad Manager platform.
-   **Test Scenarios:**
    1.  `should allow a merchant admin to log in successfully`
        -   Uses `users.json` fixture for admin credentials.
        -   Uses `LoginPage` and `DashboardPage` POMs.
        -   Verifies navigation to the dashboard and presence of key dashboard elements.
    2.  `should allow a campaign manager to log in successfully`
        -   Uses `users.json` fixture for campaign manager credentials.
        -   Verifies navigation to the dashboard (or specific landing page for role).
    3.  `should display an error message for invalid credentials`
        -   Uses `users.json` for invalid user credentials.
        -   Verifies appropriate error message is displayed on `LoginPage`.
    4.  `should prevent access to protected pages without login`
        -   Attempts to visit a protected URL (e.g., `/dashboard`) directly.
        -   Verifies redirection to the login page.
    5.  `should allow a logged-in user to log out`
        -   Logs in a user.
        -   Uses `DashboardPage` (or a global logout element) to perform logout.
        -   Verifies navigation back to the `LoginPage`.
-   **Implemented Features:** Login Success Test, Login Failure Test (Invalid Credentials), Logout Test, Unauthorized Access Test.
-   **Requirement Mapping:** 3.2.7, 7.6.

#### 3.7.3 `cypress/e2e/campaigns/campaignManagement.cy.ts`
-   **Purpose:** Validates the full lifecycle of campaign management through the UI.
-   **Test Scenarios:**
    -   **Prerequisites:** `beforeEach` hook to log in as `merchantAdmin` or `campaignManager` (use `cy.login()` or `cy.apiLogin()` followed by `cy.visit('/dashboard')`).
    1.  `should allow a user to create a new campaign with valid data`
        -   Uses `CampaignListPage` and `CampaignEditorPage` POMs.
        -   Uses `campaignData.json` (validCampaign) and `testDataHelper` for unique name.
        -   Fills all required fields, saves, and verifies campaign appears in the list.
    2.  `should display validation errors for invalid campaign data during creation`
        -   Uses `campaignData.json` (campaignWithInvalidData).
        -   Attempts to save and verifies appropriate validation messages for each invalid field.
    3.  `should allow a user to view details of an existing campaign`
        -   Prerequisite: Create a campaign (via UI or API task).
        -   Navigates from `CampaignListPage` to `CampaignEditorPage` (view/edit mode).
        -   Verifies displayed details match the created campaign.
    4.  `should allow a user to edit an existing campaign`
        -   Prerequisite: Create a campaign.
        -   Modifies fields (e.g., budget, name, status).
        -   Saves and verifies changes are reflected in the `CampaignListPage` and/or detail view.
    5.  `should allow a user to change campaign status (e.g., Draft to Active, Active to Paused)`
        -   Prerequisite: Create a campaign.
        -   Interacts with status change UI elements.
        -   Verifies the status update.
    6.  `should allow a user to delete an existing campaign`
        -   Prerequisite: Create a campaign.
        -   Uses `CampaignListPage` to delete the campaign.
        -   Handles confirmation dialogs.
        -   Verifies the campaign is removed from the list.
    -   **Cleanup:** `afterEach` or `after` hook to delete campaigns created during tests using API tasks for reliability and speed.
-   **Implemented Features:** Campaign Creation, Campaign Editing, Campaign Deletion, Campaign Status Change, Input Validation.
-   **Requirement Mapping:** 3.2.7, 7.6, REQ-POA-022.

#### 3.7.4 `cypress/e2e/analytics/reporting.cy.ts`
-   **Purpose:** Validates that merchants can view and interact with advertising performance reports.
-   **Test Scenarios:**
    -   **Prerequisites:**
        -   `beforeEach` hook for login.
        -   Requires test data: at least one campaign with associated (mocked or seeded) performance metrics (impressions, clicks, spend, conversions). This data should be set up via API tasks.
    1.  `should display key performance metrics for a campaign on the analytics dashboard`
        -   Navigates to the analytics/reporting section.
        -   Selects/finds the test campaign.
        -   Verifies display of ROAS, CPA, spend, impressions, clicks, conversions matching the seeded data.
    2.  `should allow filtering report data by date range`
        -   Applies a date filter.
        -   Verifies the displayed data updates according to the filter and matches expected subset of seeded data.
    3.  `should allow filtering report data by ad network (if applicable)`
        -   If data is seeded for multiple networks for a campaign.
        -   Applies ad network filter.
        -   Verifies data specific to that network is shown.
    4.  `(Optional) should allow exporting report data`
        -   If UI supports export (CSV/PDF).
        -   Clicks export button.
        -   Verifies a file is downloaded (Cypress might need a task for verifying file content).
-   **Implemented Features:** View Campaign Performance Metrics, Filter Reports by Date/Network, Export Report Data (if UI supports).
-   **Requirement Mapping:** 3.2.7, 7.6, REQ-POA-022.

## 4. API E2E Test Strategy (Leveraging Cypress Tasks and Supertest/Jest)

While the primary focus of this repository is UI E2E testing with Cypress, backend API integrations that form part of a user journey or critical business process will be tested. This is often achieved by:
1.  **Direct API calls via `cy.request()`:** For simple GET requests or state verification, wrapped by `utils/apiClient.ts`.
2.  **Cypress Tasks (`cypress/tasks/apiTasks.ts`):** For more complex API interactions:
    -   Test data setup (e.g., creating prerequisite entities before a UI test).
    -   Test data teardown (e.g., cleaning up entities after a test).
    -   Verifying backend state changes that are difficult or slow to check via UI.
    -   Performing sequences of API calls that constitute an integration test.
    -   These tasks will use `supertest` for making HTTP requests and `jest` assertion syntax (or simple `expect`) within the Node.js environment of the task.

This approach keeps the E2E tests focused on user scenarios while allowing robust interaction with the backend where necessary.

## 5. Reporting and CI/CD Integration

-   **Reporting:** `cypress.config.ts` will be configured with a reporter (e.g., `mochawesome` for HTML reports, `junit` for CI systems like Jenkins/GitLab CI). Scripts in `package.json` will facilitate report generation.
-   **Screenshots and Videos:** Cypress will be configured to automatically capture screenshots on test failure and record videos of test runs, aiding in debugging.
-   **CI/CD:**
    -   The `package.json` scripts (`cy:run`) will be used in CI/CD pipelines (e.g., GitHub Actions, Jenkins, GitLab CI).
    -   Environment variables (base URLs, credentials) will be securely passed to the CI runner.
    -   Test reports (JUnit XML, HTML) will be published as artifacts by the CI/CD pipeline.
    -   Tests are expected to be run as part of the deployment pipeline to catch regressions. (REQ-POA-022, 5.8)

## 6. Maintainability and Best Practices

-   **Selectors:** Prioritize `data-testid` attributes for UI element selection to make tests resilient to markup changes.
-   **Test Naming:** Test descriptions (`describe`, `it`) should be clear, concise, and reflect the user story or functionality being tested.
-   **Test Atomicity:** Aim for independent test cases where possible. Avoid chaining tests that depend on the success of previous ones within the same spec file unless explicitly testing a sequence.
-   **Avoid Fixed Waits:** Use Cypress's built-in retry-ability and assertions on UI state/element visibility instead of `cy.wait(<fixed_time>)`.
-   **Code Reusability:** Leverage custom commands, POMs, and utility functions extensively.
-   **Data Management:** Implement robust strategies for test data setup and teardown, preferably using API tasks to ensure a clean state and speed up execution.
-   **Regular Review:** Periodically review and refactor tests to maintain their effectiveness and address flakiness.

## 7. Future Considerations
-   Integration with visual regression testing tools.
-   Performance testing integration (e.g., Lighthouse assertions via Cypress tasks).
-   Expansion to cover more complex user roles and permissions scenarios.
-   More granular API E2E tests if deemed necessary outside of Cypress task context.
-   Parallel test execution strategies in CI/CD.

This SDS provides a comprehensive plan for developing and maintaining the E2E test suite for the Ad Manager Platform, ensuring high quality and reliability of the application.