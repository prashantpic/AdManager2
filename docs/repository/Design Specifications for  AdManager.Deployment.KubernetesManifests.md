# Software Design Specification: AdManager.Deployment.KubernetesManifests

## 1. Introduction

### 1.1 Purpose
This document provides the software design specification for the `AdManager.Deployment.KubernetesManifests` repository. This repository is responsible for storing and managing all Kubernetes manifest files required to deploy the Ad Manager platform's microservices and frontend applications onto an Amazon EKS (Elastic Kubernetes Service) cluster. It utilizes Helm for templating and packaging Kubernetes configurations, and Helmfile for orchestrating deployments across different environments.

### 1.2 Scope
The scope of this repository includes:
*   Helm charts for individual Ad Manager microservices and frontend applications.
*   Standard Kubernetes resource templates within each Helm chart (Deployments, Services, ConfigMaps, Secrets stubs, HorizontalPodAutoscalers, Ingresses).
*   Environment-specific configuration values (overrides) for Helm charts (e.g., development, staging, production).
*   Global configuration values applicable across multiple services within an environment.
*   Helmfile configurations for orchestrating the deployment of all components to specific environments.
*   Placeholders and structures for integrating with monitoring (e.g., Prometheus) and service mesh (e.g., Istio) if enabled.

This repository does **not** include:
*   The IaC (Infrastructure as Code) for provisioning the EKS cluster itself (this is handled by `REPO-INFRA-001`).
*   Application source code.
*   CI/CD pipeline definitions (though it provides the manifests consumed by CI/CD).
*   Actual secret values (secrets are referenced or stubs are provided, with values injected externally).

### 1.3 Definitions, Acronyms, and Abbreviations
*   **EKS**: Amazon Elastic Kubernetes Service
*   **Helm**: A package manager for Kubernetes.
*   **Helm Chart**: A collection of files that describe a related set of Kubernetes resources.
*   **Helmfile**: A declarative spec for deploying Helm charts. It lets you orchestrate deploying a set of charts.
*   **Kustomize**: A tool to customize Kubernetes configurations.
*   **HPA**: HorizontalPodAutoscaler.
*   **SPA**: Single Page Application.
*   **SSR**: Server-Side Rendering.
*   **IaC**: Infrastructure as Code.
*   **CI/CD**: Continuous Integration / Continuous Deployment.
*   **YAML**: YAML Ain't Markup Language, a human-friendly data serialization standard.
*   **CRD**: Custom Resource Definition (Kubernetes).
*   **PV**: PersistentVolume
*   **PVC**: PersistentVolumeClaim

## 2. System Overview
The Ad Manager platform is a microservices-based application. This repository provides the Kubernetes manifests necessary to deploy these services and frontend applications in a consistent, configurable, and automated manner using Helm and Helmfile. The manifests define how each application component runs on EKS, how it's exposed, how it's configured, and how it scales.

## 3. Design Considerations

### 3.1 Technology Stack
*   **Orchestration**: Kubernetes (Target API v1.28)
*   **Templating & Packaging**: Helm (v3.14.0)
*   **Deployment Orchestration**: Helmfile (latest stable)
*   **Customization (Optional)**: Kustomize (v5.3.0) for advanced patching post-Helm rendering if needed.
*   **Manifest Language**: YAML

