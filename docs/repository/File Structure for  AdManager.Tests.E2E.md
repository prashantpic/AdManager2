# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies (Cypress, TypeScript, Supertest, Jest, etc.), and scripts for running E2E tests.  
**Template:** Node.js Package Manifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** .  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Test Execution Scripts
    
**Requirement Ids:**
    
    - REQ-POA-022
    - 5.8
    
**Purpose:** Manages project dependencies and provides command-line scripts for test execution and other development tasks.  
**Logic Description:** Include devDependencies for 'cypress', 'typescript', '@types/node', 'supertest', '@types/supertest', 'jest', '@types/jest', 'ts-jest'. Define scripts like 'cy:open', 'cy:run', 'cy:run:headed', 'cy:report' (if using a custom reporter merge). Ensure scripts support environment variable passthrough for CI/CD.  
**Documentation:**
    
    - **Summary:** Standard package.json file for managing Node.js project dependencies and scripts.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** cypress.config.ts  
**Description:** Main configuration file for the Cypress E2E testing framework.  
**Template:** Cypress Configuration  
**Dependancy Level:** 0  
**Name:** cypress.config  
**Type:** Configuration  
**Relative Path:** .  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Cypress Global Configuration
    - E2E Test Environment Setup
    - Reporter Configuration
    - Task Registration
    
**Requirement Ids:**
    
    - REQ-POA-022
    - 5.8
    - 3.2.7
    
**Purpose:** Configures Cypress behavior, including base URL, viewport settings, environment variables, and test file patterns.  
**Logic Description:** Use 'defineConfig' from Cypress. Configure the 'e2e' block: set 'baseUrl' (e.g., from an environment variable), 'specPattern' (e.g., 'cypress/e2e/**/*.cy.ts'), 'supportFile' (e.g., 'cypress/support/e2e.ts'). Define default 'viewportWidth' and 'viewportHeight'. Configure 'reporter' (e.g., 'junit' or 'mochawesome') and 'reporterOptions'. Setup Node events to register tasks from 'cypress/tasks/index.ts'. Include 'video' and 'screenshotsFolder' configurations. Define common environment variables if needed.  
**Documentation:**
    
    - **Summary:** Central Cypress configuration, defining how tests are discovered, run, and reported.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler configuration for the E2E test project.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** .  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Settings
    
**Requirement Ids:**
    
    - 5.8
    
**Purpose:** Specifies root files and compiler options required to compile the TypeScript-based test project.  
**Logic Description:** Configure 'compilerOptions': 'target' (e.g., 'es2018'), 'module' (e.g., 'commonjs'), 'lib' (e.g., ['es2018', 'dom']), 'strict' (true), 'esModuleInterop' (true), 'resolveJsonModule' (true), 'skipLibCheck' (true), 'forceConsistentCasingInFileNames' (true), 'types' (include 'cypress', 'node', 'jest'). Use 'include' to specify 'cypress/**/*.ts' and any other TypeScript files (e.g., 'cypress/tasks/**/*.ts').  
**Documentation:**
    
    - **Summary:** Configuration for the TypeScript compiler, ensuring type safety and proper compilation of test code.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** .env.example  
**Description:** Example environment variable file template for local development.  
**Template:** Environment Variable Template  
**Dependancy Level:** 0  
**Name:** .env.example  
**Type:** Configuration  
**Relative Path:** .  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Environment Configuration Guide
    
**Requirement Ids:**
    
    - REQ-POA-022
    - 5.8
    
**Purpose:** Provides a template for required environment variables. Actual values should be in a .env file (gitignored).  
**Logic Description:** List environment variables like: CYPRESS_BASE_URL, CYPRESS_ADMIN_USERNAME, CYPRESS_ADMIN_PASSWORD, CYPRESS_CAMPAIGN_MANAGER_USERNAME, CYPRESS_CAMPAIGN_MANAGER_PASSWORD, API_BASE_URL. Provide placeholder values or descriptions for each.  
**Documentation:**
    
    - **Summary:** Template file showing necessary environment variables for running the tests. Not for storing actual secrets.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** cypress/support/e2e.ts  
