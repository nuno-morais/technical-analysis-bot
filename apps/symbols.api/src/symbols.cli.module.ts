import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@tab/core';
import axios from 'axios';
import 'dotenv/config';
import { CommandModule } from 'nestjs-command';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ProductGateway } from './commands/gateways/product.gateway';
import { TradesImporterCommand } from './commands/trades-importer.command';
import { PortfolioTradesModule } from './portfolio-trades/portfolio-trades.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SymbolsModule } from './symbols/symbols.module';
import { TradesSummaryModule } from './trades-summary/trades-summary.module';
import { TradesModule } from './trades/trades.module';

const options = {
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
  logging: process.env.TYPEORM_LOGGING == 'true',
} as MongoConnectionOptions;

const clientProductGateway = {
  provide: 'CLIENT_PRODUCT_GATEWAY',
  useValue: axios.create({
    baseURL: 'https://query1.finance.yahoo.com/',
  }),
};

@Module({
  imports: [
    CommandModule,
    TypeOrmModule.forRoot({
      ...options,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CoreModule,
    PortfoliosModule,
    TradesModule,
    PortfolioTradesModule,
    TradesSummaryModule,
    SymbolsModule,
  ],
  controllers: [],
  providers: [TradesImporterCommand, ProductGateway, clientProductGateway],
})
export class SymbolsCLIModule {}
