import { Injectable } from '@nestjs/common';
import { QueryOptions } from '@tab/common';
import { Symbol as Symbol1, SymbolRepository } from '@tab/core';

@Injectable()
export class SymbolsService {
  constructor(private readonly repository: SymbolRepository) {}

  async findAll(
    accountId: string,
    products: string[],
    query: QueryOptions,
  ): Promise<{ count: number; items: Symbol1[] }> {
    this.mapProperty(query);
    if (products == null || products.length == 0) {
      const result = await this.repository.findAndCount({
        ...query.toMongoQuery(),
      });

      return {
        count: result[1],
        items: result[0],
      };
    } else {
      const result = await this.repository.findAndCount({
        where: { product: { $in: products } },
        ...query.toMongoQuery(),
      });

      return {
        count: result[1],
        items: result[0],
      };
    }
  }

  private mapProperty(query: QueryOptions) {
    const map = {
      id: '_id',
    };

    if (map[query.sort] != null) {
      query.sort = map[query.sort];
    }
  }
}
