# Specification

# 1. Files

- **Path:** charts/campaign-management-service/Chart.yaml  
**Description:** Helm chart definition file for the Campaign Management Service. Specifies chart name, version, appVersion, and dependencies.  
**Template:** Helm Chart Definition  
**Dependancy Level:** 0  
**Name:** Chart  
**Type:** HelmChartMetadata  
**Relative Path:** charts/campaign-management-service  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Helm Chart Packaging Information
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Defines metadata for the campaign-management-service Helm chart, enabling versioning and dependency management.  
**Logic Description:** Contains YAML structure with fields like apiVersion, name, version, appVersion, description, type, keywords, home, sources, dependencies, maintainers, icon, and annotations as per Helm chart specification.  
**Documentation:**
    
    - **Summary:** Provides essential metadata for packaging and deploying the Campaign Management Service using Helm.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/values.yaml  
**Description:** Default Helm values file for the Campaign Management Service chart. Contains default configuration parameters that can be overridden per environment.  
**Template:** Helm Values File  
**Dependancy Level:** 1  
**Name:** values  
**Type:** HelmValues  
**Relative Path:** charts/campaign-management-service  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - ConfigurationExternalization
    
**Implemented Features:**
    
    - Default Application Configuration
    - Resource Allocation Defaults
    - Feature Flag Defaults
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Provides default configuration values for the campaign-management-service Helm chart templates.  
**Logic Description:** YAML file defining key-value pairs for replicaCount, image repository/tag, service ports, resource requests/limits, environment variables, ingress settings, HPA configuration, ConfigMap data, and references to Secrets. Values are designed to be overridden by environment-specific values files.  
**Documentation:**
    
    - **Summary:** Stores default configurable parameters for the Campaign Management Service deployment, used by Helm templates.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/_helpers.tpl  
**Description:** Helm template helper file for the Campaign Management Service. Contains named templates (partials) to reuse common YAML snippets across Kubernetes manifest templates.  
**Template:** Helm Template Helper  
**Dependancy Level:** 0  
**Name:** _helpers  
**Type:** HelmHelperTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - DRYPrinciple
    
**Implemented Features:**
    
    - Reusable YAML Snippets
    - Dynamic Label Generation
    - Resource Naming Conventions
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Defines reusable template snippets and helper functions for constructing Kubernetes manifests within the campaign-management-service Helm chart.  
**Logic Description:** Contains Go template definitions (e.g., `{{ define "mychart.labels" }}...{{ end }}`) for common labels, selectors, resource names, image pull secrets, and other reusable YAML blocks used in deployment.yaml, service.yaml, etc.  
**Documentation:**
    
    - **Summary:** Provides common Go template helper functions and partials to maintain consistency and reduce duplication in Kubernetes manifest templates for the Campaign Management Service.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/deployment.yaml  
**Description:** Helm template for the Kubernetes Deployment of the Campaign Management Service. Manages pod creation, updates, and scaling.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** deployment  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Application Deployment Configuration
    - Pod Specification
    - Replica Management
    - Update Strategy Definition
    - Liveness/Readiness Probes
    - Resource Allocation
    - Environment Variable Injection
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes Deployment resource for the Campaign Management Service, allowing configuration through Helm values.  
**Logic Description:** Generates a Kubernetes Deployment manifest. Uses Helm templating (`{{ .Values... }}`, `{{ include ... }}`) for image name/tag, replica count, resource requests/limits, environment variables (from ConfigMaps/Secrets), volume mounts, probes, and deployment strategy. Includes standard labels and selectors.  
**Documentation:**
    
    - **Summary:** Defines the desired state for deploying and managing pods of the Campaign Management Service on Kubernetes.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/service.yaml  
