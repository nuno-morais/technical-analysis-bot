import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '@tab/authentication';
import { CoreModule } from '@tab/core';
import 'dotenv/config';
import { getMetadataArgsStorage } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { NotificationsApiController } from './notifications.api.controller';
import { NotificationsApiService } from './notifications.api.service';

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
    AuthenticationModule,
    CoreModule,
  ],
  controllers: [NotificationsApiController],
  providers: [NotificationsApiService, Logger],
})
export class NotificationsApiModule {}
