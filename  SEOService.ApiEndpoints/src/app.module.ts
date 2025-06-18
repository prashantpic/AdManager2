import { Module } from '@nestjs/common';
import { SeoModule } from './modules/seo/api/seo.module';
// import { ConfigModule } from '@nestjs/config'; // Potentially for environment variable management

/**
 * The root application module for the SEO Service API.
 * It serves as the main module that organizes and imports other feature modules,
 * such as the SeoModule, to structure the application.
 *
 * @Module Decorator used to define metadata for this module.
 * - imports: Array of modules imported by this module. AppModule imports SeoModule.
 */
@Module({
  imports: [
    // Uncomment if @nestjs/config is used for environment variables
    // ConfigModule.forRoot({
    //   isGlobal: true, // Makes ConfigService available globally
    // }),
    SeoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}