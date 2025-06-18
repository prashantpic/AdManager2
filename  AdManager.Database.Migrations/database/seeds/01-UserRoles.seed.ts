import { DataSource } from "typeorm";

interface UserRoleData {
    id?: string; // Optional if DB generates UUID
    name: string;
    description: string;
}

export class UserRolesSeed {
    public async run(dataSource: DataSource): Promise<any> {
        const rolesToSeed: UserRoleData[] = [
            { name: 'Platform Administrator', description: 'Full system-wide access for maintenance, support, and oversight.' },
            { name: 'Merchant Admin', description: 'Full access to their merchant account\'s Ad Manager functionalities.' },
            { name: 'Campaign Manager', description: 'Access limited to campaign and promotion management for their merchant account.' },
        ];

        for (const roleData of rolesToSeed) {
            const existingRole = await dataSource.createQueryBuilder()
                .select("role")
                .from("UserRole", "role") // Using table name as string
                .where("role.name = :name", { name: roleData.name })
                .getOne();

            if (!existingRole) {
                await dataSource.createQueryBuilder()
                    .insert()
                    .into("UserRole") // Using table name as string
                    .values(roleData)
                    // .orIgnore() // For PostgreSQL, ON CONFLICT DO NOTHING is better
                    .onConflict(`("name") DO NOTHING`) // Assumes name is unique constraint
                    .execute();
                console.log(`Seeded role: ${roleData.name}`);
            } else {
                console.log(`Role already exists: ${roleData.name}`);
            }
        }
    }
}