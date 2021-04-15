import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@tab/core';
import 'dotenv/config';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { PortfolioTradesModule } from './portfolio-trades/portfolio-trades.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { TradesModule } from './trades/trades.module';
import { TradesSummaryModule } from './trades-summary/trades-summary.module';

const options = {
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
  logging: process.env.TYPEORM_LOGGING == 'true',
} as MongoConnectionOptions;

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class SymbolsApiModule {}
