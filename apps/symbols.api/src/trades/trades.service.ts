import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryOptions } from '@tab/common';
import { Trade, TradeRepository } from '@tab/core';
import { SymbolsGateway } from '@tab/symbols';
import { classToPlain, plainToClass } from 'class-transformer';
import * as moment from 'moment';
import { ObjectID } from 'mongodb';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

@Injectable()
export class TradesService {
  constructor(
    private readonly repository: TradeRepository,
    private readonly gateway: SymbolsGateway,
  ) {}

  async create(
    createTradeDto: CreateTradeDto,
    accountId: string,
  ): Promise<Trade> {
    const trade = plainToClass(Trade, classToPlain(createTradeDto));

    const isAvailable = await this.gateway.isAvailable(
      trade.market,
      trade.product,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        `The market '${trade.market}' with the product '${trade.product}' does not exists.`,
      );
    }
    trade.accountId = accountId;

    return this.repository.save(trade);
  }

  async findAll(
    accountId: string,
    query: QueryOptions,
  ): Promise<{ count: number; items: Trade[] }> {
    this.mapProperty(query);
    const result = await this.repository.findAndCount({
      where: { accountId },
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

  async findOne(id: string, accountId: string): Promise<Trade> {
    const entity = await this.repository.findOne({
      _id: new ObjectID(id),
      accountId,
    });
    if (entity == null) {
      throw new NotFoundException();
    }

    return entity;
  }

  async remove(id: string, accountId: string) {
    await this.findOne(id, accountId);
    return this.repository.delete({ _id: new ObjectID(id), accountId });
  }

  async update(
    updateTradeDto: UpdateTradeDto,
    accountId: string,
  ): Promise<Trade> {
    const trade = plainToClass(Trade, classToPlain(updateTradeDto));

    const oldTrade = await this.findOne(updateTradeDto.id, accountId);

    this.validateUpdateTrade(updateTradeDto, oldTrade);

    oldTrade.provider = trade.provider || oldTrade.provider;
    oldTrade.closed_price = trade.closed_price || oldTrade.closed_price;
    oldTrade.closed_at = trade.closed_at || oldTrade.closed_at;

    await this.repository.replaceOne(
      { _id: new ObjectID(updateTradeDto.id) },
      trade,
    );

    return trade;
  }

  private validateUpdateTrade(updateTradeDto: UpdateTradeDto, oldTrade: Trade) {
    const immutableData = [
      'market',
      'product',
      'currency',
      'opened_price',
      'shares',
    ];

    const hasInvalidValue = immutableData.find(
      (field) =>
        updateTradeDto[field] != null &&
        updateTradeDto[field] != oldTrade[field],
    );

    if (hasInvalidValue) {
      throw new BadRequestException(
        `The following field should keep the same data from old value or null: '${hasInvalidValue}'`,
      );
    }

    if (
      updateTradeDto.opened_at != null &&
      !moment(updateTradeDto.opened_at).isSame(moment(oldTrade.opened_at))
    ) {
      throw new BadRequestException(
        `The following field should keep the same data from old value or null: 'opened_at'`,
      );
    }
  }
}
