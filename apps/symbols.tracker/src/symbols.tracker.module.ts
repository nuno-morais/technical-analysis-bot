import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinnhubWS } from '@stoqey/finnhub';
import { CoreModule } from '@tab/core';
import 'dotenv/config';
import * as cache from 'memory-cache-ttl';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { SchedulerSyncService } from './scheduler-sync.service';
import { SymbolsListener } from './symbols.listener';

const cacheProvider = {
  provide: 'CACHE_LISTERNER',
  useFactory: () => {
    cache.init({ ttl: 60, interval: 30, randomize: true });
    return cache;
  },
};

const options = {
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true',
  logging: process.env.TYPEORM_LOGGING == 'true',
} as MongoConnectionOptions;

const finnubWSProvider = {
  provide: FinnhubWS,
  useValue: new FinnhubWS(process.env.FINNHUB_API_KEY),
};

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...options,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CoreModule,
  ],
  providers: [
    SymbolsListener,
    finnubWSProvider,
    SchedulerSyncService,
    cacheProvider,
  ],
})
export class SymbolsTrackerModule {}
