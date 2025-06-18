// src/modules/product-catalogs/api/v1/interfaces/product-catalog-service.interface.ts
import { CreateProductCatalogDto, UpdateProductCatalogDto, ProductCatalogResponseDto, CustomizeProductDto, ProductCatalogItemDto } from '../dtos/catalog';
import { ConflictResolutionStrategyDto, CatalogConflictResponseDto, ResolveConflictRequestDto } from '../dtos/sync'; // Corrected path
import { PaginationDto, PaginatedResponseDto } from '../dtos/common';
import { GenerateFeedRequestDto, FeedResponseDto, FeedStatusResponseDto, ValidateFeedRequestDto, FeedValidationResultResponseDto, FeedSummaryDto } from '../dtos/feed';
import { BulkImportRequestDto, BulkImportStatusResponseDto, ExternalCustomizationImportDto } from '../dtos/import';
import { TriggerSyncDto, SyncStatusResponseDto, SyncStatusRequestDto } from '../dtos/sync';
import { Readable } from 'stream'; // NodeJS.ReadableStream is compatible with Readable from 'stream'

/**
 * Interface defining the contract for the ProductCatalogService.
 * This API layer depends on this contract for interacting with the application service layer.
 * All methods operate within the context of a specific merchant, identified by `merchantId`.
 */
export interface IProductCatalogService {
  /**
   * Creates a new product catalog for a merchant.
   * @param merchantId The ID of the merchant.
   * @param createDto DTO containing data for the new catalog.
   * @returns A promise that resolves to the created product catalog details.
   */
  createCatalog(merchantId: string, createDto: CreateProductCatalogDto): Promise<ProductCatalogResponseDto>;

