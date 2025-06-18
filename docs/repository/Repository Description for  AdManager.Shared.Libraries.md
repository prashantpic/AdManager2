# Repository Specification

# 1. Name
AdManager.Shared.Libraries


---

# 2. Description
Contains shared TypeScript libraries and packages used across multiple Ad Manager microservices (NestJS). This includes common Data Transfer Objects (DTOs), utility functions (e.g., for date manipulation, string formatting), base classes, custom NestJS decorators, standardized error handling structures, event schemas/constants for SQS/SNS, and potentially shared client libraries for internal services. Published as private NPM packages to ensure consistency and reusability.


---

# 3. Type
SharedLibrary


---

# 4. Namespace
AdManager.Shared


---

# 5. Output Path
packages/shared


---

# 6. Framework
N/A


---

# 7. Language
TypeScript


---

# 8. Technology
TypeScript, NPM, Jest (for unit testing libraries)


---

# 9. Thirdparty Libraries

- class-validator
- class-transformer
- lodash
- uuid


---

# 10. Dependencies



---

# 11. Layer Ids

- cross-cutting-layer


---

# 12. Requirements

- **Requirement Id:** 4.1 (Architectural Approach - modular, API-first)  
- **Requirement Id:** 3.2.7 (Maintainability - well-documented code, coding standards)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
CrossCuttingConcerns


---

# 16. Id
REPO-SHAREDLIB-007


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

- 4.1 (modular aspect)
- 3.2.7 (shared code aspect)


---

