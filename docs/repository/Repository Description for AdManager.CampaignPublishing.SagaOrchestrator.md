# Repository Specification

# 1. Name
AdManager.CampaignPublishing.SagaOrchestrator


---

# 2. Description
This service orchestrator repository is responsible for managing complex, long-running, and distributed business processes related to the end-to-end publishing and lifecycle management of advertising campaigns. It coordinates interactions between several autonomous microservices, including the `CampaignManagement.Service` (for core campaign data), `ProductCatalog.Service` (to ensure product feeds are ready and compliant), `AdNetworkIntegration.Service` (for the actual communication and synchronization with external ad platforms like Google, Instagram, TikTok, Snapchat), and potentially `Billing.Service` (to check budget or ad spend limits). It implements the Saga pattern (choreographed or orchestrated) to ensure data consistency across these services and to handle failures gracefully through compensating transactions. For example, when a merchant creates a new campaign, this orchestrator would manage the sequence of validating campaign details, ensuring associated products are in a feed, submitting the campaign to selected ad networks, and then updating the campaign's status based on the outcomes. It listens for relevant domain events and publishes events to trigger subsequent steps or signal completion/failure of the overall process. This decouples the core services and centralizes the complex workflow logic.


---

# 3. Type
ApplicationService


---

# 4. Namespace
AdManager.Orchestration.Campaigns


---

# 5. Output Path
src/modules/orchestration/campaign-publishing


---

# 6. Framework
NestJS


---

# 7. Language
TypeScript


---

# 8. Technology
NestJS, Amazon SQS/SNS (for eventing/saga steps), TypeScript, TypeORM (for saga state persistence if needed)


---

# 9. Thirdparty Libraries

- nestjs-sagas (if using a library)
- class-validator


---

# 10. Dependencies

- [ID_CampaignManagementService]
- [ID_ProductCatalogService]
- [ID_AdNetworkIntegrationService]
- [ID_AnalyticsReportingService_ForStatusUpdate]
- [ID_BillingService_ForBudgetCheck]


---

# 11. Layer Ids

- application-services-layer
- messaging-layer


---

# 12. Requirements

- **Requirement Id:** 3.1.1 (Product Catalogs - Facilitate promotion)  
- **Requirement Id:** 3.3.2.2 (Ad Networks - Campaign creation, editing, status management)  
- **Requirement Id:** 4.1 (Architectural Approach - Event-driven communication)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
Saga


---

# 16. Id
REPO-MASTER-SVC-ORCH-001


---

# 17. Architecture_Map

- application-services-layer
- messaging-layer


---

# 18. Components_Map

- CampaignManagementService
- ProductCatalogService
- AdNetworkIntegrationService
- CampaignEventsQueue
- PerformanceDataTopic


---

# 19. Requirements_Map

- REQ-CMO-001
- REQ-03-001
- REQ-PC-006


---

