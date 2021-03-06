import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { AnalyserGateway } from './analyser.gateway';

@Injectable()
export class AnalyserInteractor {
  constructor(
    private readonly analyserGateway: AnalyserGateway,
    @Inject('ANALYSER_RMQ') private readonly amqpConnection: AmqpConnection,
  ) {}

  public async call(symbol: string, resolution: number) {
    if (symbol == 'HEALTH_CHECKER') {
      this.sendHealthCheck(resolution);
      return;
    }

    const result = await this.analyserGateway.aggregateIndicators(
      symbol,
      resolution,
    );

    console.log(result);
    if (result == null || result.technicalAnalysis == null) {
      console.log(`No information to ${symbol} with resolution ${resolution}`);
      return;
    }

    if (result.technicalAnalysis.signal == 'buy') {
      this.amqpConnection.publish('analyser', 'buy_order_analyse', {
        event: 'SYSTEM_BUY_SYMBOL',
        object: {
          symbol,
          result,
        },
        verb: 'buy',
        actor: {
          name: 'system',
        },
      });
    } else if (result.technicalAnalysis.signal == 'sell') {
      this.amqpConnection.publish('analyser', 'sell_order_analyse', {
        event: 'SYSTEM_SELL_SYMBOL',
        object: {
          symbol,
          result,
        },
        verb: 'sell',
        actor: {
          name: 'system',
        },
      });
    }
  }

  private sendHealthCheck(resolution: number) {
    console.log(`I'm alive. ${new Date().toUTCString()}`);
    this.amqpConnection.publish('', 'healthcheck_queue', {
      event: 'SYSTEM_CHECKER_HEALTH',
      object: {
        type: 'HEALTH',
        resolution,
      },
      verb: 'sell',
      actor: {
        name: 'system',
      },
    });
  }
}
