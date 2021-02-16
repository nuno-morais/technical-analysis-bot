import { Logger, Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CommonModule } from '@tab/common';
import { CoreModule } from '@tab/core';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
  controllers: [PortfoliosController],
  imports: [CommonModule, CoreModule, AuthenticationModule],
  providers: [PortfoliosService, Logger],
})
export class PortfoliosModule {}
