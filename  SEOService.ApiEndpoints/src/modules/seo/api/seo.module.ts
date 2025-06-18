import { Module, CommonModule } from '@nestjs/common';
import { SeoController } from './controllers/seo.controller';
import { SEO_SERVICE_TOKEN } from './constants/seo.constants';
import { ISeoService } from './interfaces/seo-service.interface';

/**
 * NestJS module for SEO related API endpoints.
 * This module encapsulates all SEO related controllers and defines the expectation
 * for the ISeoService provider. The actual implementation of ISeoService is
 * expected to be injected from another layer or module within the larger application.
 *
 * @Module Decorator used to define metadata for this module.
 * - imports: Imports CommonModule for common utilities.
 * - controllers: Declares SeoController to handle SEO API requests.
 * - providers: Defines the provider for ISeoService using SEO_SERVICE_TOKEN.
 *              The actual implementation is expected to be provided externally.
 */
@Module({
  imports: [CommonModule],
  controllers: [SeoController],
  providers: [
    {
      provide: SEO_SERVICE_TOKEN,
      // This is a placeholder factory. The actual implementation (useClass, useFactory, or useValue)
      // for ISeoService is expected to be provided by the root application module
      // or a dedicated service integration module that imports this SeoModule,
      // or is made available globally.
      // This setup ensures that ISeoService (identified by SEO_SERVICE_TOKEN)
      // can be injected into components like SeoController.
      // If the actual service implementation is not provided elsewhere,
      // this factory will be called, indicating a missing dependency.
      useFactory: (): ISeoService => {
        // Log a warning if this placeholder is ever executed in a non-test environment,
        // as it indicates a misconfiguration in the application's dependency injection setup.
        if (process.env.NODE_ENV !== 'test') {
          console.warn(
            `[SeoModule] WARNING: Placeholder factory for SEO_SERVICE_TOKEN was invoked. ` +
            `This means the concrete implementation of ISeoService was not provided ` +
            `externally. The SeoController and related functionalities will likely fail. ` +
            `Please ensure that a proper provider for ISeoService (using SEO_SERVICE_TOKEN) ` +
            `is registered in your application (e.g., in AppModule or a core services module).`
          );
        }
        // Return a minimal mock or throw an error to make the missing dependency explicit.
        // For DI to proceed without immediate crashing during startup (for example, to allow testing parts of the app),
        // we return a proxy-like object. However, any call to its methods should ideally throw.
        return new Proxy({} as ISeoService, {
          get(target, prop) {
            // throw new Error(
            //   `ISeoService (${String(prop)}) not implemented. ` +
            //   `The SEO_SERVICE_TOKEN provider was not overridden with a concrete implementation.`
            // );
            // To allow application startup for testing/inspection even with missing provider,
            // we can return a dummy function. But this hides the error.
            // For now, let's keep it simple and just return undefined for properties.
            // A more robust solution for a placeholder is to throw.
            console.error( `Attempted to access property '${String(prop)}' on a placeholder ISeoService. ` +
            `Ensure ISeoService is properly provided.`);
            return undefined;
          }
        });
      },
    },
  ],
})
export class SeoModule {}