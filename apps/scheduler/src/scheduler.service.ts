import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PortfolioRepository } from '@tab/core';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly portfolioRepository: PortfolioRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleHealthCheck() {
    this.publish('HEALTH_CHECKER', 5);
  }

  // Monday to Friday, every 15 minutes between 2pm and 9pm
  @Cron('0 */15 14-21 * * 1-5', {
    name: 'US Stocks',
    timeZone: 'Europe/Lisbon',
  })
  async handleUsStocks() {
    const resolution = 15;
    const symbols = await this.portfolioRepository.allCurrenciesByMarket('US');
    this.processStock(symbols, resolution);
  }

  // Monday to Friday, every 30 minutes between 01am and 09am
  @Cron('0 */30 01-09 * * 1-5', {
    name: 'HKG Stocks',
    timeZone: 'Europe/Lisbon',
  })
  async handleHkgStocks() {
    const resolution = 30;
    const symbols = await this.portfolioRepository.allCurrenciesByMarket('HKG');
    this.processStock(symbols, resolution);
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
