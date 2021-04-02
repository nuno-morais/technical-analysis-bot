import { Injectable } from '@nestjs/common';
import { DefaultApi } from 'finnhub';

@Injectable()
export class SymbolsGateway {
  private cacheMarketSymbols: {
    [market: string]: { [symbol: string]: any };
  } = {};
  constructor(private readonly client: DefaultApi) {}

  public async isAvailable(market: string, symbol: string): Promise<boolean> {
    if (market == 'US') {
      if (this.cacheMarketSymbols[market] == null) {
        const result = await this.execute(
          this.client.stockSymbols,
          market,
        ).catch((error) => {
          console.log(error);
          return null;
        });
        this.cacheMarketSymbols[market] = result.reduce((acc, value) => {
          acc[value.symbol] = value;
          return acc;
        }, {});
      }
    }
    return market != 'US' || this.cacheMarketSymbols[market][symbol] != null;
  }

  private async execute(fn, ...args): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      args.push((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
      fn.apply(this.client, args);
    });
  }
}
