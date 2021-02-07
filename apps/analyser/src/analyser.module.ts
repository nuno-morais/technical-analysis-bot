import {
  AmqpConnection,
  RabbitMQConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import 'dotenv/config';
import { ApiClient, DefaultApi } from 'finnhub';
import { AnalyserConsumer } from './analyser.consumer';
import { AnalyserGateway } from './analyser.gateway';
import { AnalyserInteractor } from './analyser.interactor';

const finnubProvider = {
  provide: DefaultApi,
  useFactory: () => {
    const api_key = ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_API_KEY;
    return new DefaultApi();
  },
};

const amqpConnectionProvider = {
  provide: 'ANALYSER_RMQ',
  useFactory: async (): Promise<AmqpConnection> => {
    const config: RabbitMQConfig = {
      uri: process.env.ANALYSER_RMQ_URL.split(','),
    };
    const connection = new AmqpConnection(config);
    await connection.init();
    return connection;
  },
};

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'symbols',
          type: 'topic',
        },
      ],
      uri: process.env.SCHEDULER_RMQ_URL.split(','),
    }),
    AnalyserModule,
  ],
  controllers: [],
  providers: [
    AnalyserConsumer,
    AnalyserGateway,
    finnubProvider,
    AnalyserInteractor,
    amqpConnectionProvider,
  ],
})
export class AnalyserModule {}
