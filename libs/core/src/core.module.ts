import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Portfolio } from './entities/portfolio.entity';
import { Symbol } from './entities/symbol.entity';
import { Trade } from './entities/trade.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { PortfolioRepository } from './repositories/portfolio.repository';
import { SymbolRepository } from './repositories/symbol.repository';
import { TradeRepository } from './repositories/trade.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio,
      PortfolioRepository,
      Notification,
      NotificationRepository,
      Trade,
      TradeRepository,
      Symbol,
      SymbolRepository,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class CoreModule {}
