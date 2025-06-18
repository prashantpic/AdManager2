import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreatePerformanceAndAffiliateTables1000000000006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create DailyCampaignPerformanceSummary table
        await queryRunner.createTable(
            new Table({
                name: "DailyCampaignPerformanceSummary",
                columns: [
                    {
                        name: "date",
                        type: "date",
                        isPrimary: true,
                    },
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
                        name: "merchantId", // Denormalized for easier querying, though campaign has merchantId
                        type: "uuid",
                        isPrimary: true, 
                    },
                    {
                        name: "adSetId", // Nullable if summarizing at campaign level, not part of PK here.
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "adId", // Nullable if summarizing at campaign/adset level, not part of PK here.
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "totalImpressions",
                        type: "bigint",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "totalClicks",
                        type: "bigint",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "totalConversions",
                        type: "bigint",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "totalSpend",
                        type: "numeric(19,4)",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "roas",
                        type: "numeric(10,4)",
                        isNullable: true,
                    },
                    {
                        name: "cpa",
                        type: "numeric(19,4)",
                        isNullable: true,
                    },
                    {
                        name: "ctr",
                        type: "numeric(7,4)",
                        isNullable: true,
                    },
                    {
                        name: "conversionRate",
                        type: "numeric(7,4)",
                        isNullable: true,
                    },
                    {
                        name: "reach",
                        type: "bigint",
                        isNullable: true,
                    },
                    {
                        name: "updatedAt", // To track when this summary row was last updated
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
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({
                        columnNames: ["merchantId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Merchant",
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({ // Optional FK
                        columnNames: ["adSetId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "AdSet",
                        onDelete: "CASCADE", // Or SET NULL if AdSet can be deleted independently of summary
                    }),
                     new TableForeignKey({ // Optional FK
                        columnNames: ["adId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Ad",
                        onDelete: "CASCADE", // Or SET NULL
                    }),
                ],
                 indices: [
                    new TableIndex({ name: "IDX_DCPS_adSetId", columnNames: ["adSetId"] }),
                    new TableIndex({ name: "IDX_DCPS_adId", columnNames: ["adId"] }),
                ]
            }),
            true,
        );

        // Create AffiliateProgram table
        await queryRunner.createTable(
            new Table({
                name: "AffiliateProgram",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "merchantId", type: "uuid", isNullable: false },
                    { name: "name", type: "varchar(255)", isNullable: false },
                    { name: "description", type: "text", isNullable: true },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "commissionType", type: "varchar(50)", isNullable: false },
                    { name: "commissionRate", type: "numeric(10,4)", isNullable: true },
                    { name: "cookieWindowDays", type: "integer", default: 30, isNullable: false },
                    { name: "termsAndConditionsUrl", type: "varchar(2048)", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                ],
                 indices: [
                    new TableIndex({ name: "IDX_AffiliateProgram_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );

        // Create Affiliate table
        await queryRunner.createTable(
            new Table({
                name: "Affiliate",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "affiliateProgramId", type: "uuid", isNullable: false },
                    { name: "coreUserId", type: "uuid", isUnique: true, isNullable: false },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "trackingCode", type: "varchar(100)", isUnique: true, isNullable: false },
                    { name: "paymentDetails", type: "jsonb", isNullable: true },
                    { name: "approvedAt", type: "timestamp with time zone", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["affiliateProgramId"], referencedColumnNames: ["id"], referencedTableName: "AffiliateProgram", onDelete: "CASCADE" }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_Affiliate_affiliateProgramId", columnNames: ["affiliateProgramId"] }),
                ]
            }),
            true,
        );
        
        // Create AffiliatePayout table first because AffiliateConversion has FK to it.
        await queryRunner.createTable(
            new Table({
                name: "AffiliatePayout",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "affiliateId", type: "uuid", isNullable: false },
                    { name: "paymentPeriodStartDate", type: "date", isNullable: false },
                    { name: "paymentPeriodEndDate", type: "date", isNullable: false },
                    { name: "totalCommissionAmount", type: "numeric(19,4)", isNullable: false },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "paymentDate", type: "timestamp with time zone", isNullable: true },
                    { name: "transactionReference", type: "varchar(255)", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["affiliateId"], referencedColumnNames: ["id"], referencedTableName: "Affiliate", onDelete: "CASCADE" }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_AffiliatePayout_affiliateId", columnNames: ["affiliateId"] }),
                ]
            }),
            true,
        );

        // Create AffiliateConversion table
        await queryRunner.createTable(
            new Table({
                name: "AffiliateConversion",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "affiliateId", type: "uuid", isNullable: false },
                    { name: "coreOrderId", type: "uuid", isUnique: true, isNullable: false },
                    { name: "conversionTimestamp", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "saleAmount", type: "numeric(19,4)", isNullable: false },
                    { name: "commissionAmount", type: "numeric(19,4)", isNullable: false },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "affiliatePayoutId", type: "uuid", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["affiliateId"], referencedColumnNames: ["id"], referencedTableName: "Affiliate", onDelete: "CASCADE" }),
                    new TableForeignKey({ columnNames: ["affiliatePayoutId"], referencedColumnNames: ["id"], referencedTableName: "AffiliatePayout", onDelete: "SET NULL" }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_AffiliateConversion_affiliateId", columnNames: ["affiliateId"] }),
                    new TableIndex({ name: "IDX_AffiliateConversion_affiliatePayoutId", columnNames: ["affiliatePayoutId"] }),
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("AffiliateConversion", true, true, true);
        await queryRunner.dropTable("AffiliatePayout", true, true, true);
        await queryRunner.dropTable("Affiliate", true, true, true);
        await queryRunner.dropTable("AffiliateProgram", true, true, true);
        await queryRunner.dropTable("DailyCampaignPerformanceSummary", true, true, true);
    }
}