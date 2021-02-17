import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Portfolio } from './entities/portfolio.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { PortfolioRepository } from './repositories/portfolio.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio,
      PortfolioRepository,
      Notification,
      NotificationRepository,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class CoreModule {}
