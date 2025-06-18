# Repository Specification

# 1. Name
CampaignManagement.ApiEndpoints


---

# 2. Description
Exposes RESTful API endpoints for managing advertising campaigns, ad sets, ads, and A/B tests. Handles operations like creation, updates, status changes, budget management, and associations with product catalogs and promotions. These endpoints are primarily consumed by the Merchant Ad Manager Portal and potentially internal services or authorized third-party applications.


---

# 3. Type
RESTfulAPI


---

# 4. Namespace
AdManager.CampaignManagement.Api.V1


---

# 5. Output Path
src/modules/campaigns/api


---

# 6. Framework
NestJS


---

# 7. Language
TypeScript


---

# 8. Technology
REST, JSON, JWT, Amazon API Gateway (as entry point), NestJS


---

# 9. Thirdparty Libraries

- class-validator
- class-transformer
- @nestjs/swagger


---

# 10. Dependencies



---

# 11. Layer Ids

- api-gateway-layer
- application-services-layer


---

# 12. Requirements

- **Requirement Id:** 3.1.1 (Reporting and Analytics - Advertising Specific - A/B test result analysis part)  
- **Requirement Id:** 3.1.6 (A/B Testing - Campaign Element Testing)  
- **Requirement Id:** 3.1.1 (Product Catalogs - Facilitate promotion)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
Microservices


---

# 16. Id
REPO-CAMP-001


---

# 17. Architecture_Map

- api-gateway-layer
- application-services-layer


---

# 18. Components_Map

- CampaignManagementService


---

# 19. Requirements_Map

- REQ-CMO-001
- REQ-CMO-002
- REQ-CMO-003
- REQ-CMO-004
- REQ-CMO-005
- REQ-CMO-006
- REQ-CMO-008
- REQ-CMO-009
- REQ-CMO-011
- REQ-CMO-012
- REQ-CMO-013
- 3.1.1 (Reporting and Analytics for A/B test result analysis part)
- 3.1.6


---