**Description:** Helm template for the Kubernetes Service exposing the Campaign Management Service. Provides network access to the deployed pods.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** service  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Service Discovery Configuration
    - Port Mapping
    - Load Balancing (Internal)
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes Service resource for the Campaign Management Service, enabling network access to its pods.  
**Logic Description:** Generates a Kubernetes Service manifest. Uses Helm templating for service name, type (e.g., ClusterIP), ports (targetPort, port, protocol), and selector to match pods deployed by the Deployment. Includes standard labels.  
**Documentation:**
    
    - **Summary:** Defines how the Campaign Management Service is exposed within the Kubernetes cluster network.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/hpa.yaml  
**Description:** Helm template for the Kubernetes HorizontalPodAutoscaler for the Campaign Management Service. Automatically scales pods based on metrics.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** hpa  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Autoscaling Configuration
    - CPU/Memory Thresholds
    - Min/Max Replica Definition
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes HorizontalPodAutoscaler resource for the Campaign Management Service to manage pod scaling.  
**Logic Description:** Generates a Kubernetes HPA manifest if `{{ .Values.autoscaling.enabled }}` is true. Uses Helm templating for target deployment name, min/max replicas, and CPU/memory utilization targets. Includes standard labels.  
**Documentation:**
    
    - **Summary:** Defines rules for automatically scaling the number of Campaign Management Service pods based on resource utilization.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/configmap.yaml  
**Description:** Helm template for Kubernetes ConfigMap(s) for the Campaign Management Service. Stores non-sensitive configuration data.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** configmap  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - ConfigurationExternalization
    
**Implemented Features:**
    
    - Application Configuration Storage
    - Environment Agnostic Configuration
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates Kubernetes ConfigMap resources for injecting configuration into the Campaign Management Service pods.  
**Logic Description:** Generates Kubernetes ConfigMap manifest(s). Uses Helm templating (`{{ .Values.configData... }}` or iterating over a map) to populate `data` field with configuration key-value pairs. These are typically mounted as files or environment variables in the pods. Includes standard labels.  
**Documentation:**
    
    - **Summary:** Manages non-confidential configuration data for the Campaign Management Service, making it available to the application at runtime.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/secret.yaml  
**Description:** Helm template for Kubernetes Secret(s) (stubs) for the Campaign Management Service. Placeholder for sensitive configuration data.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** secret  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - SecretsManagementPlaceholder
    
**Implemented Features:**
    
    - Sensitive Data Placeholder
    - Secret Injection Mechanism Outline
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates Kubernetes Secret resources (often as stubs) for the Campaign Management Service. Actual secret values are typically injected by CI/CD or a secrets manager.  
**Logic Description:** Generates Kubernetes Secret manifest(s). This template often defines the structure of the secret (keys) but not the actual base64 encoded values for sensitive data. Values might be templated for CI/CD injection or reference external secret stores like AWS Secrets Manager via CSI driver or similar mechanisms. Includes standard labels.  
**Documentation:**
    
    - **Summary:** Defines the structure for storing sensitive data for the Campaign Management Service. Actual values are managed externally for security.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/campaign-management-service/templates/ingress.yaml  
**Description:** Helm template for the Kubernetes Ingress exposing the Campaign Management Service externally, if applicable.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** ingress  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/campaign-management-service/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - External HTTP/S Routing
    - Hostname Configuration
    - Path-based Routing
    - TLS Termination
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes Ingress resource if the Campaign Management Service needs to be exposed externally.  
**Logic Description:** Generates a Kubernetes Ingress manifest if `{{ .Values.ingress.enabled }}` is true. Uses Helm templating for hostname, paths, service name, service port, TLS secret name, and annotations for ingress controller specific settings. Includes standard labels.  
**Documentation:**
    
    - **Summary:** Configures external access to the Campaign Management Service via an Ingress controller.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/merchant-ad-manager-portal/Chart.yaml  
