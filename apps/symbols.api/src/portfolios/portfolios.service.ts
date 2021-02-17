import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Portfolio, PortfolioRepository } from '@tab/core';
import { classToPlain, plainToClass } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { FinnhubGateway } from './gateways/finnhub.gateway';

@Injectable()
export class PortfoliosService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly repository: PortfolioRepository,
    private readonly gateway: FinnhubGateway,
  ) {}

  async create(
    createPortfolioDto: CreatePortfolioDto,
    accountId: string,
  ): Promise<Portfolio> {
    const portfolio = plainToClass(Portfolio, classToPlain(createPortfolioDto));

    const portfolioStored = await this.repository.findOne({
      product: portfolio.product,
      accountId: accountId,
    });

    if (portfolioStored != null) {
      throw new BadRequestException('This portfolio already exists');
    }

    const isAvailable = await this.gateway.availableSymbol(
      portfolio.market,
      portfolio.product,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        `The market '${portfolio.market}' with the product '${portfolio.product}' does not exists.`,
      );
    }
    portfolio.accountId = accountId;

    return this.repository.save(portfolio);
  }

  async findAll(accountId: string): Promise<Portfolio[]> {
    return this.repository.find({ accountId });
  }

  async findOne(id: string, accountId: string): Promise<Portfolio> {
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
}
