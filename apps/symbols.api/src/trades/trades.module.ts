import { Logger, Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CommonModule } from '@tab/common';
import { CoreModule } from '@tab/core';
import { SymbolsModule } from '@tab/symbols';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  controllers: [TradesController],
  providers: [TradesService, Logger],
  imports: [CommonModule, CoreModule, AuthenticationModule, SymbolsModule],
})
export class TradesModule {}
