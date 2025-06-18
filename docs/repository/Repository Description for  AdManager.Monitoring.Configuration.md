# Repository Specification

# 1. Name
AdManager.Monitoring.Configuration


---

# 2. Description
Contains configurations for monitoring and alerting, primarily CloudWatch Alarms definitions, managed as code via AWS CDK. Includes definitions for alerts based on metrics from services (custom and standard AWS), log patterns, and health checks. Also defines configurations for CloudWatch Dashboards. May include scripts/configurations for PagerDuty/OpsGenie integration if not handled by SNS directly.


---

# 3. Type
MonitoringConfiguration


---

# 4. Namespace
AdManager.Monitoring


---

# 5. Output Path
monitoring/configuration


---

# 6. Framework
AWS CloudWatch


---

# 7. Language
TypeScript


---

# 8. Technology
Amazon CloudWatch Alarms, Amazon CloudWatch Dashboards, Amazon SNS, AWS CDK


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

- **Requirement Id:** 5.1 (Monitoring, Logging, and Alerting - Set alarms, Create custom dashboards)  
- **Requirement Id:** 5.6 (Support and Incident Management - SLAs influencing alert thresholds)  


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
REPO-MONITORCONF-004


---

# 17. Architecture_Map

- operations-monitoring-layer


---

# 18. Components_Map

- AlertingSystem
- MetricsDashboard


---

# 19. Requirements_Map

- REQ-POA-003
- 5.1
- REQ-POA-015


---

