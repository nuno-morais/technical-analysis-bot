import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { camelCase } from 'change-case';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsConsumer {
  constructor(private readonly notificationsService: NotificationsService) {}

  @RabbitSubscribe({
    exchange: 'analyser',
    routingKey: ['buy_order_analyse', 'sell_order_analyse'],
    queue: 'analyser_queue',
    queueOptions: {
      durable: true,
    },
  })
  public async competingPubSubHandler(msg: any) {
    const handler = camelCase(`ON_${msg.event}`);

    if (this[handler] != null) {
      this[handler](msg);
    } else {
      console.log('Ignoring message.');
    }

    console.log(`Received message: ${JSON.stringify(msg)}`);
  }

  public async onSystemSellSymbol(msg: any) {
    this.notificationsService.sellSymbol(msg.object.symbol, msg.object.result);
  }
  public async onSystemBuySymbol(msg: any) {
    this.notificationsService.buySymbol(msg.object.symbol, msg.object.result);
  }

  @RabbitSubscribe({
    exchange: 'healthcheck',
    routingKey: ['healthcheck'],
    queue: 'healthcheck_queue',
    queueOptions: {
      durable: false,
    },
  })
  public handleHealthCheck() {
    this.notificationsService.ping();
  }
}