### 3.2 General Principles
*   **Declarative Configuration**: All deployments are defined declaratively.
*   **Configuration Externalization**: Environment-specific configurations are externalized from the application images and managed through Helm values files.
*   **Immutability**: Docker images are treated as immutable. Configuration is injected at deploy time.
*   **Secrets Management**: Helm charts will define `Secret` stubs. Actual secret values will be injected by the CI/CD pipeline or a dedicated secrets management solution (e.g., AWS Secrets Manager with Kubernetes External Secrets Operator). **No plain text secrets will be stored in this Git repository.**
*   **DRY (Don't Repeat Yourself)**: Helm helper templates (`_helpers.tpl`) will be used for common YAML snippets and naming conventions.
*   **Environment Parity**: Aim for high parity between environments, with differences managed through values files.
*   **Resource Management**: Default resource requests and limits will be defined in `values.yaml` for each chart, tunable per environment.
*   **Health Probes**: All `Deployment` manifests will include liveness, readiness, and (where appropriate) startup probes.

### 3.3 Directory Structure
The repository will follow a standard structure for Helm-based deployments:


AdManager.Deployment.KubernetesManifests/
├── charts/
│   ├── <service-name-1>/              # Helm chart for service 1 (e.g., campaign-management-service)
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   ├── templates/
│   │   │   ├── _helpers.tpl
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── hpa.yaml
│   │   │   ├── configmap.yaml
│   │   │   ├── secret.yaml          # Secret stub
│   │   │   └── ingress.yaml         # If applicable
│   │   └── ... (other chart files like NOTES.txt, CRDs if any)
│   ├── <service-name-2>/              # Helm chart for service 2 (e.g., merchant-ad-manager-portal)
│   │   └── ...
│   └── ... (other service charts)
├── environments/
│   ├── development/
│   │   ├── global-values.yaml         # Global values for dev
│   │   ├── <service-name-1>-values.yaml # Overrides for service 1 in dev
│   │   ├── <service-name-2>-values.yaml # Overrides for service 2 in dev
│   │   └── helmfile.yaml              # Helmfile for dev environment
│   ├── staging/
│   │   ├── global-values.yaml
│   │   ├── ...-values.yaml
│   │   └── helmfile.yaml
│   └── production/
│       ├── global-values.yaml
│       ├── ...-values.yaml
│       └── helmfile.yaml
└── README.md


### 3.4 Namespacing Strategy
*   Each environment (development, staging, production) will typically deploy Ad Manager services into dedicated Kubernetes namespaces.
*   Frontend applications and backend services might reside in different namespaces or the same, based on operational preference.
*   Example: `admanager-services-dev`, `admanager-frontend-dev`.
*   Namespaces will be specified in the `helmfile.yaml` for each release and templated into manifests where necessary using `{{ .Release.Namespace }}`.

## 4. Helm Chart Design

### 4.1 Common Chart Structure
Each microservice or frontend application will have its own Helm chart. A typical chart (`charts/<service-name>/`) will include:

*   **`Chart.yaml`**:
    *   `apiVersion`: `v2`
    *   `name`: Name of the chart (e.g., `campaign-management-service`).
    *   `description`: A brief description of the chart.
    *   `type`: `application`
    *   `version`: Chart version (SemVer, e.g., `0.1.0`).
    *   `appVersion`: Application version this chart deploys (e.g., `1.0.0`).
    *   (Optional) `dependencies`, `keywords`, `home`, `sources`, `maintainers`, `icon`.
*   **`values.yaml`**: Default configuration values for the chart. See section 4.2 for common values.
*   **`templates/`**: Directory containing template files.
    *   **`_helpers.tpl`**:
        *   Defines named templates for common labels, selectors, resource names.
        *   Example: `{{ define "myservice.fullname" }}...{{ end }}`, `{{ define "myservice.labels" }}...{{ end }}`.
        *   Helps maintain consistency and reduce redundancy.
    *   **`deployment.yaml`**: Kubernetes `Deployment` resource.
    *   **`service.yaml`**: Kubernetes `Service` resource.
    *   **`hpa.yaml`**: Kubernetes `HorizontalPodAutoscaler` resource (optional, enabled via `values.yaml`).
    *   **`configmap.yaml`**: Kubernetes `ConfigMap` resource(s) (optional, if configuration data is needed).
    *   **`secret.yaml`**: Kubernetes `Secret` resource stub (optional, if secrets are referenced).
    *   **`ingress.yaml`**: Kubernetes `Ingress` resource (optional, for externally exposed services/frontends).
    *   (Optional) `servicemonitor.yaml`, `networkpolicy.yaml` based on feature toggles.
*   **`NOTES.txt`**: (Optional) Contains post-deployment notes.

### 4.2 Common `values.yaml` Parameters
Each chart's `values.yaml` should provide defaults for common configurable parameters, including:

yaml
replicaCount: 1

image:
  repository: my-docker-registry/my-service
  pullPolicy: IfNotPresent
  # Overridden by CI/CD with specific build tag
  tag: "latest"

imagePullSecrets: []
# - name: my-image-pull-secret

nameOverride: ""
fullnameOverride: ""

serviceAccount:
  # Specifies whether a service account should be created
  create: true
  # Annotations to add to the service account
  annotations: {}
  # The name of the service account to use.
  # If not set and create is true, a name is generated using the fullname template
  name: ""

podAnnotations: {}
podSecurityContext: {}
  # fsGroup: 2000

securityContext: {}
  # capabilities:
  #   drop:
  #   - ALL
  # readOnlyRootFilesystem: true
  # runAsNonRoot: true
  # runAsUser: 1000

service:
  type: ClusterIP
  port: 80 # The port the service will expose
  targetPort: http # The name or number of the port on the pods targeted by the service

# For backend services usually, frontend via Ingress
ingress:
  enabled: false
  className: "" # e.g., "alb" for AWS Load Balancer Controller
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with
  # scarce resources, such as Minikube. If you do want to specify resources, uncomment the
  # following lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
  # targetMemoryUtilizationPercentage: 80

# Liveness, Readiness, and Startup Probes
livenessProbe:
  httpGet:
    path: /health/live # Customize per application
    port: http
  initialDelaySeconds: 15
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /health/ready # Customize per application
    port: http
  initialDelaySeconds: 5
  periodSeconds: 10
startupProbe: # For applications with slow startup
  enabled: false
  httpGet:
    path: /health/startup
    port: http
  failureThreshold: 30
  periodSeconds: 10

# ConfigMap data. Example:
# configData:
#   KEY_1: "value1"
#   KEY_2: |
#     multi-line
#     value

# Secret keys (values to be provided externally). Example:
# secretKeys:
#   - API_KEY
#   - DATABASE_PASSWORD

# Feature Toggles (example from file_structure_json configuration)
# featureToggles:
#   enableIstioIntegration: false
#   enablePrometheusServiceMonitors: false
#   deployDebugSidecarsInDev: false # This might be better in environment-specific values

# Environment variables to be set in the container
# Can be direct values, or from ConfigMaps/Secrets
# env:
#   - name: MY_ENV_VAR
#     value: "some_value"
#   - name: MY_CONFIG_FROM_CM
#     valueFrom:
#       configMapKeyRef:
#         name: {{ include "myservice.fullname" . }}-config # or specific name
#         key: MY_CONFIG_KEY
#   - name: MY_SECRET_FROM_SECRET
#     valueFrom:
#       secretKeyRef:
#         name: {{ include "myservice.fullname" . }}-secret # or specific name
#         key: MY_SECRET_KEY

# Node selection constraints
nodeSelector: {}
tolerations: []
affinity: {}


### 4.3 Template: `deployment.yaml`
This template defines the `Deployment` resource.
*   **`apiVersion: apps/v1`**
*   **`kind: Deployment`**
*   **`metadata`**:
    *   `name: {{ include "myservice.fullname" . }}`
    *   `labels: {{ include "myservice.labels" . | nindent 4 }}`
    *   `namespace: {{ .Release.Namespace }}`
*   **`spec`**:
    *   `replicas: {{ .Values.replicaCount }}`
    *   `selector: matchLabels: {{ include "myservice.selectorLabels" . | nindent 6 }}`
    *   `strategy`: Configurable update strategy (e.g., `RollingUpdate` with `maxUnavailable`, `maxSurge`).
    *   `template` (PodTemplateSpec):
        *   `metadata`:
            *   `labels: {{ include "myservice.selectorLabels" . | nindent 8 }}`
            *   `annotations: {{ toYaml .Values.podAnnotations | nindent 8 }}` (if any)
        *   `spec`:
            *   `imagePullSecrets: {{ toYaml .Values.imagePullSecrets | nindent 10 }}`
            *   `serviceAccountName: {{ include "myservice.serviceAccountName" . }}`
            *   `securityContext: {{ toYaml .Values.podSecurityContext | nindent 12 }}`
            *   `containers`:
                *   `name: {{ .Chart.Name }}`
                *   `securityContext: {{ toYaml .Values.securityContext | nindent 16 }}`
                *   `image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"`
                *   `imagePullPolicy: {{ .Values.image.pullPolicy }}`
                *   `ports`: Define container ports (e.g., `name: http`, `containerPort: {{ .Values.service.targetPort }}`).
                *   `env`: Populate from `values.yaml`, ConfigMaps, and Secrets.
                    *   Use `envFrom` to source all keys from a ConfigMap/Secret or `valueFrom` for specific keys.
                *   `livenessProbe`, `readinessProbe`, `startupProbe` configured from `values.yaml`.
                *   `resources: {{ toYaml .Values.resources | nindent 16 }}`
                *   `volumeMounts`: If ConfigMaps or Secrets are mounted as files, or for PersistentVolumes.
            *   `volumes`: Define volumes (e.g., from ConfigMaps, Secrets, PVCs).
            *   (Optional) `nodeSelector`, `affinity`, `tolerations`.

### 4.4 Template: `service.yaml`
This template defines the `Service` resource.
*   **`apiVersion: v1`**
*   **`kind: Service`**
*   **`metadata`**:
    *   `name: {{ include "myservice.fullname" . }}`
    *   `labels: {{ include "myservice.labels" . | nindent 4 }}`
    *   `namespace: {{ .Release.Namespace }}`
*   **`spec`**:
    *   `type: {{ .Values.service.type }}`
    *   `ports`:
        *   `port: {{ .Values.service.port }}`
        *   `targetPort: {{ .Values.service.targetPort }}` (can be port name or number)
        *   `protocol: TCP`
        *   `name: http` (or other descriptive name)
    *   `selector: {{ include "myservice.selectorLabels" . | nindent 6 }}`

### 4.5 Template: `hpa.yaml`
This template defines the `HorizontalPodAutoscaler` resource.
*   Wrapped in `{{- if .Values.autoscaling.enabled }}` block.
*   **`apiVersion: autoscaling/v2`** (or `v2beta2` depending on K8s version and metrics used)
*   **`kind: HorizontalPodAutoscaler`**
*   **`metadata`**:
    *   `name: {{ include "myservice.fullname" . }}`
    *   `labels: {{ include "myservice.labels" . | nindent 4 }}`
    *   `namespace: {{ .Release.Namespace }}`
*   **`spec`**:
    *   `scaleTargetRef`:
        *   `apiVersion: apps/v1`
        *   `kind: Deployment`
        *   `name: {{ include "myservice.fullname" . }}`
    *   `minReplicas: {{ .Values.autoscaling.minReplicas }}`
    *   `maxReplicas: {{ .Values.autoscaling.maxReplicas }}`
    *   `metrics`:
        *   If CPU target: `type: Resource, resource: { name: cpu, target: { type: Utilization, averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }} } }`
        *   If Memory target: `type: Resource, resource: { name: memory, target: { type: Utilization, averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }} } }`
        *   Support for custom metrics (e.g., from Prometheus via KEDA or custom metrics adapter) if needed.

### 4.6 Template: `configmap.yaml`
This template defines `ConfigMap` resources.
*   Can be a single ConfigMap or multiple, potentially iterated from `values.yaml`.
*   **`apiVersion: v1`**
*   **`kind: ConfigMap`**
*   **`metadata`**:
    *   `name: {{ include "myservice.fullname" . }}-config` (or more specific if multiple)
    *   `labels: {{ include "myservice.labels" . | nindent 4 }}`
    *   `namespace: {{ .Release.Namespace }}`
*   **`data`**:
    *   Populated from `.Values.configData` or other structured values.
    *   Example: `{{- range $key, $value := .Values.configData }}`
        `  {{ $key }}: {{ $value | quote }}`
        `{{- end }}`
    *   Or directly: `app-config.json: {{ .Values.appConfigJson | toJson | quote }}`

### 4.7 Template: `secret.yaml` (Stub)
This template defines `Secret` resource stubs. **Actual secret values are NOT hardcoded here.**
*   **`apiVersion: v1`**
*   **`kind: Secret`**
*   **`metadata`**:
    *   `name: {{ include "myservice.fullname" . }}-secret` (or more specific)
    *   `labels: {{ include "myservice.labels" . | nindent 4 }}`
    *   `namespace: {{ .Release.Namespace }}`
*   **`type: Opaque`**
*   **`data`**:
    *   Contains keys that are expected by the application.
    *   Values are placeholders or templated for CI/CD injection (e.g., `API_KEY: {{ .Values.secrets.apiKey | default "PLACEHOLDER_BASE64_ENCODED_API_KEY" | b64enc }}`).
    *   Alternatively, if using tools like ExternalSecrets operator, this manifest might not be needed, or it would be a CRD for ExternalSecret. For basic Helm, a stub is common.
    *   The `.Values.secretKeys` list can be used to iterate and create placeholders for keys.
    yaml
    {{- if .Values.secretKeys }}
    data:
    {{- range .Values.secretKeys }}
      {{ . }}: "" # Placeholder, to be populated externally or by CI/CD
    {{- end }}
    {{- end }}
    
    Or if values are passed during `helm install/upgrade` from a secure source:
    yaml
    {{- if .Values.secretData }}
    data:
    {{- range $key, $value := .Values.secretData }}
      {{ $key }}: {{ $value | b64enc | quote }}
    {{- end }}
    {{- end }}
    
    **Note**: It's crucial that `.Values.secretData` is populated from a secure source (e.g., CI/CD secret variables, Vault) and not committed to `values.yaml` files in Git.

### 4.8 Template: `ingress.yaml`
This template defines the `Ingress` resource.
*   Wrapped in `{{- if .Values.ingress.enabled }}` block.
*   **`apiVersion: networking.k8s.io/v1`**
*   **`kind: Ingress`**
*   **`metadata`**:
    *   `name: {{ include "myservice.fullname" . }}`
    *   `labels: {{ include "myservice.labels" . | nindent 4 }}`
    *   `annotations: {{ toYaml .Values.ingress.annotations | nindent 4 }}`
    *   `namespace: {{ .Release.Namespace }}`
*   **`spec`**:
    *   `ingressClassName: {{ .Values.ingress.className | quote }}` (if applicable)
    *   `rules`: Iterate over `{{ .Values.ingress.hosts }}`.
        *   `host: {{ .host | quote }}`
        *   `http: paths:` Iterate over `{{ .paths }}`.
            *   `path: {{ .path | quote }}`
            *   `pathType: {{ .pathType | quote }}`
            *   `backend: service: { name: {{ include "myservice.fullname" $ }}, port: { name: http } }` (or specified port name/number)
    *   `tls`: Iterate over `{{ .Values.ingress.tls }}`.
        *   `hosts`: Iterate over `{{ .hosts }}`.
            *   `- {{ . | quote }}`
        *   `secretName: {{ .secretName | quote }}`

### 4.9 Specific Chart: `charts/campaign-management-service/`
This chart will implement all templates described in sections 4.3 to 4.8.
*   **`values.yaml`** will be tailored for a typical backend NestJS microservice, including database connection strings (as secret keys), Kafka/SQS/SNS config (as config/secret keys), and appropriate probe paths (e.g., `/api/v1/health/live`, `/api/v1/health/ready`).
*   It will likely require `ConfigMap`s for application-level settings and `Secret` stubs for database credentials, API keys for external services (ad networks).

### 4.10 Specific Chart: `charts/merchant-ad-manager-portal/`
This chart deploys the frontend SPA.
*   **`values.yaml`**:
    *   `image.repository` will point to the frontend application image (e.g., an Nginx container serving static SPA files, or a Node.js container for SSR).
    *   `service.targetPort` might be `80` (for Nginx) or `3000` (for Node.js SSR).
    *   `env`: May include runtime environment variables like `API_GATEWAY_URL`.
    *   `livenessProbe`/`readinessProbe`: Paths will target the frontend server's health endpoint or a static file.
    *   `ingress.enabled` will typically be `true`.
*   **`deployment.yaml`**:
    *   Container spec will depend on how the SPA is served. If Nginx, it will mount static assets. If Node.js SSR, it will run the Node.js application.
*   **`configmap.yaml`**: Could be used to inject frontend-specific runtime configurations (e.g., Nginx config snippets, feature flags for UI).

## 5. Environment Configuration (`environments/`)

### 5.1 `global-values.yaml`
Located in each environment directory (e.g., `environments/development/global-values.yaml`).
*   Contains values shared across multiple charts within that specific environment.
*   Examples: `global.domainName`, `global.clusterIssuerName` (for cert-manager), `global.imagePullPolicy` (e.g., `Always` for dev, `IfNotPresent` for prod), common annotations, default resource requests/limits for the environment.
*   These values can be referenced in individual chart templates using `{{ .Values.global.someKey }}` if the Helm charts are designed to consume them (often passed via `helmfile`'s `values` or `globals` section).

### 5.2 `<service-name>-values.yaml`
Located in each environment directory (e.g., `environments/development/campaign-management-service-values.yaml`).
*   Overrides values from the corresponding chart's `values.yaml` and the environment's `global-values.yaml`.
*   Tailors the deployment for the specific environment.
*   Examples:
    *   Development: `replicaCount: 1`, lower resource limits, debug flags enabled, dev database connection strings (referenced as secrets).
    *   Production: Higher `replicaCount`, production resource limits, HPA enabled, production database connection strings.

### 5.3 `helmfile.yaml`
Located in each environment directory (e.g., `environments/development/helmfile.yaml`).
*   Orchestrates the deployment of all Ad Manager applications and services for that environment.
*   **`repositories`**: Defines Helm chart repositories if charts are sourced externally (not applicable if all charts are local).
*   **`releases`**: Defines each application/service to be deployed.
    yaml
    # Example structure for helmfile.yaml
    # environments:
    #   default:
    #     values:
    #       - ./global-values.yaml # Load global values for this environment

    releases:
      - name: campaign-management # Release name
        namespace: admanager-services-dev # Target namespace
        chart: ../../charts/campaign-management-service # Path to local chart
        version: 0.1.0 # Chart version (optional if always latest from path)
        values:
          - ./campaign-management-service-values.yaml # Environment-specific overrides
          # - secrets: ./campaign-management-service-secrets.sops.yaml # If using Helm Secrets + SOPS
        # secrets: # If using helm-secrets plugin
          # - campaign-management-service-secrets.yaml # Path to decrypted secrets file (not in git)

      - name: merchant-portal
        namespace: admanager-frontend-dev
        chart: ../../charts/merchant-ad-manager-portal
        values:
          - ./merchant-ad-manager-portal-values.yaml
        # ... and so on for other services
    
*   Helmfile allows defining dependencies between releases, applying values hierarchically, and integrating with secret management plugins (e.g., `helm-secrets`).

## 6. Kubernetes Resources Configuration Details

### 6.1 Deployments
*   **Update Strategy**: Default to `RollingUpdate`. `maxUnavailable` and `maxSurge` should be configurable, sensible defaults (e.g., `25%`).
*   **Probes**:
    *   Liveness: To restart unhealthy pods. Path defined in `values.yaml`.
    *   Readiness: To signal when a pod is ready to serve traffic. Path defined in `values.yaml`.
    *   Startup (optional): For applications with long startup times, to allow more time before liveness/readiness probes kick in. Path and thresholds defined in `values.yaml`.
*   **Resource Requests/Limits**: Defined in `values.yaml`, critical for scheduling and stability. Requests should reflect typical usage, limits prevent runaway resource consumption.

### 6.2 Services
*   **Type**: Typically `ClusterIP` for backend services accessed via Ingress or internally. `LoadBalancer` or `NodePort` only if direct external access without Ingress is required (uncommon for microservices).
*   **Ports**: Clearly define `port` (exposed by Service) and `targetPort` (on the Pod). Use named ports for clarity.

### 6.3 Ingresses
*   **Controller**: Support for a common Ingress controller (e.g., AWS Load Balancer Controller, Nginx Ingress) through `ingressClassName` and annotations.
*   **TLS**: Configuration for TLS termination, referencing a `Secret` containing the TLS certificate (often managed by `cert-manager`).
*   **Rules**: Path-based and host-based routing.

### 6.4 ConfigMaps
*   Used for non-sensitive configuration data.
*   Can be mounted as environment variables or files into pods.
*   Chart templates should make it easy to define key-value pairs or entire configuration files.

### 6.5 Secrets
*   **Stubs Only**: Charts contain `Secret` manifest stubs defining keys.
*   **External Population**: Values populated by:
    1.  CI/CD pipeline (e.g., `helm --set-string secretKey=valueFromCICDSecret`).
    2.  Kubernetes External Secrets operator fetching from AWS Secrets Manager or HashiCorp Vault.
    3.  Tools like `helm-secrets` with SOPS for decrypting version-controlled encrypted files at deploy time (encrypted files themselves can be in Git).
*   Consumed as environment variables or mounted files.

### 6.6 HorizontalPodAutoscalers (HPAs)
*   Enabled/disabled via `values.yaml`.
*   Scale based on CPU and/or memory utilization. Custom metrics support if needed.
*   `minReplicas` and `maxReplicas` are crucial.

### 6.7 Feature Toggles in Kubernetes Manifests
*   **ServiceMonitors (Prometheus)**:
    *   If `values.featureToggles.enablePrometheusServiceMonitors` is true, relevant charts (e.g., backend services) should include a `ServiceMonitor` CRD manifest template.
    *   This template will define how Prometheus discovers and scrapes metrics from the service.
    yaml
    # Example servicemonitor.yaml template (simplified)
    {{- if .Values.featureToggles.enablePrometheusServiceMonitors }}
    apiVersion: monitoring.coreos.com/v1
    kind: ServiceMonitor
    metadata:
      name: {{ include "myservice.fullname" . }}
      labels:
        {{- include "myservice.labels" . | nindent 4 }}
        # Add specific labels for Prometheus discovery if needed
    spec:
      selector:
        matchLabels:
          {{- include "myservice.selectorLabels" . | nindent 10 }}
      namespaceSelector:
        matchNames:
          - {{ .Release.Namespace }}
      endpoints:
      - port: http # Or the name of the metrics port in your Service
        path: /metrics # Or your application's metrics path
        interval: 15s
    {{- end }}
    
*   **Istio Integration**:
    *   If `values.featureToggles.enableIstioIntegration` is true, pod annotations for Istio sidecar injection (`sidecar.istio.io/inject: "true"`) might be added to `Deployment` templates.
    *   Could also involve templating Istio-specific CRDs like `VirtualService` or `DestinationRule` if managed at the application chart level (though often managed separately).
*   **Debug Sidecars**:
    *   If `values.featureToggles.deployDebugSidecarsInDev` is true (and the environment is development), `Deployment` templates could conditionally include a debug sidecar container definition.

## 7. CI/CD Integration
*   The CI/CD pipeline will be responsible for:
    *   Linting Helm charts (`helm lint`).
    *   Packaging charts (`helm package`) if they are to be stored in a chart repository.
    *   Injecting actual secret values.
    *   Running `helmfile sync` or `helmfile apply` for the target environment, pointing to the appropriate `helmfile.yaml` and providing necessary overrides or secret files.
    *   Image tags in `values.yaml` will be overridden by the CI/CD pipeline with the specific tag of the image built for deployment.

## 8. Kustomize Usage (Optional)
*   While Helm and Helmfile provide robust environment configuration, Kustomize can be used for:
    *   Applying last-mile patches to Helm-rendered manifests if complex modifications are needed beyond what values files allow.
    *   Managing variants of configurations that are not easily expressible through Helm values (e.g., complex overlays for specific CRDs).
*   If used, Kustomize `kustomization.yaml` files would typically be structured per environment or per base, consuming Helm chart outputs as resources and applying patches or overlays.
*   This would likely involve a CI/CD step: `helm template ... | kustomize build | kubectl apply -f -`.
*   For the current scope, Helmfile's environment-specific values files are the primary mechanism for differentiation. Kustomize is a secondary option for more complex scenarios.

## 9. Documentation and Maintenance
*   `README.md` at the root of the repository will explain the structure, conventions, and how to deploy using Helmfile.
*   Each Helm chart should have a `README.md` explaining its specific configuration options (`values.yaml`).
*   Charts and templates should be well-commented.
*   Regularly update Helm, Helmfile, and Kustomize versions.
*   Keep Kubernetes API versions in manifests up-to-date with the target EKS cluster version.

## 10. Monitoring & Logging Considerations (Placeholders)
*   **Labels**: Pods and Services will have consistent labels (defined in `_helpers.tpl`) to facilitate log querying and metrics aggregation.
*   **Annotations**: Pods can include annotations for Prometheus scraping if `ServiceMonitor`s are not used (e.g., `prometheus.io/scrape: "true"`, `prometheus.io/port: "..."`).
*   Log shipping is typically handled by a cluster-level agent (e.g., Fluentd, Fluent Bit DaemonSet) configured by the IaC repository (`REPO-INFRA-001`), not directly in these application manifests, but application logs should be written to `stdout/stderr` for easy collection.

This SDS provides the blueprint for creating the Kubernetes manifests. The focus is on reusable, configurable, and environment-aware Helm charts orchestrated by Helmfile.