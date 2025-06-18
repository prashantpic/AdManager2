# Repository Specification

# 1. Name
AdManager.Deployment.KubernetesManifests


---

# 2. Description
Contains Kubernetes manifests (Deployments, Services, Ingresses, ConfigMaps, Secrets stubs, HorizontalPodAutoscalers, etc.) for deploying Ad Manager microservices and applications onto Amazon EKS. This repository is specifically used if application-level Kubernetes configurations are managed separately from the AWS CDK infrastructure provisioning (e.g., using Helm charts or Kustomize overlays). It complements the IaC repository which sets up the EKS cluster itself.


---

# 3. Type
DeploymentScripts


---

# 4. Namespace
AdManager.Deployment.Kubernetes


---

# 5. Output Path
deployment/kubernetes-manifests


---

# 6. Framework
Kubernetes


---

# 7. Language
YAML


---

# 8. Technology
Kubernetes, Helm, Kustomize


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

- **Requirement Id:** 4.4.1 (Containerization and Orchestration - EKS consideration if chosen over Fargate)  


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
REPO-K8SMANIFESTS-009


---

# 17. Architecture_Map

- operations-monitoring-layer


---

# 18. Components_Map

- Orchestration (EKS manifests part)


---

# 19. Requirements_Map

- 4.4.1 (EKS manifests part)


---

