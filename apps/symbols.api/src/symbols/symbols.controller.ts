import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthorizationContextService,
  JwtAuthGuard,
  ScopesGuard,
} from '@tab/authentication';
import { QueryOptions } from '@tab/common';
import { classToPlain } from 'class-transformer';
import { SymbolsService } from './symbols.service';

@ApiBearerAuth()
@ApiTags('symbols')
@Controller('symbols')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class SymbolsController {
  constructor(
    private readonly symbolsService: SymbolsService,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Get()
  async findAll(
    @Res() res,
    @Query('products') products: string,
    @Query() query: QueryOptions,
  ) {
    query = new QueryOptions({ ...query });
    const accountId = this.authorizationContextService.context.accountId;

    const result = await this.symbolsService.findAll(
      accountId,
      products ? products.split(',') : [],
      query,
    );

    res.set({ 'X-Total-Count': result.count });
    res.status(HttpStatus.OK).send(classToPlain(result.items));

    return result.items;
  }
}