**Description:** Global setup file for Cypress E2E tests. Loaded before every spec file.  
**Template:** Cypress Support File  
**Dependancy Level:** 1  
**Name:** e2e  
**Type:** SupportCode  
**Relative Path:** cypress/support  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Global Test Setup
    - Custom Command Imports
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Imports custom commands and applies global configurations or hooks for all E2E tests.  
**Logic Description:** Import './commands.ts'. Optionally, import other global helper modules. Define global 'beforeEach' or 'afterEach' hooks if necessary (e.g., for consistent login/logout, resetting application state via API calls). Handle uncaught exceptions if needed for specific test scenarios.  
**Documentation:**
    
    - **Summary:** This file is processed and loaded automatically before your E2E test files. It's a great place to put global configuration and behavior that modifies Cypress.
    
**Namespace:** AdManager.Tests.E2E.Support  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/support/commands.ts  
**Description:** Defines custom Cypress commands for reusable actions across tests.  
**Template:** Cypress Custom Commands  
**Dependancy Level:** 1  
**Name:** commands  
**Type:** SupportCode  
**Relative Path:** cypress/support  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** login  
**Parameters:**
    
    - username: string
    - password: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** logout  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** navigateTo  
**Parameters:**
    
    - pageUrl: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createCampaignViaUI  
**Parameters:**
    
    - campaignDetails: object
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getByTestId  
**Parameters:**
    
    - testId: string
    
**Return Type:** Chainable<JQuery<HTMLElement>>  
**Attributes:** public  
    - **Name:** apiLogin  
**Parameters:**
    
    - userType: string
    
**Return Type:** Chainable<Response<any>>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Reusable Test Actions
    - UI Interaction Abstractions
    - API Interaction Wrappers
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Extends Cypress's command API with domain-specific, reusable functions to improve test readability and maintainability.  
**Logic Description:** Use 'Cypress.Commands.add' to define custom commands. Example: 'login' command interacts with LoginPage POM elements. 'navigateTo' uses 'cy.visit()'. 'getByTestId' provides a convenient way to select elements using 'data-testid' attributes. 'apiLogin' could call a task or use cy.request() to log in via API and set auth tokens. Ensure proper TypeScript typings for custom commands by augmenting the 'Cypress.Chainable' interface in a '.d.ts' file (e.g., 'cypress/support/index.d.ts').  
**Documentation:**
    
    - **Summary:** Contains custom Cypress commands to simplify common test steps and interactions with the application under test.
    
**Namespace:** AdManager.Tests.E2E.Support.Commands  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/support/index.d.ts  
**Description:** TypeScript definition file for augmenting Cypress types with custom commands.  
**Template:** TypeScript Definition File  
**Dependancy Level:** 1  
**Name:** index.d  
**Type:** TypeDefinition  
**Relative Path:** cypress/support  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Custom Command Typing
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Provides TypeScript type safety and autocompletion for custom Cypress commands defined in commands.ts.  
**Logic Description:** Declare a namespace 'Cypress'. Inside it, declare an interface 'Chainable<Subject>' and add signatures for all custom commands (e.g., 'login(username: string, password: string): Chainable<void>;').  
**Documentation:**
    
    - **Summary:** TypeScript declaration file to extend Cypress's built-in types with custom commands, enabling better developer experience with TypeScript.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/fixtures/users.json  
**Description:** Stores test user credentials and roles for various test scenarios.  
**Template:** JSON Fixture  
**Dependancy Level:** 3  
**Name:** users  
**Type:** TestData  
**Relative Path:** cypress/fixtures  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Test Data
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Provides consistent user data for authentication tests and role-based access control verifications.  
**Logic Description:** JSON array of user objects, each with properties like 'username', 'password', 'role' (e.g., 'merchantAdmin', 'campaignManager'), and any other relevant user attributes for testing. Example: [{ "username": "admin@example.com", "password": "securePassword123", "role": "merchantAdmin" }].  
**Documentation:**
    
    - **Summary:** Contains mock user data used across various E2E tests, particularly for login and permission-based scenarios.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** TestData
    
