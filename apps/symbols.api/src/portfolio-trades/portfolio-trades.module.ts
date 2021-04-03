import { Logger, Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CommonModule } from '@tab/common';
import { CoreModule } from '@tab/core';
import { SymbolsModule } from '@tab/symbols';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { TradesModule } from '../trades/trades.module';
import { GetPortfolioTradesInteractor } from './get-portfolio-trades.interactor';
import { PortfolioTradesController } from './portfolio-trades.controller';

@Module({
  controllers: [PortfolioTradesController],
  imports: [
    CommonModule,
    CoreModule,
    AuthenticationModule,
    SymbolsModule,
    PortfoliosModule,
    TradesModule,
  ],
  providers: [Logger, GetPortfolioTradesInteractor],
})
export class PortfolioTradesModule {}
