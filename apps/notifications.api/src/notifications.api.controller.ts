import { Controller, Get } from '@nestjs/common';
import { NotificationsApiService } from './notifications.api.service';

@Controller()
export class NotificationsApiController {
  constructor(
    private readonly notificationsApiService: NotificationsApiService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationsApiService.getHello();
  }
}