- **Path:** cypress/fixtures/campaignData.json  
**Description:** Stores sample campaign data for testing campaign creation and management.  
**Template:** JSON Fixture  
**Dependancy Level:** 3  
**Name:** campaignData  
**Type:** TestData  
**Relative Path:** cypress/fixtures  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Test Data
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Provides various campaign configurations for testing different scenarios of campaign lifecycle management.  
**Logic Description:** JSON object or array of objects, each representing a campaign with properties like 'name', 'budget', 'startDate', 'endDate', 'targetNetworks', 'status'. Include valid and invalid data sets for comprehensive testing.  
**Documentation:**
    
    - **Summary:** Sample data for creating and managing advertising campaigns during E2E tests.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** TestData
    
- **Path:** cypress/page-objects/BasePage.ts  
**Description:** Base class for all Page Object Models, containing common elements or functionalities.  
**Template:** TypeScript Class  
**Dependancy Level:** 2  
**Name:** BasePage  
**Type:** PageObjectModel  
**Relative Path:** cypress/page-objects  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    - **Name:** pageTitleSelector  
**Type:** string  
**Attributes:** protected  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** visit  
**Parameters:**
    
    - path: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getPageTitle  
**Parameters:**
    
    
**Return Type:** Chainable<string>  
**Attributes:** public  
    - **Name:** waitForPageLoad  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Common Page Interactions
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Provides common functionalities and locators shared across multiple page objects to reduce code duplication.  
**Logic Description:** Define common methods like 'visit(path)', 'getPageTitle()'. May include locators for global elements like navigation bars, footers, or common notification messages. Other POMs will extend this class.  
**Documentation:**
    
    - **Summary:** A base page object class containing shared logic and elements for other page objects.
    
**Namespace:** AdManager.Tests.E2E.PageObjects  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/page-objects/LoginPage.ts  
**Description:** Page Object Model for the Ad Manager Login page.  
**Template:** TypeScript Class  
**Dependancy Level:** 2  
**Name:** LoginPage  
**Type:** PageObjectModel  
**Relative Path:** cypress/page-objects  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    - **Name:** usernameInput  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** passwordInput  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** loginButton  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** errorMessage  
**Type:** string  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** visit  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** fillUsername  
**Parameters:**
    
    - username: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** fillPassword  
**Parameters:**
    
    - password: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** submitLogin  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getErrorMessageText  
**Parameters:**
    
    
**Return Type:** Chainable<string>  
**Attributes:** public  
    - **Name:** loginAs  
**Parameters:**
    
    - username: string
    - password: string
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Login Page Interactions
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Encapsulates UI elements and interaction logic for the login page, promoting test maintainability.  
**Logic Description:** Extends BasePage. Define selectors (e.g., using 'data-testid') for username field, password field, login button, error messages. Implement methods to interact with these elements: 'fillUsername', 'fillPassword', 'submitLogin'. Add assertions or checks within these methods or in specific verification methods.  
**Documentation:**
    
    - **Summary:** Represents the login page, providing methods to interact with its elements for testing authentication flows.
    
**Namespace:** AdManager.Tests.E2E.PageObjects  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/page-objects/DashboardPage.ts  
**Description:** Page Object Model for the Ad Manager Dashboard page.  
**Template:** TypeScript Class  
**Dependancy Level:** 2  
**Name:** DashboardPage  
**Type:** PageObjectModel  
**Relative Path:** cypress/page-objects  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    - **Name:** welcomeMessage  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** campaignsNavLink  
**Type:** string  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** visit  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getWelcomeMessageText  
**Parameters:**
    
    
**Return Type:** Chainable<string>  
**Attributes:** public  
    - **Name:** navigateToCampaigns  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** verifyUserIsOnDashboard  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Dashboard Page Interactions
    - Navigation
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Encapsulates UI elements and interaction logic for the main dashboard page after login.  
**Logic Description:** Extends BasePage. Define selectors for key dashboard elements (e.g., welcome message, navigation links to Campaigns, Analytics). Implement methods for verifying dashboard content and navigating to other sections.  
**Documentation:**
    
    - **Summary:** Represents the main dashboard, providing methods for common interactions and navigation from this page.
    
