import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

export class CreateBillingAndPlatformTables1000000000007 implements MigrationInterface {
    private readonly globalConfigKeyUniqueIndexName = "UQ_ConfigurationSetting_key_global";
    private readonly merchantConfigKeyUniqueIndexName = "UQ_ConfigurationSetting_key_merchant";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create SubscriptionPlan table
        await queryRunner.createTable(
            new Table({
                name: "SubscriptionPlan",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "name", type: "varchar(100)", isUnique: true, isNullable: false },
                    { name: "description", type: "text", isNullable: true },
                    { name: "monthlyPrice", type: "numeric(10,2)", isNullable: false },
                    { name: "annualPrice", type: "numeric(10,2)", isNullable: true },
                    { name: "features", type: "jsonb", isNullable: true },
                    { name: "isActive", type: "boolean", default: true, isNullable: false },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
            }),
            true,
        );

        // Create Subscription table
        await queryRunner.createTable(
            new Table({
                name: "Subscription",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "merchantId", type: "uuid", isUnique: true, isNullable: false },
                    { name: "planId", type: "uuid", isNullable: false },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "startDate", type: "timestamp with time zone", isNullable: false },
                    { name: "endDate", type: "timestamp with time zone", isNullable: true },
                    { name: "nextBillingDate", type: "date", isNullable: true },
                    { name: "billingCycle", type: "varchar(20)", isNullable: false }, // e.g., 'Monthly', 'Annually'
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                    new TableForeignKey({ columnNames: ["planId"], referencedColumnNames: ["id"], referencedTableName: "SubscriptionPlan", onDelete: "RESTRICT" }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_Subscription_planId", columnNames: ["planId"] }),
                    new TableIndex({ name: "IDX_Subscription_status", columnNames: ["status"] }),
                ]
            }),
            true,
        );

        // Create Invoice table
        await queryRunner.createTable(
            new Table({
                name: "Invoice",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "merchantId", type: "uuid", isNullable: false },
                    { name: "subscriptionId", type: "uuid", isNullable: true },
                    { name: "invoiceNumber", type: "varchar(100)", isUnique: true, isNullable: false },
                    { name: "issueDate", type: "date", default: "CURRENT_DATE", isNullable: false },
                    { name: "dueDate", type: "date", isNullable: false },
                    { name: "amount", type: "numeric(10,2)", isNullable: false },
                    { name: "taxAmount", type: "numeric(10,2)", default: 0, isNullable: false },
                    { name: "totalAmount", type: "numeric(10,2)", isNullable: false },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "notes", type: "text", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                    new TableForeignKey({ columnNames: ["subscriptionId"], referencedColumnNames: ["id"], referencedTableName: "Subscription", onDelete: "SET NULL" }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_Invoice_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_Invoice_subscriptionId", columnNames: ["subscriptionId"] }),
                    new TableIndex({ name: "IDX_Invoice_status", columnNames: ["status"] }),
                ]
            }),
            true,
        );

        // Create Payment table
        await queryRunner.createTable(
            new Table({
                name: "Payment",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "invoiceId", type: "uuid", isNullable: false },
                    { name: "merchantId", type: "uuid", isNullable: false },
                    { name: "paymentDate", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "amount", type: "numeric(10,2)", isNullable: false },
                    { name: "paymentMethod", type: "varchar(100)", isNullable: false },
                    { name: "gatewayTransactionId", type: "varchar(255)", isUnique: true, isNullable: true },
                    { name: "status", type: "varchar(50)", isNullable: false },
                    { name: "notes", type: "text", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["invoiceId"], referencedColumnNames: ["id"], referencedTableName: "Invoice", onDelete: "CASCADE" }),
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                ],
                indices: [
                     new TableIndex({ name: "IDX_Payment_invoiceId", columnNames: ["invoiceId"] }),
                     new TableIndex({ name: "IDX_Payment_merchantId", columnNames: ["merchantId"] }),
                     new TableIndex({ name: "IDX_Payment_status", columnNames: ["status"] }),
                ]
            }),
            true,
        );

        // Create GiftOption table
        await queryRunner.createTable(
            new Table({
                name: "GiftOption",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "merchantId", type: "uuid", isNullable: false },
                    { name: "name", type: "varchar(255)", isNullable: false },
                    { name: "type", type: "varchar(50)", isNullable: false }, // e.g., 'Note', 'CardDesign'
                    { name: "description", type: "text", isNullable: true },
                    { name: "isEnabled", type: "boolean", default: true, isNullable: false },
                    { name: "configuration", type: "jsonb", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                ],
                indices: [
                     new TableIndex({ name: "IDX_GiftOption_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );

        // Create IntegrationConfig table
        await queryRunner.createTable(
            new Table({
                name: "IntegrationConfig",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "merchantId", type: "uuid", isNullable: false },
                    { name: "integrationType", type: "varchar(100)", isNullable: false },
                    { name: "configuration", type: "jsonb", isNullable: false }, // Potentially encrypted, or reference to secrets manager
                    { name: "isEnabled", type: "boolean", default: true, isNullable: false },
                    { name: "lastSyncStatus", type: "varchar(50)", isNullable: true },
                    { name: "lastSyncTimestamp", type: "timestamp with time zone", isNullable: true },
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                ],
                uniques: [
                    new TableUnique({ name: "UQ_IntegrationConfig_merchantId_type", columnNames: ["merchantId", "integrationType"] }),
                ],
                indices: [
                     new TableIndex({ name: "IDX_IntegrationConfig_merchantId_integrationType", columnNames: ["merchantId", "integrationType"] }),
                ]
            }),
            true,
        );

        // Create AuditLog table
        await queryRunner.createTable(
            new Table({
                name: "AuditLog",
                columns: [
                    { name: "id", type: "bigserial", isPrimary: true },
                    { name: "timestamp", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "adManagerUserId", type: "uuid", isNullable: true },
                    { name: "merchantId", type: "uuid", isNullable: true },
                    { name: "action", type: "varchar(255)", isNullable: false },
                    { name: "entityType", type: "varchar(100)", isNullable: true },
                    { name: "entityId", type: "varchar(255)", isNullable: true }, // varchar to accommodate different ID types
                    { name: "details", type: "jsonb", isNullable: true }, // e.g., old value, new value
                    { name: "ipAddress", type: "varchar(45)", isNullable: true },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["adManagerUserId"], referencedColumnNames: ["id"], referencedTableName: "AdManagerUser", onDelete: "SET NULL" }),
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "SET NULL" }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_AuditLog_timestamp", columnNames: ["timestamp"] }),
                    new TableIndex({ name: "IDX_AuditLog_adManagerUserId", columnNames: ["adManagerUserId"] }),
                    new TableIndex({ name: "IDX_AuditLog_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_AuditLog_entityType_entityId", columnNames: ["entityType", "entityId"] }),
                ]
            }),
            true,
        );

        // Create ConfigurationSetting table
        await queryRunner.createTable(
            new Table({
                name: "ConfigurationSetting",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                    { name: "key", type: "varchar(255)", isNullable: false },
                    { name: "value", type: "text", isNullable: false },
                    { name: "description", type: "text", isNullable: true },
                    { name: "isMerchantOverridable", type: "boolean", default: false, isNullable: false },
                    { name: "merchantId", type: "uuid", isNullable: true }, // Null for global settings
                    { name: "createdAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                    { name: "updatedAt", type: "timestamp with time zone", default: "NOW()", isNullable: false },
                ],
                foreignKeys: [
                    new TableForeignKey({ columnNames: ["merchantId"], referencedColumnNames: ["id"], referencedTableName: "Merchant", onDelete: "CASCADE" }),
                ],
                // Unique constraints will be handled by partial indexes created via raw SQL below
            }),
            true,
        );

        // Create partial unique indexes for ConfigurationSetting
        await queryRunner.query(`
            CREATE UNIQUE INDEX "${this.globalConfigKeyUniqueIndexName}" 
            ON "ConfigurationSetting" ("key") 
            WHERE "merchantId" IS NULL;
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "${this.merchantConfigKeyUniqueIndexName}" 
            ON "ConfigurationSetting" ("key", "merchantId") 
            WHERE "merchantId" IS NOT NULL;
        `);
         await queryRunner.createIndex("ConfigurationSetting", new TableIndex({ name: "IDX_ConfigurationSetting_merchantId", columnNames: ["merchantId"] }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "${this.merchantConfigKeyUniqueIndexName}";`);
        await queryRunner.query(`DROP INDEX IF EXISTS "${this.globalConfigKeyUniqueIndexName}";`);
        
        await queryRunner.dropTable("ConfigurationSetting", true, true, true);
        await queryRunner.dropTable("AuditLog", true, true, true);
        await queryRunner.dropTable("IntegrationConfig", true, true, true);
        await queryRunner.dropTable("GiftOption", true, true, true);
        await queryRunner.dropTable("Payment", true, true, true);
        await queryRunner.dropTable("Invoice", true, true, true);
        await queryRunner.dropTable("Subscription", true, true, true);
        await queryRunner.dropTable("SubscriptionPlan", true);
    }
}