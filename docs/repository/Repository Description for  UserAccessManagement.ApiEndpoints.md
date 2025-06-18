# Repository Specification

# 1. Name
UserAccessManagement.ApiEndpoints


---

# 2. Description
Exposes RESTful API endpoints for managing users, roles (Merchant Admin, Campaign Manager), and permissions within the Ad Manager platform. Integrates with the core [PlatformName] authentication and provides Ad Manager-specific authorization logic. Also used by Platform Administrators for user management tasks.


---

# 3. Type
RESTfulAPI


---

# 4. Namespace
AdManager.UserAccessManagement.Api.V1


---

# 5. Output Path
src/modules/user-access/api


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

- **Requirement Id:** 3.1.5 (Role-Based Access Control)  
- **Requirement Id:** 3.2.4 (Security - User authentication, RBAC)  
- **Requirement Id:** 2.3 (User Characteristics - User roles)  


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
REPO-USERACC-010


---

# 17. Architecture_Map

- api-gateway-layer
- application-services-layer


---

# 18. Components_Map

- UserAccessManagementService (IAM)


---

# 19. Requirements_Map

- REQ-IAM-001
- REQ-IAM-002
- REQ-IAM-003
- REQ-IAM-004
- REQ-IAM-005
- REQ-IAM-006
- REQ-IAM-007
- REQ-IAM-008
- REQ-IAM-010
- REQ-CPSI-003
- 2.3


---

