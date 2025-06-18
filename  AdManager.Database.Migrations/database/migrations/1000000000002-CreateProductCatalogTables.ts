import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateProductCatalogTables1000000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ProductCatalog table
        await queryRunner.createTable(
            new Table({
                name: "ProductCatalog",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "merchantId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "name",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "sourcePlatform",
                        type: "varchar(100)",
                        isNullable: true,
                    },
                    {
                        name: "lastSyncedAt",
                        type: "timestamp with time zone",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp with time zone",
                        default: "NOW()",
                        isNullable: false,
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp with time zone",
                        default: "NOW()",
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ["merchantId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Merchant",
                        onDelete: "CASCADE",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_ProductCatalog_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );

        // Create Product table
        await queryRunner.createTable(
            new Table({
                name: "Product",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "productCatalogId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "merchantId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "coreProductId", // ID from core e-commerce platform
                        type: "uuid", // Assuming UUID as per SDS, could be varchar
                        isNullable: true,
                    },
                    {
                        name: "sku",
                        type: "varchar(100)",
                        isNullable: true,
                    },
                    {
                        name: "title",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "price",
                        type: "numeric(19,4)",
                        isNullable: true,
                    },
                    {
                        name: "imageUrl",
                        type: "varchar(1024)",
                        isNullable: true,
                    },
                    {
                        name: "productUrl",
                        type: "varchar(2048)",
                        isNullable: true,
                    },
                    {
                        name: "stockLevel",
                        type: "integer",
                        isNullable: true,
                    },
                    {
                        name: "adSpecificTitle",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                    {
                        name: "adSpecificDescription",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "customAttributes",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "isOverride",
                        type: "boolean",
                        default: false,
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp with time zone",
                        default: "NOW()",
                        isNullable: false,
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp with time zone",
                        default: "NOW()",
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ["productCatalogId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "ProductCatalog",
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({
                        columnNames: ["merchantId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Merchant",
                        onDelete: "CASCADE", // This might be redundant if productCatalogId's merchant is the same, but explicit FK is fine.
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_Product_productCatalogId", columnNames: ["productCatalogId"] }),
                    new TableIndex({ name: "IDX_Product_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_Product_catalog_coreProductId", columnNames: ["productCatalogId", "coreProductId"], isUnique: false }), // Unique if coreProductId is unique per catalog
                    new TableIndex({ name: "IDX_Product_catalog_sku", columnNames: ["productCatalogId", "sku"], isUnique: false }), // Unique if sku is unique per catalog
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Product", true, true, true);
        await queryRunner.dropTable("ProductCatalog", true, true, true);
    }
}