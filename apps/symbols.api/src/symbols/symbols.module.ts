import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@tab/authentication';
import { CommonModule } from '@tab/common';
import { CoreModule } from '@tab/core';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

@Module({
  imports: [CommonModule, CoreModule, AuthenticationModule],
  controllers: [SymbolsController],
  providers: [SymbolsService],
})
export class SymbolsModule {}
