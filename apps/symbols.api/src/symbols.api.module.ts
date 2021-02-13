import { Module } from '@nestjs/common';
import { SymbolsApiController } from './symbols.api.controller';
import { SymbolsApiService } from './symbols.api.service';

@Module({
  imports: [],
  controllers: [SymbolsApiController],
  providers: [SymbolsApiService],
})
export class SymbolsApiModule {}
