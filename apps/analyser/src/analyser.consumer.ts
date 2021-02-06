import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { AnalyserInteractor } from './analyser.interactor';

@Injectable()
export class AnalyserConsumer {
  constructor(private readonly analyserInteractor: AnalyserInteractor) {}
  private count = 1;

  @RabbitSubscribe({
    exchange: 'symbols',
    routingKey: 'symbol_analyse',
    queue: 'analyser_queue',
    queueOptions: {
      durable: true,
    },
  })
  public async competingPubSubHandler(msg: any) {
    if (this.count == 1) {
      this.analyserInteractor.call(msg.object.symbol, msg.object.resolution);
    }
    this.count++;
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}
