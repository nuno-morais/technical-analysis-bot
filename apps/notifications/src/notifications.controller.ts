import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getHello(): Promise<string> {
    return `Hello world`;
  }

  @Get('/test')
  async test(): Promise<string> {
    await this.notificationsService.buySymbol('TEST SYMBOL', {});
    await this.notificationsService.sellSymbol('TEST SYMBOL', {});
    return `Sent`;
  }
}
