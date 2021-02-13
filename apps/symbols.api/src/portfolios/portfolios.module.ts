import { Logger, Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CoreModule } from '@tab/core';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
  controllers: [PortfoliosController],
  imports: [CoreModule, AuthenticationModule],
  providers: [PortfoliosService, Logger],
})
export class PortfoliosModule {}