**Description:** Helm chart definition file for the Merchant Ad Manager Portal frontend application.  
**Template:** Helm Chart Definition  
**Dependancy Level:** 0  
**Name:** Chart  
**Type:** HelmChartMetadata  
**Relative Path:** charts/merchant-ad-manager-portal  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Helm Chart Packaging Information
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Defines metadata for the merchant-ad-manager-portal Helm chart.  
**Logic Description:** Contains YAML structure with fields like apiVersion, name, version, appVersion, description, type, etc., specific to the Merchant Ad Manager Portal.  
**Documentation:**
    
    - **Summary:** Provides essential metadata for packaging and deploying the Merchant Ad Manager Portal using Helm.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/merchant-ad-manager-portal/values.yaml  
**Description:** Default Helm values file for the Merchant Ad Manager Portal chart.  
**Template:** Helm Values File  
**Dependancy Level:** 1  
**Name:** values  
**Type:** HelmValues  
**Relative Path:** charts/merchant-ad-manager-portal  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - ConfigurationExternalization
    
**Implemented Features:**
    
    - Default Frontend Configuration
    - Resource Allocation Defaults
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Provides default configuration values for the merchant-ad-manager-portal Helm chart templates.  
**Logic Description:** YAML file defining key-value pairs for replicaCount, image repository/tag for the frontend SPA, service ports, resource requests/limits, ingress settings, and any runtime environment variables needed by the frontend container (e.g., API backend URLs).  
**Documentation:**
    
    - **Summary:** Stores default configurable parameters for the Merchant Ad Manager Portal deployment.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/merchant-ad-manager-portal/templates/deployment.yaml  
**Description:** Helm template for the Kubernetes Deployment of the Merchant Ad Manager Portal.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** deployment  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/merchant-ad-manager-portal/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Frontend Application Deployment
    - Pod Specification for SPA/SSR container
    - Replica Management
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes Deployment resource for the Merchant Ad Manager Portal frontend application.  
**Logic Description:** Generates a Kubernetes Deployment manifest. Uses Helm templating for image, replicas, resources, environment variables (e.g., API endpoints for backend services), and probes specific to the frontend application server (e.g., Nginx serving SPA, or Node.js for SSR).  
**Documentation:**
    
    - **Summary:** Defines the desired state for deploying and managing pods of the Merchant Ad Manager Portal.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/merchant-ad-manager-portal/templates/service.yaml  
**Description:** Helm template for the Kubernetes Service exposing the Merchant Ad Manager Portal.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** service  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/merchant-ad-manager-portal/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - Frontend Service Exposure
    - Port Mapping
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes Service resource for the Merchant Ad Manager Portal.  
**Logic Description:** Generates a Kubernetes Service manifest. Uses Helm templating for service name, type, ports (typically HTTP/HTTPS for a web portal), and selector for the frontend pods.  
**Documentation:**
    
    - **Summary:** Defines how the Merchant Ad Manager Portal is exposed within the Kubernetes cluster network, usually for an Ingress.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** charts/merchant-ad-manager-portal/templates/ingress.yaml  
**Description:** Helm template for the Kubernetes Ingress exposing the Merchant Ad Manager Portal externally.  
**Template:** Kubernetes YAML Manifest Template (Helm)  
**Dependancy Level:** 1  
**Name:** ingress  
**Type:** KubernetesResourceTemplate  
**Relative Path:** charts/merchant-ad-manager-portal/templates  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    
**Implemented Features:**
    
    - External HTTP/S Routing for Frontend
    - Hostname Configuration
    - TLS Termination for Frontend
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Templates the Kubernetes Ingress resource for externally exposing the Merchant Ad Manager Portal.  
**Logic Description:** Generates a Kubernetes Ingress manifest if `{{ .Values.ingress.enabled }}` is true. Configures hostname, paths (e.g., '/'), service backend (pointing to merchant-ad-manager-portal service), and TLS settings for the portal.  
**Documentation:**
    
    - **Summary:** Configures external access to the Merchant Ad Manager Portal application via an Ingress controller.
    
