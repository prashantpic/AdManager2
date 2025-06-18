# Repository Specification

# 1. Name
AdManager.Unified.ApiGateway.Config


---

# 2. Description
This repository defines and manages the configuration for the Ad Manager's Unified API Gateway, built primarily using Amazon API Gateway. It acts as the single, authoritative entry point for all external client requests targeting the backend microservices, originating from the Merchant Portal, Platform Admin Portal, Affiliate Portal, and authorized third-party applications via the App Store framework. Its responsibilities include coordinating request routing to appropriate backend services based on path and method, enforcing consistent authentication (JWT validation via Lambda authorizers) and authorization (coarse-grained role checks), implementing global rate limiting and throttling policies to protect backend resources. Additionally, it handles SSL termination, manages API versioning strategies, request/response transformations if needed (e.g., for specific client needs or to aggregate data from multiple services in a BFF-like manner for certain UIs), and ensures CORS policies are correctly configured. This repository contains the Infrastructure as Code (e.g., AWS CDK or CloudFormation templates) specifically for defining API Gateway resources, routes, integrations, authorizers, and associated WAF rules. It facilitates a secure, managed, and consistent interface to the platform's diverse functionalities.


---

# 3. Type
ApiGateway


---

# 4. Namespace
AdManager.Platform.Gateway


---

# 5. Output Path
infrastructure/api-gateway


---

# 6. Framework
AWS CDK


---

# 7. Language
TypeScript


---

# 8. Technology
Amazon API Gateway, AWS Lambda (for authorizers), OpenAPI, JWT, AWS WAF, AWS CDK/CloudFormation


---

# 9. Thirdparty Libraries



---

# 10. Dependencies

- REPO-CAMP-001
- [ID_ProductCatalog_ApiEndpoints]
- [ID_Promotions_ApiEndpoints]
- [ID_Analytics_ApiEndpoints]
- [ID_UserAccessManagement_ApiEndpoints]
- [ID_Billing_ApiEndpoints]
- [ID_Affiliate_ApiEndpoints]
- [ID_PlatformAdmin_ApiEndpoints]
- [ID_ThirdPartyAppIntegration_ApiEndpoints]


---

# 11. Layer Ids

- api-gateway-layer


---

# 12. Requirements

- **Requirement Id:** 3.3.2.1 (Internal APIs - managed by API Gateway)  
- **Requirement Id:** 4.2.4 (API Management - Amazon API Gateway)  
- **Requirement Id:** 3.2.4 (Security - JWT authentication, WAF integration)  
- **Requirement Id:** 3.3.2.3 (App Store Integration Framework - API specifications, secure auth)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
APIGateway


---

# 16. Id
REPO-MASTER-GW-001


---

# 17. Architecture_Map

- api-gateway-layer
- security-layer


---

# 18. Components_Map

- MerchantAPIRoute
- AdminAPIRoute
- AffiliateAPIRoute
- PublicContentAPIRoute
- ThirdPartyAppAPIRoute
- AuthenticationService (authorizer part)


---

# 19. Requirements_Map

- REQ-IAM-007
- REQ-TCE-008
- REQ-03-004
- REQ-POA-017
- REQ-SUD-015


---

