import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Trade, TradeRepository } from '@tab/core';
import { SymbolsGateway } from '@tab/symbols';
import { classToPlain, plainToClass } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { CreateTradeDto } from './dto/create-trade.dto';

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

  async findAll(accountId: string): Promise<Trade[]> {
    return this.repository.find({ accountId });
  }

  async findOne(id: string, accountId: string): Promise<Trade> {
    const entity = await this.repository.findOne({
      _id: new ObjectID(id),
      accountId,
    });
    if (entity == null) {
      throw new NotFoundException();
    }
    console.dir(entity);
    return entity;
  }

  async remove(id: string, accountId: string) {
    await this.findOne(id, accountId);
    return this.repository.delete({ _id: new ObjectID(id), accountId });
  }
}
