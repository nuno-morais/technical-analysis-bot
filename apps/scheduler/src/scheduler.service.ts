import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private symbols: ['AAPL'];

  constructor(private readonly amqpConnection: AmqpConnection) {}
  // Monday to Friday, every 15 minutes between 2pm and 10pm
  @Cron('* */15 14-22 * * 1-5')
  handleUSStocks() {
    this.symbols.forEach((symbol) => {
      this.amqpConnection.publish('symbols', 'symbol_analyse', {
        event: 'SYSTEM_ANALYSE_SYMBOL',
        object: {
          symbol: symbol,
          resolution: 15,
        },
        verb: 'analyse',
        actor: {
          name: 'system',
        },
      });
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleTest() {
    console.log('This is a test');
    this.amqpConnection.publish('amz-exchange', 'amz-routing-key', {
      event: 'SYSTEM_ANALYSE_SYMBOL',
      object: {
        symbol: 'AAPL',
        resolution: 15,
      },
      verb: 'analyse',
      actor: {
        name: 'system',
      },
    });
  }
}
