# Repository Specification

# 1. Name
DataGovernanceCompliance.ApiEndpoints


---

# 2. Description
Exposes RESTful API endpoints for managing data governance and compliance tasks. This includes handling Data Subject Rights (DSR) requests (access, rectification, erasure), managing consent records, and providing data for compliance reporting. Primarily for internal administrative use but may have components exposed for merchant self-service related to their data.


---

# 3. Type
RESTfulAPI


---

# 4. Namespace
AdManager.DataGovernanceCompliance.Api.V1


---

# 5. Output Path
src/modules/data-governance/api


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

- **Requirement Id:** 3.4.5 (Data Privacy and Protection - DSR)  
- **Requirement Id:** 3.2.8 (Compliance and Data Protection - consent management)  
- **Requirement Id:** 3.4.3 (Data Retention - policies)  


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
REPO-DATAGOV-012


---

# 17. Architecture_Map

- api-gateway-layer
- application-services-layer


---

# 18. Components_Map

- DataGovernanceComplianceService


---

# 19. Requirements_Map

- REQ-MDGC-001
- REQ-MDGC-003
- REQ-MDGC-004
- REQ-MDGC-005
- REQ-MDGC-007
- REQ-MDGC-008
- REQ-POA-013


---

