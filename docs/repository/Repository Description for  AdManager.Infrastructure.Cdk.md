# Repository Specification

# 1. Name
AdManager.Infrastructure.Cdk


---

# 2. Description
Contains AWS CDK (TypeScript) code for provisioning and managing all AWS cloud infrastructure resources required by the Ad Manager Platform. This includes VPCs, IAM roles, EKS/ECS clusters and Fargate configurations, API Gateways, RDS, DynamoDB, SQS, SNS, S3, ElastiCache, WAF, KMS, CloudFront, and other necessary services. Adheres to IaC principles for repeatable and version-controlled infrastructure.


---

# 3. Type
CloudInfrastructure


---

# 4. Namespace
AdManager.Infrastructure


---

# 5. Output Path
infrastructure/aws-cdk


---

# 6. Framework
AWS CDK


---

# 7. Language
TypeScript


---

# 8. Technology
AWS CDK, TypeScript, AWS CloudFormation


---

# 9. Thirdparty Libraries

- aws-cdk-lib
- constructs


---

# 10. Dependencies



---

# 11. Layer Ids

- operations-monitoring-layer


---

# 12. Requirements

- **Requirement Id:** 4.4.3 (Infrastructure as Code - IaC)  
- **Requirement Id:** 5.3 (Disaster Recovery - Multi-AZ deployment)  
- **Requirement Id:** 2.4 (General Constraints - IaC)  
- **Requirement Id:** 4.4.1 (Containerization and Orchestration - ECS with Fargate)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
InfrastructureAsCode


---

# 16. Id
REPO-INFRA-001


---

# 17. Architecture_Map

- operations-monitoring-layer


---

# 18. Components_Map

- IaCTemplates


---

# 19. Requirements_Map

- REQ-POA-008
- 4.4.3
- 5.3
- 2.4
- 4.4.1


---

