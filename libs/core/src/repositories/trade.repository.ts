import { EntityRepository, MongoRepository } from 'typeorm';
import { Trade } from '../entities/trade.entity';

@EntityRepository(Trade)
export class TradeRepository extends MongoRepository<Trade> {
  public async allCurrenciesByMarket(market: string): Promise<string[]> {
    return await this.distinct('product', { market });
  }
}
