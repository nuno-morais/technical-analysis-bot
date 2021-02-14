import { EntityRepository, MongoRepository } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';

@EntityRepository(Portfolio)
export class PortfolioRepository extends MongoRepository<Portfolio> {
  public async allCurrenciesByMarket(market: string): Promise<string[]> {
    return await this.distinct('product', { market });
  }
}