**Namespace:** AdManager.Tests.E2E.PageObjects  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/page-objects/campaign/CampaignListPage.ts  
**Description:** Page Object Model for the Campaign List page.  
**Template:** TypeScript Class  
**Dependancy Level:** 2  
**Name:** CampaignListPage  
**Type:** PageObjectModel  
**Relative Path:** cypress/page-objects/campaign  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    - **Name:** createCampaignButton  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** campaignTable  
**Type:** string  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** visit  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** clickCreateCampaign  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** verifyCampaignExists  
**Parameters:**
    
    - campaignName: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** openCampaignDetails  
**Parameters:**
    
    - campaignName: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** deleteCampaign  
**Parameters:**
    
    - campaignName: string
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Campaign List Interactions
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Encapsulates UI elements and interaction logic for the page listing advertising campaigns.  
**Logic Description:** Extends BasePage. Define selectors for the create campaign button, campaign table/list, individual campaign rows, and actions like edit/delete. Implement methods for common actions such as initiating campaign creation, verifying a campaign's presence, and navigating to a campaign's detail page.  
**Documentation:**
    
    - **Summary:** Represents the campaign listing page, providing methods to interact with the list of campaigns.
    
**Namespace:** AdManager.Tests.E2E.PageObjects.Campaign  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/page-objects/campaign/CampaignEditorPage.ts  
**Description:** Page Object Model for the Campaign Create/Edit page.  
**Template:** TypeScript Class  
**Dependancy Level:** 2  
**Name:** CampaignEditorPage  
**Type:** PageObjectModel  
**Relative Path:** cypress/page-objects/campaign  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    - **Name:** campaignNameInput  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** budgetInput  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** startDateInput  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** endDateInput  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** adNetworkSelect  
**Type:** string  
**Attributes:** private readonly  
    - **Name:** saveButton  
**Type:** string  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** fillCampaignName  
**Parameters:**
    
    - name: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** setBudget  
**Parameters:**
    
    - amount: number
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** setSchedule  
**Parameters:**
    
    - startDate: string
    - endDate: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** selectAdNetwork  
**Parameters:**
    
    - networkName: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** saveCampaign  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** fillCampaignForm  
**Parameters:**
    
    - campaignData: object
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Campaign Form Interactions
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Encapsulates UI elements and interaction logic for creating or editing an advertising campaign.  
**Logic Description:** Extends BasePage. Define selectors for all form fields (name, budget, schedule, ad networks, status, etc.) and action buttons (save, cancel). Implement methods to fill form fields, select options, and submit the form.  
**Documentation:**
    
    - **Summary:** Represents the campaign creation/editing form, providing methods to populate and submit campaign details.
    
**Namespace:** AdManager.Tests.E2E.PageObjects.Campaign  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/tasks/index.ts  
**Description:** Barrel file for exporting Cypress tasks to be registered in cypress.config.ts.  
**Template:** TypeScript Module  
**Dependancy Level:** 1  
**Name:** tasks.index  
**Type:** SupportCode  
**Relative Path:** cypress/tasks  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Task Aggregation
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Exports all defined Cypress task modules for easy registration in the main Cypress configuration.  
**Logic Description:** Import functions/objects from other task files (e.g., 'apiTasks.ts') and export them as a single object or individual named exports. This allows 'cypress.config.ts' to import all tasks from one place.  
**Documentation:**
    
    - **Summary:** Centralizes the export of all custom Node.js tasks available to Cypress tests.
    
**Namespace:** AdManager.Tests.E2E.Tasks  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/tasks/apiTasks.ts  
**Description:** Defines Node.js tasks for backend API interactions using Supertest/Jest, callable from Cypress tests.  
**Template:** TypeScript Module  
**Dependancy Level:** 1  
**Name:** apiTasks  
**Type:** SupportCode  
**Relative Path:** cypress/tasks  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - TaskRunner
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createEntityViaApi  
**Parameters:**
    
    - endpoint: string
    - payload: object
    - authToken?: string
    
**Return Type:** Promise<object>  
**Attributes:** public  
    - **Name:** deleteEntityViaApi  
**Parameters:**
    
    - endpoint: string
    - entityId: string
    - authToken?: string
    
