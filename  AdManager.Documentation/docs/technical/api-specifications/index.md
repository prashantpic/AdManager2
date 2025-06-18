---
title: API Specifications
sidebar_label: API Index
---

# API Specifications

This section provides documentation for the Ad Manager Platform APIs, enabling developers to integrate external systems, automate tasks, and build custom solutions on top of the platform.

The platform exposes RESTful APIs using JSON for request and response bodies. All APIs are secured and require proper authentication.

## Available APIs

The Ad Manager Platform offers several APIs tailored to different integration needs:

*   **Merchant API:**
    *   **Purpose:** Allows merchants (or third-party applications acting on their behalf) to programmatically manage their advertising resources. This includes operations for campaigns, ad sets, ads, product catalogs, promotions, and accessing performance analytics data.
    *   **Audience:** Merchants, Third-party developers building merchant-facing tools.
    *   **Documentation:**
        *   [View Merchant API OpenAPI/Swagger Specification](placeholder-merchant-api-v1-swagger-link.html)
        *   *(Note: This documentation is typically generated directly from the API codebase, e.g., from `REPO-CAMP-001` (Campaign Service) and other relevant microservice repositories that expose merchant-facing endpoints.)*
    *   **Key Endpoints (Examples):**
        *   `POST /v1/campaigns` - Create a new campaign.
        *   `GET /v1/campaigns/{campaignId}` - Retrieve campaign details.
        *   `GET /v1/reports/campaign-performance` - Fetch performance data.

*   **Admin API:**
    *   **Purpose:** Used by platform administrators for system-level management and operational tasks. This includes managing platform-wide configurations, tenant (merchant) lifecycle management, monitoring system health, and accessing aggregated platform analytics.
    *   **Audience:** Platform Administrators, Internal Operations Teams.
    *   **Documentation:**
        *   [View Admin API OpenAPI/Swagger Specification](placeholder-admin-api-v1-swagger-link.html)
        *   *(Note: Access to this API is highly restricted.)*
    *   **Key Endpoints (Examples):**
        *   `POST /v1/admin/merchants` - Onboard a new merchant.
        *   `GET /v1/admin/system/health` - Check system health status.
        *   `PUT /v1/admin/config/{configKey}` - Update a global configuration.

*   **Third-Party App Integration API (Partner API):**
    *   **Purpose:** Provides specific endpoints designed for certified external applications or partners to integrate with the platform. This API might have a different scope, authentication mechanism (e.g., OAuth 2.0 app grants), or stricter rate limits compared to the Merchant API.
    *   **Audience:** Approved Technology Partners, Large Enterprise Integrators.
    *   **Documentation:**
        *   [View Partner API OpenAPI/Swagger Specification](placeholder-partner-api-v1-swagger-link.html)
    *   **Key Endpoints (Examples):**
        *   `POST /v1/partner/webhooks` - Register a webhook for event notifications.
        *   `GET /v1/partner/data-export` - Access bulk data export facilities.

## Authentication and Authorization

*   **Authentication:** All Ad Manager APIs utilize **JSON Web Tokens (JWTs)** for authentication.
    *   Clients must obtain a JWT by authenticating against the Ad Manager identity provider (e.g., Amazon Cognito or a custom OAuth2 server).
    *   The JWT must be included in the `Authorization` header of every API request using the `Bearer` scheme:
        ```
        Authorization: Bearer <your_jwt_token>
        ```
*   **Authorization:**
    *   Once authenticated, authorization is enforced based on the user's role and permissions associated with the JWT.
    *   Merchant API access is scoped to the specific merchant account linked to the authenticated user.
    *   Admin API access requires specific administrative roles.
    *   Attempts to access resources or perform actions outside the permitted scope will result in a `403 Forbidden` error.

## Rate Limiting

To ensure platform stability and fair usage, API requests are subject to rate limits.
*   Limits are generally applied per API key or per user, per API endpoint group.
*   Default rate limits: [Specify default limits, e.g., 10 requests/second for read operations, 5 requests/second for write operations per user].
*   If rate limits are exceeded, the API will respond with a `429 Too Many Requests` HTTP status code.
*   The response headers may include `Retry-After` (indicating how long to wait before retrying) and custom headers detailing the current rate limit status (e.g., `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).
*   It is crucial for clients to implement proper error handling and retry mechanisms (e.g., exponential backoff) for `429` responses.
*   For specific rate limit details and potential for increased limits, please refer to [Link to Rate Limiting Policy Page or Contact Support].

## API Versioning

The Ad Manager Platform APIs follow a versioning policy to manage changes and ensure backward compatibility where possible.
*   The API version is included in the URL path (e.g., `/api/v1/...`).
*   The current stable version for most APIs is **v1**.
*   **Breaking Changes:** Will result in a new API version (e.g., `/api/v2/...`). We aim to provide ample notice and migration paths for breaking changes.
*   **Non-Breaking Changes:** (e.g., adding new optional request parameters or new fields to responses) may be introduced to the current API version. Clients should be designed to gracefully handle additional, unexpected fields in JSON responses.
*   **Deprecation Policy:** Older API versions will be supported for a minimum period (e.g., 12 months) after a new version is released. A deprecation schedule will be communicated via [Platform Announcements/Changelog].
*   Refer to the [API Changelog](placeholder-api-changelog-link) for details on updates and version history.

## Error Handling

APIs use standard HTTP status codes to indicate success or failure. JSON responses for errors typically include a `message` field and potentially an `errorCode` or `details` field for more specific information.

Common Status Codes:
*   `200 OK`: Request successful.
*   `201 Created`: Resource created successfully.
*   `204 No Content`: Request successful, no content to return.
*   `400 Bad Request`: Invalid request payload or parameters.
*   `401 Unauthorized`: Authentication failed or missing.
*   `403 Forbidden`: Authenticated user does not have permission.
*   `404 Not Found`: Requested resource does not exist.
*   `429 Too Many Requests`: Rate limit exceeded.
*   `500 Internal Server Error`: An unexpected error occurred on the server.
*   `503 Service Unavailable`: The server is temporarily unable to handle the request (e.g., due to maintenance or overload).

Clients should be prepared to handle these status codes appropriately.