import { DataSource } from "typeorm";

interface SubscriptionPlanData {
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice?: number;
    features: object; // JSONB
    isActive?: boolean;
}

export class InitialSubscriptionPlansSeed {
    public async run(dataSource: DataSource): Promise<any> {
        const plansToSeed: SubscriptionPlanData[] = [
            {
                name: 'Basic',
                description: 'Limited features, free or low cost.',
                monthlyPrice: 0.00,
                features: { campaigns: 1, users: 1, analytics: 'basic' },
                isActive: true,
            },
            {
                name: 'Pro',
                description: 'Advanced tools and higher limits.',
                monthlyPrice: 49.99,
                annualPrice: 499.99,
                features: { campaigns: 10, users: 5, analytics: 'advanced', ab_testing: true },
                isActive: true,
            },
            {
                name: 'Plus',
                description: 'Premium features and highest limits.',
                monthlyPrice: 99.99,
                annualPrice: 999.99,
                features: { campaigns: 'unlimited', users: 'unlimited', analytics: 'premium', ab_testing: true, dedicated_support: true },
                isActive: true,
            },
        ];

        for (const planData of plansToSeed) {
             const existingPlan = await dataSource.createQueryBuilder()
                .select("plan")
                .from("SubscriptionPlan", "plan") // Using table name as string
                .where("plan.name = :name", { name: planData.name })
                .getOne();

            if (!existingPlan) {
                 await dataSource.createQueryBuilder()
                    .insert()
                    .into("SubscriptionPlan") // Using table name as string
                    .values(planData)
                    // .orIgnore() // For PostgreSQL, ON CONFLICT DO NOTHING is better
                    .onConflict(`("name") DO NOTHING`) // Assumes name is unique constraint
                    .execute();
                console.log(`Seeded plan: ${planData.name}`);
            } else {
                console.log(`Plan already exists: ${planData.name}`);
            }
        }
    }
}