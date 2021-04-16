import { Inject, Injectable } from '@nestjs/common';
import { FinnhubWS, TickData } from '@stoqey/finnhub';
import { SymbolRepository } from '@tab/core/repositories/symbol.repository';
import Cache from 'memory-cache-ttl';

@Injectable()
export class SymbolsListener {
  private isReady = false;

  constructor(
    private readonly client: FinnhubWS,
    private readonly symbolRepository: SymbolRepository,
    @Inject('CACHE_LISTERNER')
    private readonly cache: Cache,
  ) {
    this.onMessageReceived();
    this.getReady();
  }

  public async subscribeAll() {
    console.log('subscribeAll');
    if (!this.isReady) {
      return;
    }
    const symbols = await this.symbolRepository.find();
    symbols.forEach((symbol) => {
      this.client.addSymbol(symbol.product);
    });
  }

  private async getReady() {
    this.client.on('onReady', async () => {
      this.isReady = true;
      this.subscribeAll();
    });
  }

  private onMessageReceived() {
    this.client.on('onData', async (data: TickData) => {
      if (this.cache.check(data.symbol)) {
        console.log('Already in memory');
        const value = this.cache.get(data.symbol);
        if (value == data.close) {
          this.cache.set(data.symbol, data.close);
        }
      } else {
        this.cache.set(data.symbol, data.close);

        const value = await this.symbolRepository.findOne({
          product: data.symbol,
        });
        value.updated_at = new Date();
        value.price = data.close;

        await this.symbolRepository.replaceOne({ _id: value._id }, value);
      }
    });
  }
}
