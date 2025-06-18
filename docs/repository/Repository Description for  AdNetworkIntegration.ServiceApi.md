# Repository Specification

# 1. Name
AdNetworkIntegration.ServiceApi


---

# 2. Description
Internal service API (not directly exposed to merchants) used by other Ad Manager services to interact with external ad networks. Handles campaign synchronization, creative management, performance metric retrieval, audience sync, and product feed submissions. Implements resilience patterns like retries and circuit breakers. This is an internal API, likely gRPC or event-driven, rather than a direct merchant-facing REST API.


---

# 3. Type
InternalServiceAPI


---

# 4. Namespace
AdManager.AdNetworkIntegration.Service.V1


---

# 5. Output Path
src/modules/ad-network-integration/service


---

# 6. Framework
NestJS


---

# 7. Language
TypeScript


---

# 8. Technology
gRPC, Protocol Buffers, NestJS (or SQS/SNS for event-driven interaction)


---

# 9. Thirdparty Libraries

- @grpc/grpc-js
- google-protobuf
- opossum (circuit breaker)


---

# 10. Dependencies



---

# 11. Layer Ids

- application-services-layer
- integration-layer


---

# 12. Requirements

- **Requirement Id:** 3.3.2.2 (Ad Networks Integration)  
- **Requirement Id:** 3.2.3 (Availability and Reliability - retry mechanisms, circuit breaker)  
- **Requirement Id:** 3.2.8 (Compliance - ad network terms)  


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
REPO-ADNETINT-003


---

# 17. Architecture_Map

- application-services-layer
- integration-layer


---

# 18. Components_Map

- AdNetworkIntegrationService


---

# 19. Requirements_Map

- REQ-TCE-001
- REQ-TCE-002
- REQ-TCE-003
- REQ-03-001
- REQ-03-002
- REQ-03-003
- REQ-03-005
- REQ-03-006
- REQ-03-007
- REQ-03-008
- REQ-CMO-010
- REQ-CMO-012


---

