import { Module } from '@nestjs/common';
import { ApiClient, DefaultApi } from 'finnhub';
import { SymbolsGateway } from './symbols.gateway';

const finnubProvider = {
  provide: DefaultApi,
  useFactory: () => {
    const api_key = ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_API_KEY;
    return new DefaultApi();
  },
};

@Module({
  providers: [SymbolsGateway, finnubProvider],
  exports: [SymbolsGateway],
})
export class SymbolsModule {}
