import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateBaseInfrastructureTables1000000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid-ossp extension is available
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Create Merchant table
        await queryRunner.createTable(
            new Table({
                name: "Merchant",
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
                        type: "varchar(255)",
                        isNullable: false,
                    },
                    {
                        name: "corePlatformMerchantId",
                        type: "uuid",
                        isUnique: true,
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
            }),
            true, // Create if not exists
        );

        // Create UserRole table
        await queryRunner.createTable(
            new Table({
                name: "UserRole",
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
                        type: "varchar(50)",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
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
            }),
            true, // Create if not exists
        );

        // Create AdManagerUser table
        await queryRunner.createTable(
            new Table({
                name: "AdManagerUser",
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
                        name: "coreUserId",
                        type: "uuid",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "merchantId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "roleId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
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
                    new TableForeignKey({
                        columnNames: ["roleId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "UserRole",
                        onDelete: "RESTRICT",
                    }),
                ],
                indices: [
                    new TableIndex({ name: "IDX_AdManagerUser_merchantId", columnNames: ["merchantId"] }),
                    new TableIndex({ name: "IDX_AdManagerUser_roleId", columnNames: ["roleId"] }),
                ]
            }),
            true, // Create if not exists
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("AdManagerUser", true, true, true); // drop foreign keys and indices
        await queryRunner.dropTable("UserRole", true);
        await queryRunner.dropTable("Merchant", true);
    }
}