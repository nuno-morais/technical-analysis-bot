import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
