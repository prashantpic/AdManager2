// src/modules/product-catalogs/api/v1/constants/product-catalog.constants.ts
/**
 * Defines constants for the Product Catalog API module.
 * This includes injection tokens for services and keys for metadata.
 */

/**
 * Injection token for the IProductCatalogService.
 * Used to inject the product catalog service implementation into controllers.
 */
export const PRODUCT_CATALOG_SERVICE_TOKEN = 'IProductCatalogService';

/**
 * Key used to store roles metadata for role-based access control.
 * This key is used by the RolesGuard to retrieve required roles for a handler or class.
 */
export const ROLES_KEY = 'roles';