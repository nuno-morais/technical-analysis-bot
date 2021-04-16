import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PortfolioRepository } from '@tab/core';
import { Symbol } from '@tab/core/entities/symbol.entity';
import { SymbolRepository } from '@tab/core/repositories/symbol.repository';
import { SymbolsListener } from './symbols.listener';

@Injectable()
export class SchedulerSyncService implements OnApplicationBootstrap {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly symbolRepository: SymbolRepository,
    private readonly symbolsListener: SymbolsListener,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const synced = await this.sync();
    if (!synced) {
      this.symbolsListener.subscribeAll();
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleSync() {
    await this.sync();
  }

  private async sync(): Promise<boolean> {
    const products = await this.portfolioRepository.allCurrenciesByMarket('US');
    const symbols = await this.symbolRepository.find({ market: 'US' });

    const newSymbols = [];
    for (const product of products) {
      const existSymbol = symbols.find((s) => s.product == product);
      if (!existSymbol) {
        const newSymbol = new Symbol();
        newSymbol.currency = 'USD';
        newSymbol.market = 'US';
        newSymbol.product = product;
        newSymbols.push(newSymbol);
      }
    }
    if (newSymbols.length > 0) {
      await this.symbolRepository.save(newSymbols);
      this.symbolsListener.subscribeAll();
      return true;
    }
    return false;
  }
}
