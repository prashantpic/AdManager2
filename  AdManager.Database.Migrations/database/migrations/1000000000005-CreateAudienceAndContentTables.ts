import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

export class CreateAudienceAndContentTables1000000000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Audience table
        await queryRunner.createTable(
            new Table({
                name: "Audience",
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
                        name: "type",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "source",
                        type: "varchar(100)",
                        isNullable: true,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "adNetworkAudienceId",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                    {
                        name: "size",
                        type: "integer",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
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
                    new TableIndex({ name: "IDX_Audience_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );

        // Create LandingPage table
        await queryRunner.createTable(
            new Table({
                name: "LandingPage",
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
                        name: "campaignId",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "name",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "title",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "urlSlug",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "metaDescription",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "content",
                        type: "jsonb",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "isSeoFriendly",
                        type: "boolean",
                        default: true,
                        isNullable: false,
                    },
                    {
                        name: "pageSpeedScoreMobile",
                        type: "integer",
                        isNullable: true,
                    },
                    {
                        name: "pageSpeedScoreDesktop",
                        type: "integer",
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
                    new TableForeignKey({
                        columnNames: ["campaignId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Campaign",
                        onDelete: "SET NULL",
                    }),
                ],
                uniques: [
                    new TableUnique({ name: "UQ_LandingPage_merchantId_urlSlug", columnNames: ["merchantId", "urlSlug"] }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_LandingPage_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_LandingPage_campaignId", columnNames: ["campaignId"] }),
                ]
            }),
            true,
        );

        // Create SeoSetting table
        await queryRunner.createTable(
            new Table({
                name: "SeoSetting",
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
                        name: "pageType",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "coreEntityId", // FK to Product, LandingPage, etc. or a generic ID. Not a direct DB FK.
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "metaTitle",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                    {
                        name: "metaDescription",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "seoKeywords",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "canonicalUrl",
                        type: "varchar(2048)",
                        isNullable: true,
                    },
                    {
                        name: "schemaMarkup",
                        type: "jsonb",
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
                uniques: [
                    // Unique constraint (merchantId, pageType, coreEntityId)
                    // PostgreSQL handles unique constraints with nullable columns correctly.
                    // A unique constraint with a nullable column means only one row can have that combination with NULL for that column.
                    // Or multiple rows if the combination of non-nulls is unique.
                    new TableUnique({ name: "UQ_SeoSetting_merchant_pageType_entity", columnNames: ["merchantId", "pageType", "coreEntityId"] }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_SeoSetting_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_SeoSetting_pageType_coreEntityId", columnNames: ["pageType", "coreEntityId"] }),
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("SeoSetting", true, true, true);
        await queryRunner.dropTable("LandingPage", true, true, true);
        await queryRunner.dropTable("Audience", true, true, true);
    }
}