**Return Type:** Promise<object>  
**Attributes:** public  
    - **Name:** getEntityViaApi  
**Parameters:**
    
    - endpoint: string
    - entityId: string
    - authToken?: string
    
**Return Type:** Promise<object>  
**Attributes:** public  
    - **Name:** performApiLogin  
**Parameters:**
    
    - userCredentials: object
    
**Return Type:** Promise<string>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Backend API Interactions via Tasks
    - Test Data Setup/Teardown via API
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Enables Cypress tests to execute backend API calls through Node.js, leveraging libraries like Supertest for complex interactions or setup not feasible with cy.request directly.  
**Logic Description:** Implement functions that use 'supertest' to make HTTP requests to the AdManager backend APIs. These functions will be wrapped and exposed as Cypress tasks. Handle authentication (e.g., passing tokens). For example, 'createEntityViaApi' would make a POST request. 'performApiLogin' would call the auth endpoint and return a token. Ensure proper error handling and response parsing.  
**Documentation:**
    
    - **Summary:** Provides Node.js tasks for Cypress to interact with backend APIs for test setup, teardown, or direct API validation, using Supertest for requests.
    
**Namespace:** AdManager.Tests.E2E.Tasks  
**Metadata:**
    
    - **Category:** TestSupport
    
- **Path:** cypress/utils/apiClient.ts  
**Description:** Provides a wrapper or utility for making API calls, potentially used by cy.request or tasks.  
**Template:** TypeScript Module  
**Dependancy Level:** 1  
**Name:** apiClient  
**Type:** Utility  
**Relative Path:** cypress/utils  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - GatewayPattern
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getRequest  
**Parameters:**
    
    - url: string
    - token?: string
    - options?: object
    
**Return Type:** Chainable<Cypress.Response<any>>  
**Attributes:** public  
    - **Name:** postRequest  
**Parameters:**
    
    - url: string
    - body: object
    - token?: string
    - options?: object
    
**Return Type:** Chainable<Cypress.Response<any>>  
**Attributes:** public  
    - **Name:** putRequest  
**Parameters:**
    
    - url: string
    - body: object
    - token?: string
    - options?: object
    
**Return Type:** Chainable<Cypress.Response<any>>  
**Attributes:** public  
    - **Name:** deleteRequest  
**Parameters:**
    
    - url: string
    - token?: string
    - options?: object
    
**Return Type:** Chainable<Cypress.Response<any>>  
**Attributes:** public  
    
**Implemented Features:**
    
    - API Request Abstraction
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Centralizes API request logic for cy.request, handling base URLs, common headers, and authentication tokens.  
**Logic Description:** Implement helper functions that wrap 'cy.request()'. These functions would take parameters like endpoint, payload, and method. They can automatically prepend the API base URL, include authorization headers (if a token is available, e.g., stored via a custom command or task), and handle common error checking. This promotes consistency in API calls from tests.  
**Documentation:**
    
    - **Summary:** Utility module for simplifying and standardizing API requests made directly from Cypress tests using cy.request.
    
**Namespace:** AdManager.Tests.E2E.Utils  
**Metadata:**
    
    - **Category:** TestUtility
    
- **Path:** cypress/utils/testDataHelper.ts  
**Description:** Helper functions for generating or manipulating test data.  
**Template:** TypeScript Module  
**Dependancy Level:** 1  
**Name:** testDataHelper  
**Type:** Utility  
**Relative Path:** cypress/utils  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** generateUniqueCampaignName  
**Parameters:**
    
    - prefix?: string
    
**Return Type:** string  
**Attributes:** public  
    - **Name:** getRandomEmail  
**Parameters:**
    
    
**Return Type:** string  
**Attributes:** public  
    - **Name:** formatDateForApi  
**Parameters:**
    
    - date: Date
    
**Return Type:** string  
**Attributes:** public  
    
**Implemented Features:**
    
    - Dynamic Test Data Generation
    
**Requirement Ids:**
    
    - 3.2.7
    
**Purpose:** Provides utilities to create dynamic and unique data for test cases, reducing hardcoding and test flakiness.  
**Logic Description:** Implement functions to generate random strings, numbers, emails, or format data in specific ways required by the application (e.g., 'generateUniqueCampaignName' appends a timestamp or random suffix).  
**Documentation:**
    
    - **Summary:** Contains helper functions for creating and managing test data used in E2E scenarios.
    
