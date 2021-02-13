import { Module } from '@nestjs/common';
import { NotificationsApiController } from './notifications.api.controller';
import { NotificationsApiService } from './notifications.api.service';

@Module({
  imports: [],
  controllers: [NotificationsApiController],
  providers: [NotificationsApiService],
})
export class NotificationsApiModule {}
