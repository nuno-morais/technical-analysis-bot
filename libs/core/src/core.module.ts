import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Portfolio } from './entities/portfolio.entity';
import { Trade } from './entities/trade.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { PortfolioRepository } from './repositories/portfolio.repository';
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
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class CoreModule {}
