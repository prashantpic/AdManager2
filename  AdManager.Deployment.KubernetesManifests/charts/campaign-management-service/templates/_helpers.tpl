{{/*
Expand the name of the chart.
*/}}
{{- define "campaign-management-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (e.g. DNS names).
If Release.Name contains chart name it will be used as a full name.
*/}}
{{- define "campaign-management-service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart version specific labels
*/}}
{{- define "campaign-management-service.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "campaign-management-service.labels" -}}
helm.sh/chart: {{ include "campaign-management-service.chart" . }}
{{ include "campaign-management-service.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "campaign-management-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "campaign-management-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "campaign-management-service.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "campaign-management-service.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Return the appropriate apiVersion for ingress.
*/}}
{{- define "campaign-management-service.ingress.apiVersion" -}}
  {{- if and (.Capabilities.APIVersions.Has "networking.k8s.io/v1") (semverCompare ">=1.19-0" .Capabilities.KubeVersion.GitVersion) -}}
    {{- print "networking.k8s.io/v1" -}}
  {{- else if .Capabilities.APIVersions.Has "networking.k8s.io/v1beta1" -}}
    {{- print "networking.k8s.io/v1beta1" -}}
  {{- else -}}
    {{- print "extensions/v1beta1" -}}
  {{- end -}}
{{- end -}}

{{/*
Return if ingress is stable.
*/}}
{{- define "campaign-management-service.ingress.isStable" -}}
  {{- eq (include "campaign-management-service.ingress.apiVersion" .) "networking.k8s.io/v1" -}}
{{- end -}}

{{/*
Return if ingress supports pathType.
*/}}
{{- define "campaign-management-service.ingress.supportsPathType" -}}
  {{- or (eq (include "campaign-management-service.ingress.apiVersion" .) "networking.k8s.io/v1") (and (eq (include "campaign-management-service.ingress.apiVersion" .) "networking.k8s.io/v1beta1") (semverCompare ">=1.18-0" .Capabilities.KubeVersion.GitVersion)) -}}
{{- end -}}