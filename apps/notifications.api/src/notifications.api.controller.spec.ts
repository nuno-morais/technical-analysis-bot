import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsApiController } from './notifications.api.controller';
import { NotificationsApiService } from './notifications.api.service';

describe('Notifications.ApiController', () => {
  let notificationsApiController: NotificationsApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsApiController],
      providers: [NotificationsApiService],
    }).compile();

    notificationsApiController = app.get<NotificationsApiController>(
      NotificationsApiController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationsApiController.getHello()).toBe('Hello World!');
    });
  });
});
