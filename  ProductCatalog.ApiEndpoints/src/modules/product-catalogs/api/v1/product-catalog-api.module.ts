import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductCatalogController } from './controllers/product-catalog.controller';
import { ProductFeedController } from './controllers/product-feed.controller';
import { ProductImportController } from './controllers/product-import.controller';
import { ProductSyncController } from './controllers/product-sync.controller';

/**
 * @module ProductCatalogApiModule
 * @description NestJS module definition for the V1 Product Catalog API.
 * This module groups all related controllers for version 1 of the Product Catalog API.
 * It ensures that all dependencies required by these controllers (like `MulterModule`) are available.
 * The `IProductCatalogService` is expected to be provided by an importing module or a dynamic module setup.
 */
@Module({
  imports: [
    MulterModule.register({
      /**
       * Configure temporary storage for uploads.
       * The service layer should handle moving these to persistent storage (e.g., S3).
       * Using a simple local path for demonstration; this should be configurable/secure in production.
       * As per SDS 4.1.1, the destination can be './uploads' or './temp_uploads'.
       */
      dest: './temp_uploads',
    }),
  ],
  controllers: [
    ProductCatalogController,
    ProductFeedController,
    ProductImportController,
    ProductSyncController,
  ],
  /**
   * Providers are intentionally left empty as per SDS.
   * The `IProductCatalogService` is expected to be provided by an importing module
   * or a dynamic module setup that resolves the actual service implementation.
   */
  providers: [],
  /**
   * This module does not export any providers or controllers directly
   * as it is an endpoint layer consumed by the NestJS application.
   */
  exports: [],
})
export class ProductCatalogApiModule {}