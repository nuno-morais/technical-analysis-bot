import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreService } from './core.service';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioRepository } from './repositories/portfolio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, PortfolioRepository])],
  providers: [CoreService],
  exports: [TypeOrmModule],
})
export class CoreModule {}
