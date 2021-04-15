import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  AuthorizationContextService,
  JwtAuthGuard,
  ScopesGuard,
} from '@tab/authentication';
import { TradesSummaryInteractor } from './trades-summary.interactor';

@Controller('trades-summary')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class TradesSummaryController {
  constructor(
    private readonly tradesSummaryService: TradesSummaryInteractor,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Get()
  async findAll() {
    const accountId = this.authorizationContextService.context.accountId;
    return await this.tradesSummaryService.call(accountId);
  }
}
