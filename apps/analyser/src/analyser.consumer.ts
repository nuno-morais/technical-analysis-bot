import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { AnalyserInteractor } from './analyser.interactor';

@Injectable()
export class AnalyserConsumer {
  constructor(private readonly analyserInteractor: AnalyserInteractor) {}

  @RabbitSubscribe({
    exchange: 'symbols',
    routingKey: 'symbol_analyse',
    queue: 'analyser_queue',
    queueOptions: {
      durable: true,
    },
  })
  public async competingPubSubHandler(msg: any) {
    this.analyserInteractor.call(msg.object.symbol, msg.object.resolution);
  }
}
