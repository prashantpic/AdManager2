# Architecture Design Specification

# 1. Patterns

## 1.1. Request-Reply
### 1.1.2. Type
RequestReply

### 1.1.3. Implementation
Synchronous HTTP/REST (potentially gRPC for internal East-West traffic) interactions, primarily exposed via Amazon API Gateway and implemented using NestJS controllers within microservices.

### 1.1.4. Applicability
Essential for client-facing operations (UI, third-party apps via REQ-TCE-008) and internal synchronous inter-service communication where an immediate response is required. Examples: User-initiated actions like campaign creation (REQ-CMO-001), data retrieval for display (REQ-3353), and API authentication/authorization flows (REQ-IAM-007).

## 1.2. Publish-Subscribe
### 1.2.2. Type
PublishSubscribe

### 1.2.3. Implementation
Asynchronous event distribution using Amazon SNS topics.

### 1.2.4. Applicability
Broadcasting domain events to multiple interested microservices or downstream systems, promoting loose coupling. Examples: Product data updates from core platform (REQ-CPSI-001, REQ-PC-002 triggering Ad Manager updates), platform-wide notifications (NotificationEventsTopic), distributing performance data for various analytics consumers (PerformanceDataTopic for REQ-ARP-005), and system alerts (REQ-POA-003).

## 1.3. Message Queue
### 1.3.2. Type
MessageQueue

### 1.3.3. Implementation
Asynchronous point-to-point messaging using Amazon SQS queues.

### 1.3.4. Applicability
Decoupling services for background processing, load leveling, and ensuring reliable execution of individual tasks/commands. Examples: Processing campaign lifecycle events (CampaignEventsQueue from REQ-CMO-002 status changes), managing product synchronization tasks (ProductSyncEventsQueue for REQ-PC-002), handling Data Subject Rights requests (REQ-MDGC-004), and managing ad network synchronization tasks for product feeds (REQ-03-003).

## 1.4. API Gateway
### 1.4.2. Type
APIGateway

### 1.4.3. Implementation
Amazon API Gateway managing RESTful APIs (and potentially WebSocket APIs if needed in future, though not explicitly required now).

### 1.4.4. Applicability
Single, managed entry point for all external client requests (Merchant Portal, Admin Portal, Affiliate Portal, Third-Party Apps REQ-TCE-008) to backend microservices. Handles request routing, authentication (REQ-IAM-007), authorization, rate limiting, SSL termination, and API versioning.

## 1.5. Circuit Breaker
### 1.5.2. Type
CircuitBreaker

### 1.5.3. Implementation
Implemented within microservices using libraries (e.g., compatible with NestJS) for calls to external dependencies (Ad Networks, Core Platform API) and potentially critical internal services.

### 1.5.4. Applicability
Enhancing system resilience by preventing cascading failures when communicating with potentially unreliable external services (e.g., Ad Network APIs per REQ-03-007, REQ-TCE-002) or internal services experiencing issues. Allows services to fail fast and recover gracefully.

## 1.6. Retry Pattern
### 1.6.2. Type
Retry

### 1.6.3. Implementation
Client-side logic within services, often with exponential backoff and jitter, for transient errors during API calls (e.g., using Axios interceptors or custom logic for AWS SDK calls).

### 1.6.4. Applicability
Handling temporary, recoverable errors (e.g., network glitches, rate limits) when interacting with external ad networks (REQ-03-007, REQ-TCE-002), the core `[PlatformName]` platform APIs (REQ-CPSI-006), or other microservices. Essential for improving reliability of distributed communications.

## 1.7. File-Based Integration
### 1.7.2. Type
FileTransfer

### 1.7.3. Implementation
Utilizing Amazon S3 for staging uploaded files (CSV, XML), with event notifications (e.g., S3 event to SQS/Lambda) triggering batch processing by relevant microservices.

### 1.7.4. Applicability
Required for specific bulk data operations like importing product data for advertising catalogs (REQ-PC-004). Not for general inter-service communication but essential for this data onboarding feature.

## 1.8. Idempotent Receiver
### 1.8.2. Type
IdempotentReceiver

### 1.8.3. Implementation
Logic within message consumers (for SQS queues and SNS subscriptions) to detect and safely discard duplicate messages, often using a combination of message IDs and business keys stored in a persistent cache or database (e.g., DynamoDB or ElastiCache).

### 1.8.4. Applicability
Ensuring that messages processed via asynchronous channels (SQS, SNS) do not cause unintended side effects if delivered more than once (at-least-once delivery semantics). Critical for data integrity in event-driven workflows like product synchronization (REQ-PC-002) and campaign event processing.

## 1.9. Dead Letter Queue
### 1.9.2. Type
DeadLetterQueue

### 1.9.3. Implementation
Configuring Amazon SQS queues to forward unprocessable messages to a designated DLQ after a set number of retries.

### 1.9.4. Applicability
Isolating problematic messages that consistently fail processing in asynchronous workflows (e.g., ad network feed submissions REQ-03-003, campaign status updates REQ-CMO-002 via queues), preventing them from blocking main queues and allowing for offline analysis and remediation. Essential for robust messaging as per Messaging Layer design.

## 1.10. Transactional Outbox
### 1.10.2. Type
TransactionalOutbox

### 1.10.3. Implementation
A pattern where a service writes domain events to a dedicated 'outbox' table (e.g., in its PostgreSQL instance) within the same local database transaction as its state changes. A separate poller process or Change Data Capture (CDC) mechanism then reads from this outbox and reliably publishes events to the message broker (Amazon SQS/SNS).

### 1.10.4. Applicability
Guaranteeing atomicity between database state changes and event publishing in an event-driven architecture. Ensures that events (e.g., 'CampaignCreated' after REQ-CMO-001, 'ProductOverrideUpdated' after REQ-PC-003) are only published if the corresponding business transaction commits successfully, preventing data inconsistencies across services.

## 1.11. Saga Pattern (Choreographed)
### 1.11.2. Type
Saga

### 1.11.3. Implementation
A sequence of local transactions across multiple microservices, coordinated via asynchronous events. Each service performs its transaction and publishes an event; subsequent services listen for these events to trigger their own transactions. Compensating transactions are triggered by events if a step fails.

### 1.11.4. Applicability
Managing long-running, distributed transactions where eventual consistency is acceptable, without requiring distributed locks. Essential for complex multi-step business processes like campaign creation and full lifecycle management (REQ-CMO-001, REQ-CMO-002), product catalog setup with ad network sync (REQ-PC-001, REQ-03-003), or affiliate payout processing (REQ-AMP-005).



---

