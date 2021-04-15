import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CommonModule } from '@tab/common';
import { CoreModule } from '@tab/core';
import { SymbolsModule } from '@tab/symbols';
import { TradesModule } from '../trades/trades.module';
import { TradesSummaryController } from './trades-summary.controller';
import { TradesSummaryInteractor } from './trades-summary.interactor';

@Module({
  imports: [
    CommonModule,
    CoreModule,
    AuthenticationModule,
    SymbolsModule,
    TradesModule,
  ],
  controllers: [TradesSummaryController],
  providers: [TradesSummaryInteractor],
})
export class TradesSummaryModule {}
