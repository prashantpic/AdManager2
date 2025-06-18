import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import 'reflect-metadata'; // Required for TypeORM

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    synchronize: false, // CRITICAL: always false for migration-managed schemas
    logging: process.env.NODE_ENV === 'development' ? true : ['error'], // Log all queries in dev, only errors in prod
    entities: [], // Entities are usually defined in the main application, not needed here for CLI if migrations use raw SQL or QueryBuilder directly.
                  // If using entities to auto-generate migrations, they would be listed here.
    migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')], // Path to migration files
    migrationsTableName: 'custom_migrations_table', // Custom name for the migrations history table
    // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined, // Optional: for SSL connections
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;