**Namespace:** AdManager.Tests.E2E.Utils  
**Metadata:**
    
    - **Category:** TestUtility
    
- **Path:** cypress/e2e/auth/login.cy.ts  
**Description:** E2E test specifications for Ad Manager login and logout functionality.  
**Template:** Cypress Spec File  
**Dependancy Level:** 4  
**Name:** login.cy  
**Type:** TestSpecification  
**Relative Path:** cypress/e2e/auth  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Login Success Test
    - Login Failure Test (Invalid Credentials)
    - Logout Test
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    
**Purpose:** Validates the authentication flows of the Ad Manager platform.  
**Logic Description:** Use 'describe' and 'it' blocks to structure tests. Import and instantiate 'LoginPage' and 'DashboardPage' POMs. Use 'cy.fixture('users.json')' to load test user data. Test scenarios: successful login navigates to dashboard; login with invalid credentials shows error message; logout navigates back to login page. Use custom commands like 'cy.login()' if defined.  
**Documentation:**
    
    - **Summary:** Contains E2E tests for user login, logout, and handling of invalid authentication attempts.
    
**Namespace:** AdManager.Tests.E2E.Auth  
**Metadata:**
    
    - **Category:** E2ETest
    
- **Path:** cypress/e2e/campaigns/campaignManagement.cy.ts  
**Description:** E2E test specifications for managing advertising campaigns.  
**Template:** Cypress Spec File  
**Dependancy Level:** 4  
**Name:** campaignManagement.cy  
**Type:** TestSpecification  
**Relative Path:** cypress/e2e/campaigns  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Creation
    - Campaign Editing
    - Campaign Deletion
    - Campaign Status Change
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    - REQ-POA-022
    
**Purpose:** Validates the full lifecycle of campaign management: creation, viewing, editing, and deletion through the UI.  
**Logic Description:** Import relevant POMs (CampaignListPage, CampaignEditorPage). Use 'beforeEach' for login. Test scenarios: create a new campaign with valid data; verify campaign appears in list; edit an existing campaign's details; change campaign status (e.g., Draft to Active, Active to Paused); delete a campaign and verify its removal. Use 'cy.fixture('campaignData.json')' and test data helpers. Consider API tasks for prerequisite data setup or cleanup if UI actions are too slow/complex for that.  
**Documentation:**
    
    - **Summary:** E2E tests covering the creation, modification, and deletion of advertising campaigns.
    
**Namespace:** AdManager.Tests.E2E.Campaigns  
**Metadata:**
    
    - **Category:** E2ETest
    
- **Path:** cypress/e2e/analytics/reporting.cy.ts  
**Description:** E2E test specifications for viewing campaign analytics and reports.  
**Template:** Cypress Spec File  
**Dependancy Level:** 4  
**Name:** reporting.cy  
**Type:** TestSpecification  
**Relative Path:** cypress/e2e/analytics  
**Repository Id:** REPO-E2ETEST-005  
**Pattern Ids:**
    
    - PageObjectModel
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - View Campaign Performance Metrics
    - Filter Reports by Date/Network
    - Export Report Data (if UI supports)
    
**Requirement Ids:**
    
    - 3.2.7
    - 7.6
    - REQ-POA-022
    
**Purpose:** Validates that merchants can view and interact with advertising performance reports.  
**Logic Description:** Import AnalyticsDashboardPage POM. Test scenarios: navigate to analytics section; verify display of key metrics (ROAS, CPA, spend - may require mock data setup via API task); test filtering capabilities (date range, ad network); test report export if available. This might involve setting up a campaign with known (mocked) performance data via API tasks.  
**Documentation:**
    
    - **Summary:** E2E tests for verifying the display and functionality of the analytics and reporting features.
    
**Namespace:** AdManager.Tests.E2E.Analytics  
**Metadata:**
    
    - **Category:** E2ETest
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - useMockApiForCertainFlows
  - enableAdvancedReportingAssertions
  
- **Database Configs:**
  
  


---

