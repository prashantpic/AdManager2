import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo-driver';
import { join } from 'path';
import { configuration } from './v1/config/configuration';
import { AppStoreIntegrationV1Module } from './v1/app-store-integration-v1.module.ts';
// import { ThrottlerModule } from '@nestjs/throttler'; // Example for rate limiting

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // Add validation schema if Joi or class-validator is used in configuration.ts
      // validationSchema: Joi.object({ ... })
    }),
    // Example ThrottlerModule configuration - uncomment and configure if needed
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     ttl: configService.get('THROTTLE_TTL', 60),
    //     limit: configService.get('THROTTLE_LIMIT', 10),
    //   }),
    // }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule], // Import ConfigModule here if ConfigService is used in useFactory
      useFactory: (configService: ConfigService) => {
        const enableGraphQL = configService.get<boolean>('featureFlags.enableGraphQLDataExchange', false);
        if (!enableGraphQL) {
          // Return a minimal config or handle disabling more gracefully if needed
          // For now, if disabled, we might not want to load GraphQL module at all.
          // This can be handled by conditionally importing GraphQLModule in the main AppStoreIntegrationV1Module or here.
          // However, forRootAsync expects a config. Returning an empty one might not be ideal.
          // A better approach would be conditional module registration.
          // For simplicity here, we assume it's always configured but playground might be off.
          Logger.log('GraphQL is disabled via configuration.', 'GraphQLModule');
          return {
            // Provide a minimal, non-functional config if GraphQL is disabled but module is still loaded
            autoSchemaFile: false,
          };
        }
        Logger.log('GraphQL is enabled. Auto-generating schema file at src/schema.gql', 'GraphQLModule');
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: configService.get<string>('NODE_ENV') !== 'production',
          context: ({ req, res }) => ({ req, res }), // Pass request and response to context for use in resolvers/guards
          // Add further configurations like subscriptions, persisted queries, etc. if needed
        };
      },
      inject: [ConfigService],
    }),
    AppStoreIntegrationV1Module,
  ],
  controllers: [],
  providers: [Logger], // Provide Logger globally or use default NestJS logger
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    Logger.log(`AppModule initialized. Current NODE_ENV: ${this.configService.get<string>('NODE_ENV')}`, 'AppModule');
    Logger.log(`App Store URL from config: ${this.configService.get<string>('appStoreUrl')}`, 'AppModule');
    Logger.log(`GraphQL Enabled from config: ${this.configService.get<boolean>('featureFlags.enableGraphQLDataExchange')}`, 'AppModule');
  }
}