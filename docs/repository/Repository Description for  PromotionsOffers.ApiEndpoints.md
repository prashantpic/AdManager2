# Repository Specification

# 1. Name
PromotionsOffers.ApiEndpoints


---

# 2. Description
Provides RESTful API endpoints for creating and managing various promotional offers such as discount codes, Buy One Get One Free (BOGO) deals, and quantity-based discounts. Supports defining offer rules, validity, eligibility, and combination logic. These endpoints are used by merchants to set up incentives for their advertising campaigns.


---

# 3. Type
RESTfulAPI


---

# 4. Namespace
AdManager.PromotionsOffers.Api.V1


---

# 5. Output Path
src/modules/promotions-offers/api


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

- **Requirement Id:** 3.1.3 (Promotion and Offer Management - Discount Codes)  
- **Requirement Id:** 3.1.3 (Promotion and Offer Management - BOGO)  
- **Requirement Id:** 3.1.3 (Promotion and Offer Management - Offer Control)  
- **Requirement Id:** 3.1.3 (Promotion and Offer Management - Quantity-Based Discounts)  


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
REPO-PROMO-005


---

# 17. Architecture_Map

- api-gateway-layer
- application-services-layer


---

# 18. Components_Map

- PromotionsOffersService


---

# 19. Requirements_Map

- REQ-PROMO-001
- REQ-PROMO-002
- REQ-PROMO-003
- REQ-PROMO-004
- REQ-PROMO-005
- REQ-PROMO-006
- REQ-PROMO-007
- REQ-PROMO-008
- REQ-CPSI-004


---

