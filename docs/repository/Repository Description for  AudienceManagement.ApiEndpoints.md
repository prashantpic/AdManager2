# Repository Specification

# 1. Name
AudienceManagement.ApiEndpoints


---

# 2. Description
Exposes RESTful API endpoints for merchants to create, define, and manage audience segments (e.g., custom audiences from customer lists, lookalike audiences). These audiences are then used for targeting in advertising campaigns across various ad networks.


---

# 3. Type
RESTfulAPI


---

# 4. Namespace
AdManager.AudienceManagement.Api.V1


---

# 5. Output Path
src/modules/audience-management/api


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

- **Requirement Id:** 3.3.2.2 (Ad Networks - Audience synchronization)  


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
REPO-AUDIENCE-015


---

# 17. Architecture_Map

- api-gateway-layer
- application-services-layer


---

# 18. Components_Map

- AudienceManagementService


---

# 19. Requirements_Map

- REQ-CMO-012
- REQ-03-008


---

