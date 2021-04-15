import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import {
  AuthorizationContextService,
  JwtAuthGuard,
  Scopes,
  ScopesGuard,
} from '@tab/authentication';
import { classToPlain } from 'class-transformer';
import { TradesSummaryInteractor } from './trades-summary.interactor';

@Controller('trades-summary')
@Scopes('read:portfolios', 'read:trades')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class TradesSummaryController {
  constructor(
    private readonly tradesSummaryService: TradesSummaryInteractor,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Get()
  async findAll(@Res() res) {
    const accountId = this.authorizationContextService.context.accountId;
    const summary = await this.tradesSummaryService.call(accountId);

    res.set({ 'X-Total-Count': summary.length });
    res.status(HttpStatus.OK).send(classToPlain(summary));

    return summary;
  }
}
