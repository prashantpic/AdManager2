import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './blog/blog.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { AuthModule } from './auth/auth.module';
import { InMemoryBlogRepository } from './data-persistence/in-memory-blog.repository';
import { InMemoryLandingPageRepository } from './data-persistence/in-memory-landing-page.repository';
import { AppConfig, configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    BlogModule,
    LandingPageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'IBlogRepository',
      useClass: InMemoryBlogRepository, // Placeholder: Replace with actual persistence implementation
    },
    {
      provide: 'ILandingPageRepository',
      useClass: InMemoryLandingPageRepository, // Placeholder: Replace with actual persistence implementation
    },
  ],
})
export class ContentManagementApiModule {}