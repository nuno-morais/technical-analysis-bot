import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@tab/core';
import 'dotenv/config';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { SlackGateway } from './gateways/slack.gateway';
import { TelegramGateway } from './gateways/telegram.gateway';
import { NotificationsConsumer } from './notifications.consumer';
import { NotificationsService } from './notifications.service';

const options = {
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
  logging: process.env.TYPEORM_LOGGING == 'true',
} as MongoConnectionOptions;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...options,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.ANALYSER_RMQ_URL.split(','),
      exchanges: [
        {
          name: 'analyser',
          type: 'topic',
        },
        {
          name: 'healthcheck',
          type: 'topic',
        },
      ],
    }),
    NotificationsModule,
    CoreModule,
  ],
  controllers: [],
  providers: [
    NotificationsService,
    NotificationsConsumer,
    SlackGateway,
    TelegramGateway,
  ],
})
export class NotificationsModule {}
