import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import 'dotenv/config';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.SCHEDULER_RMQ_URL.split(','),
    }),
    SchedulerModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
