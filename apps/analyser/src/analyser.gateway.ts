import { Injectable } from '@nestjs/common';
import { DefaultApi } from 'finnhub';

@Injectable()
export class AnalyserGateway {
  constructor(private readonly client: DefaultApi) {}

  public async aggregateIndicators(
    symbol: string,
    resolution: number,
  ): Promise<any> {
    return await this.execute(
      this.client.aggregateIndicator,
      symbol,
      resolution,
    ).catch((error) => {
      console.log(error);
      return null;
    });
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
