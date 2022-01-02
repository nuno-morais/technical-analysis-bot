import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import * as dig from 'object-dig';

@Injectable()
export class ProductGateway {
  private cache = {};

  constructor(
    @Inject('CLIENT_PRODUCT_GATEWAY') private readonly client: AxiosInstance,
  ) {}

  async find(symbol: string): Promise<any> {
    if (this.cache[symbol]) {
      return this.cache[symbol];
    }
    const result = await this.client
      .get(`/v7/finance/quote?symbols=${this.mapSymbol(symbol)}`)
      .catch((error) => {
        console.log(`Error processing: ${symbol}`);
        console.log(error.data);
        return null;
      });

    if (result != null) {
      const info = dig(result, 'data', 'quoteResponse', 'result');
      if (info.length > 0) {
        const details = info[0];
        const market = this.convertMarket(details.market);
        if (market == null) {
          console.log(`No market associated for symbol: ${symbol}`);
        }
        this.cache[symbol] = {
          symbol,
          market,
        };
        return this.cache[symbol];
      }
    } else {
      console.log(`No result for symbol: ${symbol}`);
    }
    return null;
  }

  private mapSymbol(symbol: string) {
    const symbls = {
      ORSTED: 'ORSTED.CO',
      'ABBN.ZU': 'ABBN.SW',
      ENEL: 'ENEL.MI',
      NDX1: 'NDX1.DE',
      'ORA.US': 'ORA',
      'GOLD.BARRICK': 'GOLD',
      NESTE: 'NESTE.HE',
      NOKI: 'NOK',
      'JD.US': 'JD',
      'NOVO-B': 'NOVO-B.CO',
      SAOC: '2222.SR',
      ZIL2: 'ZIL2.DE',
      SWDA: 'SWDA.L',
      NESN: 'NESN.SW',
      'AGN.NV': 'AGN.AS',
      'NN.NV': 'NN.AS',
      TRYG: 'TRYG.CO',
      'LTC.US': 'LTC',
      'OGZDL.L': 'OGZD.L',
      GER30: '^GDAX',
      'ATADL.L': 'ATAD.IL',
      'LKODL.L': 'LKOD.L',
    };
    return symbls[symbol] || symbol;
  }

  private convertMarket(market: string) {
    switch (market) {
      case undefined:
      case null:
      case '':
        return null;
      default:
        const result = market.split('_')[0];
        if (result.length != 2) {
          console.log(`Something was worng for ${market}`);
        }
        return result;
    }
  }
}
