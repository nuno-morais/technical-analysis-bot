import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import 'dotenv/config';
import { SchedulerService } from './scheduler.service';

const symbolsProvider = {
  provide: 'SYMBOLS',
  useValue: {
    usMarket: process.env.SYMBOLS_US_MARKET.split(','),
    hkdMarket: process.env.SYMBOLS_HKD_MARKET.split(','),
  },
};

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.SCHEDULER_RMQ_URL.split(','),
    }),
    SchedulerModule,
  ],
  providers: [SchedulerService, symbolsProvider],
})
export class SchedulerModule {}
