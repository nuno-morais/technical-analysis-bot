import { Injectable } from '@nestjs/common';
import { AnalyserGateway } from './analyser.gateway';

@Injectable()
export class AnalyserInteractor {
  constructor(private readonly analyserGateway: AnalyserGateway) {}

  public async call(symbol: string, resolution: number) {
    const result = await this.analyserGateway.aggregateIndicators(
      symbol,
      resolution,
    );

    if (result == null || result == {}) {
      return;
    }

    if (result.technicalAnalysis.signal == 'buy') {
      console.log('VAMOS ÀS COMPRAS!');
    } else if (result.technicalAnalysis.signal == 'sell') {
      console.log('VAMOS LA VENDER!');
    }
  }
}
