import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GiftOptionsModuleV1 } from './modules/gift-options/api/v1/gift-options.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    GiftOptionsModuleV1,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}