**Namespace:** {{ .Release.Namespace }}  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** environments/development/campaign-management-service-values.yaml  
**Description:** Environment-specific Helm values for deploying the Campaign Management Service to the Development environment.  
**Template:** Helm Values File  
**Dependancy Level:** 2  
**Name:** campaign-management-service-values  
**Type:** HelmValuesOverride  
**Relative Path:** environments/development  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - ConfigurationPerEnvironment
    
**Implemented Features:**
    
    - Development Environment Configuration for Campaign Service
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Overrides default Helm chart values for the Campaign Management Service specifically for the development environment.  
**Logic Description:** YAML file containing overrides for `charts/campaign-management-service/values.yaml`. Typically includes settings like lower replicaCount, development-specific image tags, debug flags enabled, resource limits appropriate for dev, and connection strings for dev databases/services.  
**Documentation:**
    
    - **Summary:** Provides configuration overrides for the Campaign Management Service deployment in the development environment.
    
**Namespace:** admanager-services-dev  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** environments/production/campaign-management-service-values.yaml  
**Description:** Environment-specific Helm values for deploying the Campaign Management Service to the Production environment.  
**Template:** Helm Values File  
**Dependancy Level:** 2  
**Name:** campaign-management-service-values  
**Type:** HelmValuesOverride  
**Relative Path:** environments/production  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - ConfigurationPerEnvironment
    
**Implemented Features:**
    
    - Production Environment Configuration for Campaign Service
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Overrides default Helm chart values for the Campaign Management Service specifically for the production environment.  
**Logic Description:** YAML file containing overrides for `charts/campaign-management-service/values.yaml`. Includes settings like higher replicaCount, production image tags, production-grade resource limits, HPA configurations, and connection strings for production databases/services.  
**Documentation:**
    
    - **Summary:** Provides configuration overrides for the Campaign Management Service deployment in the production environment.
    
**Namespace:** admanager-services-prod  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** environments/development/global-values.yaml  
**Description:** Global Helm values applicable to all services deployed in the Development environment.  
**Template:** Helm Values File  
**Dependancy Level:** 2  
**Name:** global-values  
**Type:** HelmGlobalValues  
**Relative Path:** environments/development  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - ConfigurationPerEnvironment
    
**Implemented Features:**
    
    - Global Development Environment Settings
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Provides global configuration values shared across multiple Helm charts within the development environment.  
**Logic Description:** YAML file containing common values for the development environment, such as domain names, Kubernetes namespace conventions, default image pull policy, global annotations, cert-manager issuer details, or references to common secrets.  
**Documentation:**
    
    - **Summary:** Stores global configuration parameters used by multiple applications in the development environment.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    
- **Path:** environments/development/helmfile.yaml  
**Description:** Helmfile definition for orchestrating the deployment of all Ad Manager applications and services to the Development environment.  
**Template:** Helmfile  
**Dependancy Level:** 2  
**Name:** helmfile  
**Type:** HelmOrchestration  
**Relative Path:** environments/development  
**Repository Id:** REPO-K8SMANIFESTS-009  
**Pattern Ids:**
    
    - HelmChartPattern
    - InfrastructureAsCode
    
**Implemented Features:**
    
    - Multi-Chart Deployment Orchestration for Development
    
**Requirement Ids:**
    
    - 4.4.1 (EKS manifests part)
    
**Purpose:** Defines and orchestrates the deployment of multiple Helm charts for the Ad Manager platform into the development environment.  
**Logic Description:** Helmfile YAML syntax specifying repositories, releases (charts to deploy), chart versions, target namespaces, and paths to environment-specific values files (e.g., `campaign-management-service-values.yaml`, `global-values.yaml`). Defines deployment order and dependencies between charts if necessary.  
**Documentation:**
    
    - **Summary:** Orchestrates the deployment of all Ad Manager components to the development environment using Helm and Helmfile.
    
**Namespace:** N/A  
**Metadata:**
    
    - **Category:** KubernetesManifest
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableIstioIntegrationPerService
  - enablePrometheusServiceMonitorsPerService
  - deployDebugSidecarsInDev
  
- **Database Configs:**
  
  


---

