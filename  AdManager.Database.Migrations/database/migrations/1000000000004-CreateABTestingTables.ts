import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateABTestingTables1000000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ABTest table
        await queryRunner.createTable(
            new Table({
                name: "ABTest",
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
                        name: "testType",
                        type: "varchar(100)",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar(50)",
                        isNullable: false,
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
                        name: "controlVariantId", // Does not have an FK in this table definition
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "variantsConfiguration",
                        type: "jsonb",
                        isNullable: false,
                    },
                    {
                        name: "winningVariantId", // Does not have an FK in this table definition
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "significanceLevel",
                        type: "real", // 'float' in SQL can be 'real' or 'double precision'. 'real' is single precision.
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
                        columnNames: ["merchantId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "Merchant",
                        onDelete: "CASCADE",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_ABTest_campaignId", columnNames: ["campaignId"] }),
                    new TableIndex({ name: "IDX_ABTest_merchantId", columnNames: ["merchantId"] }),
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("ABTest", true, true, true);
    }
}