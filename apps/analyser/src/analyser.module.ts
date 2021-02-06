import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
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
  ],
})
export class AnalyserModule {}
