# Specification

# 1. Error Handling

- **Strategies:**
  
  - **Type:** Retry  
**Configuration:**
    
    - **Max Attempts:** 3
    - **Backoff Strategy:** ExponentialWithJitter
    - **Initial Interval Seconds:** 1
    - **Max Interval Seconds:** 30
    - **Retryable Http Status Codes:**
      
      - 408
      - 429
      - 500
      - 502
      - 503
      - 504
      
    
**Error Handling Rules:**
    
    - AdNetworkTransientError
    - CorePlatformTransientError
    - PaymentGatewayTransientError
    - ShippingProviderTransientError
    - DatabaseTransientError
    - MessagingTransientError
    - HttpTimeoutError
    
**Description:** Applies to transient errors encountered during external API calls (Ad Networks, Core Platform, Payment, Shipping), database operations, and messaging operations. Uses exponential backoff with jitter to avoid thundering herd.  
  - **Type:** CircuitBreaker  
**Configuration:**
    
    - **Failure Rate Threshold Percentage:** 50
    - **Minimum Number Of Calls:** 20
    - **Sliding Window Size In Seconds:** 60
    - **Wait Duration In Open State In Seconds:** 30
    - **Permitted Number Of Calls In Half Open State:** 2
    
**Error Handling Rules:**
    
    - AdNetworkApiFailure
    - CorePlatformApiFailure
    - PaymentGatewayApiFailure
    - ShippingProviderApiFailure
    
**Description:** Protects services from repeatedly calling failing external dependencies (Ad Networks, Core Platform APIs, Payment Gateways, Shipping Providers). Trips if failure rate exceeds threshold, waits, then allows limited requests in half-open state before closing or re-opening.  
  - **Type:** Fallback  
**Configuration:**
    
    - **Fallback Mechanisms:**
      
      - **Condition Rule:** AnalyticsDataFetchError_AfterRetries  
**Action:** ServeStaleCacheWithNotification  
**Parameters:**
    
    - **Stale Data Max Age Minutes:** 60
    - **Cache Key Pattern:** analytics:report:*
    
      - **Condition Rule:** ConfigurationDataFetchError_AfterRetries  
**Action:** ServeFromCache  
**Parameters:**
    
    - **Cache Key Pattern:** config:*:*
    
      - **Condition Rule:** AdCreativeValidationFailure_NetworkPolicy  
**Action:** InformUser_SuggestManualReview  
**Parameters:**
    
    
      
    
**Error Handling Rules:**
    
    - AnalyticsDataFetchError_AfterRetries
    - ConfigurationDataFetchError_AfterRetries
    - AdCreativeValidationFailure_NetworkPolicy
    
**Description:** Provides alternative responses or actions when primary operations fail persistently. For analytics, serves stale data. For configuration, serves cached data. For ad creative validation, informs user.  
  - **Type:** DeadLetterQueue  
**Configuration:**
    
    - **Target Dlq_Arn_Pattern:** arn:aws:sqs:{region}:{accountId}:AdManager_{ServiceName}_DLQ
    - **Max Receive Count For Source Queue:** 5
    
**Error Handling Rules:**
    
    - UnrecoverableMessageProcessingError
    - AsynchronousJobPermanentFailure
    
**Description:** Routes messages/events that fail processing repeatedly in asynchronous workflows (e.g., SQS consumers for product sync, campaign updates, performance data ingestion) to a Dead Letter Queue for investigation. Configured per primary SQS queue.  
  
- **Monitoring:**
  
  - **Error Types To Monitor:**
    
    - AdNetworkTransientError
    - AdNetworkPermanentError
    - AdNetworkApiFailure
    - CorePlatformTransientError
    - CorePlatformPermanentError
    - CorePlatformApiFailure
    - PaymentGatewayTransientError
    - PaymentGatewayPermanentError
    - PaymentGatewayApiFailure
    - ShippingProviderTransientError
    - ShippingProviderPermanentError
    - ShippingProviderApiFailure
    - DatabaseTransientError
    - DatabasePermanentError
    - MessagingTransientError
    - MessagingPermanentError
    - UnrecoverableMessageProcessingError
    - AsynchronousJobPermanentFailure
    - InternalServiceCommunicationError
    - BusinessRuleValidationError
    - ConfigurationError
    - SecurityViolationError
    - HttpTimeoutError
    - UnhandledPlatformException
    - CircuitBreakerOpenEvent
    
  - **Alerting Configuration:**
    
    - **Default Notification Channels:**
      
      - Email (via AWS SES)
      - PlatformAdminDashboard (via CloudWatch integration)
      
    - **Priority Alerts:**
      
      - **Severity:** P1_CRITICAL  
**Error Types:**
    
    - SecurityViolationError
    - DatabasePermanentError_DataCorruption
    - PaymentGatewayPermanentError_ServiceOutage
    - CorePlatformPermanentError_AuthFailure
    - RapidDLQGrowth_CriticalQueue
    
**Additional Channels:**
    
    - PagerDuty (via AWS SNS integration)
    
**Threshold:** 1 event in 5 minutes  
**Description:** Requires immediate attention and potential incident response.  
      - **Severity:** P2_HIGH  
**Error Types:**
    
    - CircuitBreakerOpenEvent_CriticalDependency
    - AdNetworkPermanentError_ServiceOutage
    - HighRate_BusinessRuleValidationError
    - ConfigurationError_StartupFailure
    
**Additional Channels:**
    
    - TeamChatChannel (via AWS SNS integration)
    
**Threshold:** 5 events in 15 minutes OR 1 CircuitBreakerOpenEvent  
**Description:** Requires urgent investigation.  
      - **Severity:** P3_MEDIUM  
**Error Types:**
    
    - AdNetworkTransientError_HighRate
    - CorePlatformTransientError_HighRate
    - DatabaseTransientError_HighRate
    - MessagingTransientError_HighRate
    
**Threshold:** X% increase over baseline in 1 hour  
**Description:** Indicates potential underlying issues or performance degradation.  
      
    - **Logging Context:**
      
      - **Required Fields:**
        
        - timestamp
        - correlationId
        - serviceName
        - operationName
        - merchantId (if_applicable)
        - userId (if_applicable)
        - errorCode
        - errorMessage
        - errorSeverity
        - stackTrace (for_backend_exceptions)
        - requestParameters (PII_masked)
        
      - **Storage:** AWS CloudWatch Logs (structured JSON format)
      
    
  - **Description:** Comprehensive monitoring of specified error types. Alerting configuration defines channels and thresholds for different severities. Standardized logging context for all errors stored in CloudWatch Logs.
  


---

