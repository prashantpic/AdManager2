import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCampaignManagementTables1000000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create AdNetwork table
        await queryRunner.createTable(
            new Table({
                name: "AdNetwork",
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
                        name: "name",
                        type: "varchar(100)",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "apiEndpoint",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                    {
                        name: "iconUrl",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                    {
                        name: "isEnabled",
                        type: "boolean",
                        default: true,
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        // Create Campaign table
        await queryRunner.createTable(
            new Table({
                name: "Campaign",
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
                        name: "budget",
                        type: "numeric(19,4)",
                        isNullable: true,
                    },
                    {
                        name: "startDate",
                        type: "timestamp with time zone",
                        isNullable: true,
                    },
                    {
                        name: "endDate",
                        type: "timestamp with time zone",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
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
                        columnNames: ["merchantId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Merchant",
                        onDelete: "CASCADE",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_Campaign_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_Campaign_status", columnNames: ["status"] }),
                ]
            }),
            true,
        );

        // Create CampaignAdNetwork table
        await queryRunner.createTable(
            new Table({
                name: "CampaignAdNetwork",
                columns: [
                    {
                        name: "campaignId",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "adNetworkId",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "adNetworkCampaignId",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ["campaignId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Campaign",
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({
                        columnNames: ["adNetworkId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "AdNetwork",
                        onDelete: "CASCADE",
                    }),
                ],
            }),
            true,
        );

        // Create AdCreative table
        await queryRunner.createTable(
            new Table({
                name: "AdCreative",
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
                        name: "adNetworkId", // As per SDS, FK is to AdNetwork. Could be nullable if creative is network-agnostic initially.
                        type: "uuid",
                        isNullable: false, // Sticking to NOT NULL as primary spec
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
                        name: "contentUrl",
                        type: "varchar(1024)",
                        isNullable: true,
                    },
                    {
                        name: "adCopyText",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "headline",
                        type: "varchar(255)",
                        isNullable: true,
                    },
                    {
                        name: "validationStatus",
                        type: "varchar(50)",
                        default: "'Pending'",
                        isNullable: false,
                    },
                    {
                        name: "adNetworkCreativeId",
                        type: "varchar(255)",
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
                        columnNames: ["adNetworkId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "AdNetwork",
                        onDelete: "RESTRICT",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_AdCreative_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_AdCreative_adNetworkId", columnNames: ["adNetworkId"] }),
                ]
            }),
            true,
        );

        // Create AdSet table
        await queryRunner.createTable(
            new Table({
                name: "AdSet",
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
                        name: "campaignId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "adNetworkId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "name",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "budgetType",
                        type: "varchar(50)",
                        isNullable: true,
                    },
                    {
                        name: "budgetAmount",
                        type: "numeric(19,4)",
                        isNullable: true,
                    },
                    {
                        name: "targetingCriteria",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "biddingStrategy",
                        type: "varchar(100)",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "adNetworkAdSetId",
                        type: "varchar(255)",
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
                        columnNames: ["campaignId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Campaign",
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({
                        columnNames: ["adNetworkId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "AdNetwork",
                        onDelete: "RESTRICT",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_AdSet_campaignId", columnNames: ["campaignId"] }),
                     new TableIndex({ name: "IDX_AdSet_adNetworkId", columnNames: ["adNetworkId"] }),
                ]
            }),
            true,
        );

        // Create Ad table
        await queryRunner.createTable(
            new Table({
                name: "Ad",
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
                        name: "adSetId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "adCreativeId",
                        type: "uuid",
                        isNullable: false,
                    },
                    { // FK to Promotion(id) will be added in a later migration (1000000000003)
                        name: "promotionId",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "name",
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "destinationUrl",
                        type: "varchar(2048)",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "adNetworkAdId",
                        type: "varchar(255)",
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
                        columnNames: ["adSetId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "AdSet",
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({
                        columnNames: ["adCreativeId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "AdCreative",
                        onDelete: "RESTRICT",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_Ad_adSetId", columnNames: ["adSetId"] }),
                    new TableIndex({ name: "IDX_Ad_adCreativeId", columnNames: ["adCreativeId"] }),
                    new TableIndex({ name: "IDX_Ad_promotionId", columnNames: ["promotionId"] }), // Index on FK column
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Ad", true, true, true);
        await queryRunner.dropTable("AdSet", true, true, true);
        await queryRunner.dropTable("AdCreative", true, true, true);
        await queryRunner.dropTable("CampaignAdNetwork", true, true, true);
        await queryRunner.dropTable("Campaign", true, true, true);
        await queryRunner.dropTable("AdNetwork", true);
    }
}