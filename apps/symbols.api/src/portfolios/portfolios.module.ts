import { Logger, Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CommonModule } from '@tab/common';
import { CoreModule } from '@tab/core';
import { ApiClient, DefaultApi } from 'finnhub';
import { FinnhubGateway } from './gateways/finnhub.gateway';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

const finnubProvider = {
  provide: DefaultApi,
  useFactory: () => {
    const api_key = ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_API_KEY;
    return new DefaultApi();
  },
};

@Module({
  controllers: [PortfoliosController],
  imports: [CommonModule, CoreModule, AuthenticationModule],
  providers: [PortfoliosService, Logger, finnubProvider, FinnhubGateway],
})
export class PortfoliosModule {}
