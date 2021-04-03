import { Injectable } from '@nestjs/common';
import { QueryOptions } from '@tab/common';
import { Trade, TradeRepository } from '@tab/core';
import { PortfoliosService } from '../portfolios/portfolios.service';

@Injectable()
export class GetPortfolioTradesInteractor {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly tradeRepository: TradeRepository,
  ) {}

  public async call(
    accountId: string,
    portfolioId: string,
    query: QueryOptions,
  ): Promise<{ count: number; items: Trade[] }> {
    const portfolio = await this.portfoliosService.findOne(
      portfolioId,
      accountId,
    );

    this.mapProperty(query);
    const { product, market } = portfolio;
    const result = await this.tradeRepository.findAndCount({
      where: { accountId, product, market },
      ...query.toMongoQuery(),
    });
    return {
      count: result[1],
      items: result[0],
    };
  }

  private mapProperty(query: QueryOptions) {
    const map = {
      id: '_id',
      account_id: 'accountId',
    };

    if (map[query.sort] != null) {
      query.sort = map[query.sort];
    }
  }
}
