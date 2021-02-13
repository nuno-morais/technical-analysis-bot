import { Controller, Get } from '@nestjs/common';
import { SymbolsApiService } from './symbols.api.service';

@Controller()
export class SymbolsApiController {
  constructor(private readonly symbolsApiService: SymbolsApiService) {}

  @Get()
  getHello(): string {
    return this.symbolsApiService.getHello();
  }
}
