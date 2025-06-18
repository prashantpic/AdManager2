---
title: System Configuration Management
sidebar_label: System Configuration
---

# System Configuration Management

This guide is for Platform Administrators to understand and manage global system configurations for the Ad Manager Platform. Proper configuration is crucial for the platform's overall behavior, security, integrations, and tenant (merchant) experience.

Configurations are typically managed through a combination of the Platform Admin Portal (for dynamic settings) and Infrastructure as Code (IaC) tools like AWS CDK or Terraform (for foundational or less frequently changed settings).

## Accessing the Admin Interface for Configurations

*   **Platform Admin Portal:** Dynamic configurations, feature flags, and some integration settings can often be managed via a dedicated "System Settings" or "Configuration" section within the Platform Admin Portal. Access to this portal is restricted to users with Platform Administrator roles.
    *   *Navigation Example:* Login to Admin Portal -> Sidebar -> Settings -> System Configuration.
*   **IaC Tools:** Foundational settings, environment-specific parameters, and infrastructure-related configurations are managed via IaC scripts (e.g., AWS CDK, Terraform). Changes here require code commits, reviews, and CI/CD pipeline deployments.
*   **AWS Management Console:** Direct access to services like AWS Systems Manager Parameter Store and AWS Secrets Manager might be required for viewing or, in rare cases, emergency modification of certain parameters. This access is highly restricted.

## Managing Global Settings

Global settings affect the entire platform or provide default behaviors that can sometimes be overridden at the merchant level. These are often stored in **AWS Systems Manager Parameter Store** for secure, hierarchical storage and versioning.

*   **Feature Flags:**
    *   Purpose: Enable or disable specific platform features globally or for beta testing with select tenants.
    *   Example Parameter: `/admanager/features/newReportingDashboard/enabled` (Value: `true`/`false`)
    *   Management: Via Admin Portal or IaC updates.
*   **Default Behaviors:**
    *   Purpose: Configure default timeouts, retry policies for internal services, default reporting periods, etc.
    *   Example Parameter: `/admanager/defaults/apiTimeoutMs` (Value: `5000`)
*   **Service Endpoints (Internal):**
    *   Purpose: Define internal service discovery endpoints if not using a fully automated service mesh. Often managed by IaC.
    *   Example Parameter: `/admanager/services/reportingService/endpointUrl`
*   **Quotas and Limits:**
    *   Purpose: Define platform-wide default quotas (e.g., max number of campaigns per merchant, max product feed size) that might be adjustable per subscription plan.
    *   Example Parameter: `/admanager/quotas/defaultMaxCampaigns` (Value: `100`)

## Managing Secret Configurations

Sensitive configurations, such as API keys, database credentials, encryption keys, and external service secrets, are managed with high security using **AWS Secrets Manager**. Secrets Manager provides automatic rotation capabilities for certain secret types.

*   **Third-Party API Keys:**
    *   Purpose: Credentials for integrating with external ad networks (Google, Facebook), payment gateways, email services, etc.
    *   Example Secret: `/admanager/secrets/googleAdsApiKey`, `/admanager/secrets/stripeSecretKey`
    *   Management: Secrets are typically populated manually (or via secure scripts) into Secrets Manager. Applications retrieve them at runtime using IAM permissions.
*   **Database Credentials:**
    *   Purpose: Username/password combinations for accessing Amazon RDS instances or other databases.
    *   Example Secret: `/admanager/secrets/rds/masterUserPassword`
    *   Management: Preferably managed with automatic rotation if supported by RDS and Secrets Manager.
*   **Encryption Keys & Certificates:**
    *   Purpose: Keys used for application-level encryption, SSL/TLS certificates for custom domains (if applicable).
    *   Example Secret: `/admanager/secrets/dataEncryptionKey`, `/admanager/ssl/platformDomainCert`
    *   Management: Securely generated and stored. Access is tightly controlled.

## Integration Endpoints (External)

Configuration for critical external integration points. These might be stored in Parameter Store or as environment variables for services if less sensitive, or Secrets Manager if they involve credentials.

*   **External Ad Network API Base URLs:**
    *   Example Parameter: `/admanager/integrations/googleAds/apiUrl`
*   **Payment Gateway Endpoints:**
    *   Example Parameter: `/admanager/integrations/stripe/apiBaseUrl`
*   **Identity Provider (IdP) Configuration:**
    *   Example Parameters for OIDC/SAML integration: `/admanager/auth/oidc/issuerUrl`, `/admanager/auth/oidc/clientId`

## Best Practices and Security Considerations

*   **Principle of Least Privilege:** IAM roles for applications and administrators should only grant permissions necessary to read/write specific configuration parameters or secrets.
*   **Secure Storage:** Always use AWS Secrets Manager for secrets. Use Parameter Store (SecureString type for sensitive data) or encrypted S3 buckets for other configurations. Avoid hardcoding secrets or sensitive configurations in application code or unencrypted environment variables.
*   **Change Management:** Implement a strict change management process for all configuration updates, especially for production environments. This includes peer reviews for IaC changes and audit trails for portal-based changes.
*   **Auditing:** Ensure all access and modifications to configurations and secrets are logged (e.g., CloudTrail for AWS services). Regularly review these logs.
*   **Environment Segregation:** Maintain separate configurations for different environments (dev, staging, prod) using distinct Parameter Store paths or Secrets Manager names.
*   **Configuration Drift Detection:** Implement mechanisms (e.g., AWS Config) to detect unintended or unauthorized changes to configurations.
*   **Regular Review & Rotation:** Periodically review all configurations for relevance and security. Rotate secrets regularly, leveraging automatic rotation where possible.

## Auditing Configuration Changes

*   **AWS CloudTrail:** Logs API calls made to AWS services, including Parameter Store and Secrets Manager. This provides an audit trail of who accessed or modified configurations and when.
*   **Application Logs:** Critical configuration changes made through the Admin Portal should be logged by the application itself, including the user who made the change and the old/new values (masking sensitive parts).
*   **IaC Version Control:** Changes to configurations managed by IaC are tracked through Git history, including author, timestamp, and commit messages detailing the change.

By following these guidelines, Platform Administrators can effectively and securely manage the system configurations vital to the Ad Manager Platform's operation.