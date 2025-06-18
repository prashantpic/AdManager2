# Repository Specification

# 1. Name
ProductCatalog.ApiEndpoints


---

# 2. Description
Provides RESTful API endpoints for creating and managing product catalogs specific to advertising. Supports synchronization with the core [PlatformName] product data, ad-specific customizations, bulk imports, conflict resolution strategies, and product feed generation for various ad networks. These endpoints enable merchants to prepare and manage their product data effectively for advertising campaigns.


---

# 3. Type
RESTfulAPI


---

# 4. Namespace
AdManager.ProductCatalog.Api.V1


---

# 5. Output Path
src/modules/product-catalogs/api


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
- fast-csv
- xmlbuilder2


---

# 10. Dependencies



---

# 11. Layer Ids

- api-gateway-layer
- application-services-layer


---

# 12. Requirements

- **Requirement Id:** 3.1.1 (Product Catalogs)  
- **Requirement Id:** 3.4.4 (Product Data Management)  
- **Requirement Id:** 3.4.2 (Data Validation - product catalog feeds)  


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
REPO-PRODCAT-002


---

# 17. Architecture_Map

- api-gateway-layer
- application-services-layer


---

# 18. Components_Map

- ProductCatalogService


---

# 19. Requirements_Map

- REQ-PC-001
- REQ-PC-002
- REQ-PC-003
- REQ-PC-004
- REQ-PC-005
- REQ-PC-006
- REQ-PC-007
- REQ-CPSI-001
- REQ-CPSI-002
- REQ-DOMS-001
- REQ-DOMS-005
- 3.4.4
- 3.4.2 (product catalog feeds part)


---

