import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@tab/core';
import 'dotenv/config';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { PortfoliosModule } from './portfolios/portfolios.module';

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
  ],
  controllers: [],
  providers: [],
})
export class SymbolsApiModule {}
