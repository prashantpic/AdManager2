# Repository Specification

# 1. Name
AdManager.Tests.Performance


---

# 2. Description
Contains scripts and configurations for performance testing (load, stress, soak tests) of the Ad Manager Platform. Utilizes tools like k6 to simulate user load and measure system responsiveness, scalability (especially for Y million product listings, N impressions/sec), and stability under various conditions. Aims to validate NFRs related to performance and scalability specified in sections 3.2.1 and 3.2.2.


---

# 3. Type
TestingFramework


---

# 4. Namespace
AdManager.Tests.Performance


---

# 5. Output Path
tests/performance


---

# 6. Framework
k6


---

# 7. Language
JavaScript


---

# 8. Technology
k6, Grafana (for results visualization)


---

# 9. Thirdparty Libraries

- k6


---

# 10. Dependencies

- REPO-CAMP-001
- REPO-PRODCAT-002
- REPO-ANALYTICS-004


---

# 11. Layer Ids

- operations-monitoring-layer


---

# 12. Requirements

- **Requirement Id:** 3.2.1 (Performance NFRs)  
- **Requirement Id:** 3.2.2 (Scalability NFRs)  
- **Requirement Id:** 5.8 (Testability - performance tests)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
AutomatedTesting


---

# 16. Id
REPO-PERFTEST-006


---

# 17. Architecture_Map

- operations-monitoring-layer


---

# 18. Components_Map

- Automated Testing Integration


---

# 19. Requirements_Map

- 3.2.1
- 3.2.2
- REQ-ARP-005
- REQ-PC-010
- 5.8 (Performance tests part)


---

