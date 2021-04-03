import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthorizationContextService,
  JwtAuthGuard,
  Scopes,
  ScopesGuard,
} from '@tab/authentication';
import { QueryOptions } from '@tab/common';
import { Trade } from '@tab/core';
import { classToPlain } from 'class-transformer';
import { GetPortfolioTradesInteractor } from './get-portfolio-trades.interactor';

@ApiBearerAuth()
@ApiTags('portfolios')
@Controller('portfolios')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class PortfolioTradesController {
  constructor(
    private readonly authorizationContextService: AuthorizationContextService,
    private readonly interactor: GetPortfolioTradesInteractor,
  ) {}

  @Get(':id/trades')
  @Scopes('read:trades')
  @ApiOperation({ summary: 'Get all trades' })
  @ApiOkResponse({
    description: 'List of trades',
    type: Trade,
    isArray: true,
  })
  async findAll(
    @Res() res,
    @Param('id') id: string,
    @Query() query: QueryOptions,
  ) {
    query = new QueryOptions({ ...query });
    const accountId = this.authorizationContextService.context.accountId;
    const result = await this.interactor.call(accountId, id, query);

    res.set({ 'X-Total-Count': result.count });
    res.status(HttpStatus.OK).send(classToPlain(result.items));

    return result.items;
  }
}
