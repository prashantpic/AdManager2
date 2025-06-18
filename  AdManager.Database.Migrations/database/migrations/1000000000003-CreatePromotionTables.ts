import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

export class CreatePromotionTables1000000000003 implements MigrationInterface {
    private adPromotionFkName = "FK_Ad_promotionId_Promotion";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Promotion table
        await queryRunner.createTable(
            new Table({
                name: "Promotion",
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
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "type",
                        type: "varchar(50)",
                        isNullable: false,
                    },
                    {
                        name: "value",
                        type: "numeric(19,4)",
                        isNullable: true,
                    },
                    {
                        name: "minimumPurchaseAmount",
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
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false,
                    },
                    {
                        name: "usageLimit",
                        type: "integer",
                        isNullable: true,
                    },
                    {
                        name: "usageLimitPerCustomer",
                        type: "integer",
                        isNullable: true,
                    },
                    {
                        name: "eligibilityCriteria",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "stackingRules",
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
                indices: [
                    new TableIndex({ name: "IDX_Promotion_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );

        // Create DiscountCode table
        await queryRunner.createTable(
            new Table({
                name: "DiscountCode",
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
                        name: "promotionId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "merchantId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "code",
                        type: "varchar(100)",
                        isNullable: false,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false,
                    },
                    {
                        name: "expirationDate",
                        type: "timestamp with time zone",
                        isNullable: true,
                    },
                    {
                        name: "usageLimit",
                        type: "integer",
                        isNullable: true,
                    },
                    {
                        name: "timesUsed",
                        type: "integer",
                        default: 0,
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
                        columnNames: ["promotionId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Promotion",
                        onDelete: "CASCADE",
                    }),
                    new TableForeignKey({
                        columnNames: ["merchantId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Merchant",
                        onDelete: "CASCADE",
                    }),
                ],
                uniques: [
                    new TableUnique({ name: "UQ_DiscountCode_merchantId_code", columnNames: ["merchantId", "code"] }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_DiscountCode_promotionId", columnNames: ["promotionId"] }),
                    new TableIndex({ name: "IDX_DiscountCode_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );

        // Add Foreign Key from Ad table to Promotion table
        // The column "promotionId" should already exist in "Ad" table from migration 1000000000001
        await queryRunner.createForeignKey(
            "Ad",
            new TableForeignKey({
                name: this.adPromotionFkName,
                columnNames: ["promotionId"],
                referencedColumnNames: ["id"],
                referencedTableName: "Promotion",
                onDelete: "SET NULL",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop Foreign Key from Ad table
        await queryRunner.dropForeignKey("Ad", this.adPromotionFkName);
        
        await queryRunner.dropTable("DiscountCode", true, true, true);
        await queryRunner.dropTable("Promotion", true, true, true);
    }
}