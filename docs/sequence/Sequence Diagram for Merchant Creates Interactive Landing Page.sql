sequenceDiagram
    actor "Merchant Ad Manager Portal (SPA)" as merchantadmanagerportalspa018
    participant "Ad Manager API Gateway" as admanagerapigateway019
    participant "Content Management Service" as contentmanagementservice006
    participant "SEO Service" as seoservice007
    participant "Ad Manager PostgreSQL DB" as admanagerpostgresqldb022
    participant "Public Landing Page Hosting" as PublicFacingLandingPagesUIHosting

    activate merchantadmanagerportalspa018
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 1. Merchant designs landing page (content, CTAs, timers) and configures SEO settings in UI builder.
    
    merchantadmanagerportalspa018-admanagerapigateway019: 2. POST /v1/landing-pages (payload: { designData, seoSettings, name, campaignId })
    activate admanagerapigateway019
    
    admanagerapigateway019-contentmanagementservice006: 2.1. createAndPublishLandingPage(payload)
    activate contentmanagementservice006
    
    contentmanagementservice006-contentmanagementservice006: 2.1.1. Validate landing page data. If invalid, prepare HTTP 400 error for return.
    
    contentmanagementservice006-admanagerpostgresqldb022: 2.1.2. INSERT INTO LandingPages (designData, name, campaignId, initialSlug, status='DRAFT')
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--contentmanagementservice006: 2.1.2. returns { landingPageId, generatedSlug } or DBError
    deactivate admanagerpostgresqldb022
    
    contentmanagementservice006-seoservice007: 2.1.3. processSEOMetadata(landingPageId, seoSettingsFromPayload, generatedSlug)
    activate seoservice007
    seoservice007-seoservice007: 2.1.3.1. Generate schema markup, refine keywords, build final SEO data and slug.
    seoservice007-admanagerpostgresqldb022: 2.1.3.2. SAVE SEOMetadata for landingPageId
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--seoservice007: 2.1.3.2. returns Success/Failure
    deactivate admanagerpostgresqldb022
    seoservice007--contentmanagementservice006: 2.1.3. returns { finalSeoData, finalSlug } or SEOError
    deactivate seoservice007
    
    contentmanagementservice006-admanagerpostgresqldb022: 2.1.4. UPDATE LandingPages SET seoData = finalSeoData, slug = finalSlug WHERE id = landingPageId
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--contentmanagementservice006: 2.1.4. returns Success/Failure or DBError
    deactivate admanagerpostgresqldb022
    
    contentmanagementservice006-contentmanagementservice006: 2.1.5. Prepare final landing page content (e.g., HTML/JSON) for deployment.
    
    contentmanagementservice006-PublicFacingLandingPagesUIHosting: 2.1.6. DeployPage(landingPageId, finalContent, finalSlug)
    activate PublicFacingLandingPagesUIHosting
    PublicFacingLandingPagesUIHosting--contentmanagementservice006: 2.1.6. returns { deploymentStatus: 'SUCCESS' / 'PENDING' } or DeploymentError
    deactivate PublicFacingLandingPagesUIHosting
    
    contentmanagementservice006-admanagerpostgresqldb022: 2.1.7. UPDATE LandingPages SET status='PUBLISHED', publicUrl='https://.../'+finalSlug, publishedAt=NOW() WHERE id=landingPageId
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--contentmanagementservice006: 2.1.7. returns Success/Failure or DBError
    deactivate admanagerpostgresqldb022
    
    contentmanagementservice006--admanagerapigateway019: 2.1. returns { landingPageId, publicUrl, status } or ErrorResponse
    deactivate contentmanagementservice006
    
    admanagerapigateway019--merchantadmanagerportalspa018: 2. returns { landingPageId, publicUrl, status } or ErrorResponse
    deactivate admanagerapigateway019
    
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 3. Display 'Landing Page Published' confirmation with public URL (or error message if previous steps failed).
    deactivate merchantadmanagerportalspa018

    note over PublicFacingLandingPagesUIHosting: REQ-6-004, REQ-6-009: 'PublicFacingLandingPagesUIHosting' represents the live hosting environment (e.g., Amplify, Next.js on ECS/Fargate, S3+CloudFront) and its update/deployment mechanism. The 'DeployPage' interaction abstracts the specifics of this deployment (e.g., triggering a build, revalidating an ISR path, or pushing static files).
    note over merchantadmanagerportalspa018,PublicFacingLandingPagesUIHosting: This diagram outlines the success path. If any step within ContentManagementService fails (e.g., DB error, SEO service error, deployment error), an appropriate error response is propagated back to the Merchant Portal.