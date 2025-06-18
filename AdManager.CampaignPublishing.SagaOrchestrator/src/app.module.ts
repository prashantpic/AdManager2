import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { CampaignPublishingSagaModule } from './campaign-publishing-saga/campaign-publishing-saga.module';
import campaignPublishingSagaConfig, { CampaignPublishingSagaConfig } from './campaign-publishing-saga/config/campaign-publishing.config';
import { CampaignPublishingSagaInstance } from './campaign-publishing-saga/state/entities/campaign-publishing-saga-instance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [campaignPublishingSagaConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CampaignPublishingSagaConfig, true>) => ({
        type: 'postgres',
        host: configService.get('SAGA_STATE_DB_HOST', { infer: true }),
        port: configService.get('SAGA_STATE_DB_PORT', { infer: true }),
        username: configService.get('SAGA_STATE_DB_USER', { infer: true }),
        password: configService.get('SAGA_STATE_DB_PASSWORD', { infer: true }),
        database: configService.get('SAGA_STATE_DB_NAME', { infer: true }),
        entities: [CampaignPublishingSagaInstance],
        synchronize: process.env.NODE_ENV !== 'production', // Set to false in production
        autoLoadEntities: true,
      }),
    }),
    SqsModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CampaignPublishingSagaConfig, true>) => {
        const sagaReplyQueueName = configService.get('SAGA_REPLY_QUEUE_NAME', { infer: true });
        const sagaReplyQueueUrl = configService.get('SAGA_REPLY_QUEUE_URL', { infer: true });
        const awsRegion = configService.get('AWS_REGION', { infer: true });

        if (!sagaReplyQueueName || !sagaReplyQueueUrl) {
            // Log an error or throw if essential configuration is missing
            console.error('SAGA_REPLY_QUEUE_NAME or SAGA_REPLY_QUEUE_URL is not configured.');
            return { consumers: [], producers: [] };
        }

        return {
          consumers: [
            {
              name: sagaReplyQueueName,
              queueUrl: sagaReplyQueueUrl,
              region: awsRegion,
              // batchSize: 10, // optional, as per SDS example comment
              // visibilityTimeout: 30, // optional
              // authenticationErrorTimeout: 10000, // optional
            },
          ],
          producers: [], // SQS producers are instantiated directly using AWS SDK in adapters
        };
      },
    }),
    CampaignPublishingSagaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}