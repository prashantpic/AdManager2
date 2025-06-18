# Repository Specification

# 1. Name
AdManager.CICD.Pipelines


---

# 2. Description
Contains definitions for CI/CD pipelines using AWS CodePipeline, AWS CodeBuild, and AWS CodeDeploy. Automates the build, test (unit, integration, E2E, security scans like SAST/DAST), and deployment processes for all Ad Manager backend microservices (NestJS) and frontend applications (React/Next.js). Pipelines defined declaratively via AWS CDK or YAML.


---

# 3. Type
CICDPipelines


---

# 4. Namespace
AdManager.CICD


---

# 5. Output Path
cicd/pipelines


---

# 6. Framework
AWS Developer Tools


---

# 7. Language
TypeScript


---

# 8. Technology
AWS CodePipeline, AWS CodeBuild, AWS CodeDeploy, AWS CDK, YAML, Git, SonarQube (SAST), OWASP ZAP (DAST)


---

# 9. Thirdparty Libraries



---

# 10. Dependencies

- REPO-INFRA-001


---

# 11. Layer Ids

- operations-monitoring-layer


---

# 12. Requirements

- **Requirement Id:** 5.2 (CI/CD - AWS CodePipeline, CodeBuild, CodeDeploy)  
- **Requirement Id:** 5.8 (Testability - Automated testing integration)  
- **Requirement Id:** 3.2.4 (Security - SAST/DAST scans)  


---

# 13. Generate Tests
False


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
DevOps


---

# 16. Id
REPO-CICD-003


---

# 17. Architecture_Map

- operations-monitoring-layer


---

# 18. Components_Map

- CI-CD-Pipelines


---

# 19. Requirements_Map

- REQ-POA-005
- 5.2
- 5.8
- 3.2.4 (SAST/DAST)


---

