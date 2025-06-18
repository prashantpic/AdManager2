# Repository Specification

# 1. Name
CorePlatformIntegration.ServiceApi


---

# 2. Description
Internal service API (not directly merchant-facing) used by Ad Manager services to interact with the [PlatformName] core e-commerce platform. Handles synchronization of product data, user authentication delegation, customer data access for promotions, and order data retrieval. This API abstracts the complexities of the core platform integration.


---

# 3. Type
InternalServiceAPI


---

# 4. Namespace
AdManager.CorePlatformIntegration.Service.V1


---

# 5. Output Path
src/modules/core-platform-integration/service


---

# 6. Framework
NestJS


---

# 7. Language
TypeScript


---

# 8. Technology
gRPC, Protocol Buffers, NestJS (or internal REST)


---

# 9. Thirdparty Libraries

- @grpc/grpc-js
- google-protobuf
- axios


---

# 10. Dependencies



---

# 11. Layer Ids

- application-services-layer
- integration-layer


---

# 12. Requirements

- **Requirement Id:** 2.5 (Assumptions - PlatformName core platform provides APIs)  
- **Requirement Id:** 3.1.2 (Direct Order - Leveraging Core Platform Feature)  


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
REPO-COREINT-016


---

# 17. Architecture_Map

- application-services-layer
- integration-layer


---

# 18. Components_Map

- CorePlatformIntegrationService


---

# 19. Requirements_Map

- REQ-CPSI-001
- REQ-CPSI-002
- REQ-CPSI-003
- REQ-CPSI-004
- REQ-CPSI-005
- REQ-CPSI-006
- REQ-CPSI-007
- REQ-CPSI-008
- 2.5
- 3.1.2 (Direct Order)


---

