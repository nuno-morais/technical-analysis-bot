import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@tab/core';
import 'dotenv/config';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { SchedulerService } from './scheduler.service';

const options = {
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
  logging: process.env.TYPEORM_LOGGING == 'true',
} as MongoConnectionOptions;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.SCHEDULER_RMQ_URL.split(','),
    }),
    TypeOrmModule.forRoot({
      ...options,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    SchedulerModule,
    CoreModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
