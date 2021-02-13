import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreService } from './core.service';
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
  providers: [CoreService],
  exports: [TypeOrmModule],
})
export class CoreModule {}
