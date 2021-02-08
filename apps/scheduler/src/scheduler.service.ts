import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject('SYMBOLS') private readonly symbols,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleHealthCheck() {
    this.publish('HEALTH_CHECKER', 5);
  }

  // Monday to Friday, every 15 minutes between 2pm and 9pm
  @Cron('* */15 14-21 * * 1-5', {
    name: 'US Stocks',
    timeZone: 'Europe/Lisbon',
  })
  async handleUsStocks() {
    const resolution = 15;
    this.processStock(this.symbols.usMarket, resolution);
  }

  // Monday to Friday, every 30 minutes between 01am and 09am
  @Cron('* */30 01-09 * * 1-5', {
    name: 'UKD Stocks',
    timeZone: 'Europe/Lisbon',
  })
  async handleUkdStocks() {
    const resolution = 30;
    this.processStock(this.symbols.hkdMarket, resolution);
  }

  private async processStock(symbols: string[], resolution: number) {
    const length = symbols.length;
    const timeframeInSeconds = resolution * 60;
    const waitingTime = Math.floor(timeframeInSeconds / length) * 1000;

    for (const symbol of symbols) {
      this.publish(symbol, resolution);
      await new Promise((resolve) => setTimeout(resolve, waitingTime));
    }
  }

  private publish(symbol: string, resolution = 15) {
    console.log(`Emiting SYSTEM_ANALYSE_SYMBOL to ${symbol}`);
    this.amqpConnection.publish('symbols', 'symbol_analyse', {
      event: 'SYSTEM_ANALYSE_SYMBOL',
      object: {
        symbol: symbol,
        resolution,
      },
      verb: 'analyse',
      actor: {
        name: 'system',
      },
    });
  }
}