  /**
   * Retrieves all product catalogs for a merchant with pagination.
   * @param merchantId The ID of the merchant.
   * @param paginationDto DTO for pagination parameters.
   * @returns A promise that resolves to a paginated list of product catalogs.
   */
  findAllCatalogs(merchantId: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<ProductCatalogResponseDto>>;

  /**
   * Retrieves a specific product catalog by its ID for a merchant.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog to retrieve.
   * @returns A promise that resolves to the product catalog details, or null if not found.
   */
  findOneCatalog(merchantId: string, catalogId: string): Promise<ProductCatalogResponseDto>;

  /**
   * Updates an existing product catalog for a merchant.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog to update.
   * @param updateDto DTO containing data to update the catalog.
   * @returns A promise that resolves to the updated product catalog details.
   */
  updateCatalog(merchantId: string, catalogId: string, updateDto: UpdateProductCatalogDto): Promise<ProductCatalogResponseDto>;

  /**
   * Removes a product catalog for a merchant.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog to remove.
   * @returns A promise that resolves when the catalog is removed.
   */
  removeCatalog(merchantId: string, catalogId: string): Promise<void>;

  /**
   * Adds or updates ad-specific customization for a product within a catalog.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param productId The ID of the product to customize.
   * @param dto DTO containing customization data.
   * @returns A promise that resolves to the customized product catalog item.
   */
  addProductCustomization(merchantId: string, catalogId: string, productId: string, dto: CustomizeProductDto): Promise<ProductCatalogItemDto>;

  /**
   * Retrieves ad-specific customization for a product within a catalog.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param productId The ID of the product.
   * @returns A promise that resolves to the product catalog item with customizations.
   */
  getProductCustomization(merchantId: string, catalogId: string, productId: string): Promise<ProductCatalogItemDto>;

  /**
   * Removes ad-specific customization for a product within a catalog.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param productId The ID of the product.
   * @returns A promise that resolves when the customization is removed.
   */
  removeProductCustomization(merchantId: string, catalogId: string, productId: string): Promise<void>;

  /**
   * Sets the conflict resolution strategy for a specific catalog.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param dto DTO containing the conflict resolution strategy.
   * @returns A promise that resolves when the strategy is set.
   */
  setConflictResolutionStrategy(merchantId: string, catalogId: string, dto: ConflictResolutionStrategyDto): Promise<void>;

  /**
   * Retrieves data conflicts for a catalog with pagination.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param paginationDto DTO for pagination parameters.
   * @returns A promise that resolves to a paginated list of catalog conflicts.
   */
  getCatalogConflicts(merchantId: string, catalogId: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<CatalogConflictResponseDto>>;

  /**
   * Resolves a specific data conflict within a catalog.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param conflictId The ID of the conflict to resolve.
   * @param dto DTO containing the resolution choice and data.
   * @returns A promise that resolves when the conflict is resolved.
   */
  resolveConflict(merchantId: string, catalogId: string, conflictId: string, dto: ResolveConflictRequestDto): Promise<void>;

  /**
   * Generates a product feed for a specific catalog and ad network.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param dto DTO containing feed generation parameters.
   * @returns A promise that resolves to the response DTO for the feed generation job.
   */
  generateFeed(merchantId: string, catalogId: string, dto: GenerateFeedRequestDto): Promise<FeedResponseDto>;

  /**
   * Retrieves the status of a generated product feed.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param feedId The ID of the feed.
   * @returns A promise that resolves to the feed status DTO.
   */
  getFeedStatus(merchantId: string, catalogId: string, feedId: string): Promise<FeedStatusResponseDto>;

  /**
   * Retrieves the content of a generated product feed for download.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param feedId The ID of the feed.
   * @returns A promise that resolves to an object containing the stream, content type, and file name, or null if not available.
   */
  downloadFeedContent(merchantId: string, catalogId: string, feedId: string): Promise<{ stream: Readable; contentType: string; fileName: string } | null>;

  /**
   * Lists all generated feeds for a specific catalog with pagination.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param paginationDto DTO for pagination parameters.
   * @returns A promise that resolves to a paginated list of feed summaries.
   */
  listFeeds(merchantId: string, catalogId: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<FeedSummaryDto>>;

  /**
   * Validates a product catalog feed against ad network specifications.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param dto DTO containing validation parameters.
   * @returns A promise that resolves to the feed validation result DTO.
   */
  validateFeed(merchantId: string, catalogId: string, dto: ValidateFeedRequestDto): Promise<FeedValidationResultResponseDto>;

  /**
   * Bulk imports products into a catalog from a file.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param fileBuffer Buffer containing the file data.
   * @param fileOriginalName Original name of the uploaded file.
   * @param dto DTO containing bulk import parameters.
   * @returns A promise that resolves to the bulk import status DTO.
   */
  bulkImportProducts(merchantId: string, catalogId: string, fileBuffer: Buffer, fileOriginalName: string, dto: BulkImportRequestDto): Promise<BulkImportStatusResponseDto>;

  /**
   * Retrieves the status of a bulk import job.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param importId The ID of the import job.
   * @returns A promise that resolves to the bulk import status DTO.
   */
  getImportStatus(merchantId: string, catalogId: string, importId: string): Promise<BulkImportStatusResponseDto>;

  /**
   * Imports external product catalog customizations from a file.
   * @param merchantId The ID of the merchant.
   * @param catalogId The ID of the catalog.
   * @param fileBuffer Buffer containing the file data.
   * @param fileOriginalName Original name of the uploaded file.
   * @param dto DTO containing external customization import parameters.
   * @returns A promise that resolves to the import status DTO.
   */
  importExternalCustomizations(merchantId: string, catalogId: string, fileBuffer: Buffer, fileOriginalName: string, dto: ExternalCustomizationImportDto): Promise<BulkImportStatusResponseDto>;

  /**
   * Triggers synchronization with the core [PlatformName] product data.
   * @param merchantId The ID of the merchant.
   * @param dto DTO containing synchronization trigger parameters.
   * @returns A promise that resolves to the sync status DTO.
   */
  triggerCorePlatformSync(merchantId: string, dto: TriggerSyncDto): Promise<SyncStatusResponseDto>;

  /**
   * Retrieves the status of core [PlatformName] product data synchronization.
   * @param merchantId The ID of the merchant.
   * @param dto DTO containing sync status request parameters.
   * @returns A promise that resolves to the sync status DTO.
   */
  getCorePlatformSyncStatus(merchantId: string, dto: SyncStatusRequestDto): Promise<SyncStatusResponseDto>;
}