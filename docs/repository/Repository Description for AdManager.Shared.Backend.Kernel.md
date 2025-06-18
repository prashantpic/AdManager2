# Repository Specification

# 1. Name
AdManager.Shared.Backend.Kernel


---

# 2. Description
This repository serves as a shared kernel for all backend microservices within the Ad Manager Platform. It provides a collection of common libraries, core utilities, base classes, decorators, and shared DTOs/interfaces to promote consistency, code reuse, and adherence to platform-wide standards. Key functionalities include: a standardized logging framework (interfacing with CloudWatch), common error handling mechanisms (custom exception classes, global exception filters), shared Data Transfer Objects (DTOs) for inter-service communication contracts, reusable validation utilities (e.g., custom `class-validator` decorators for domain-specific rules), client libraries or wrappers for accessing shared infrastructure components (e.g., AWS Secrets Manager, Systems Manager Parameter Store for configuration, ElastiCache), and potentially base service/repository classes that encapsulate common patterns. It helps enforce architectural consistency, reduces boilerplate code in individual services, and simplifies maintenance by centralizing cross-cutting concerns as outlined in the architecture's cross-cutting layer. This kernel is imported as a dependency by most, if not all, backend services.


---

# 3. Type
SharedKernel


---

# 4. Namespace
AdManager.Shared.Backend


---

# 5. Output Path
libs/backend-kernel


---

# 6. Framework
NestJS (common modules/providers)


---

# 7. Language
TypeScript


---

# 8. Technology
TypeScript, NPM Package


---

# 9. Thirdparty Libraries

- class-validator
- class-transformer
- winston (or similar logging lib)
- aws-sdk


---

# 10. Dependencies



---

# 11. Layer Ids

- cross-cutting-layer


---

# 12. Requirements

- **Requirement Id:** 3.2.7 (Maintainability - Code well-documented, adhering to defined coding standards)  
- **Requirement Id:** 4.1 (Architectural Approach - Modular architecture, separation of concerns)  
- **Requirement Id:** Cross-Cutting Concerns Layer (in architecture)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
LayeredArchitecture


---

# 16. Id
REPO-SHARED-KERNEL-001


---

# 17. Architecture_Map

- cross-cutting-layer


---

# 18. Components_Map

- CommonLoggingLibrary
- ErrorHandlingFramework
- SharedTypesPackage
- ValidationUtilities
- ConfigClientLibrary
- AuditLogClient


---

# 19. Requirements_Map

- REQ-SUD-007
- REQ-POA-002
- REQ-POA-009


---

