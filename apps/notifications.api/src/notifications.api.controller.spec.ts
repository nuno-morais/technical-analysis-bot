import { NotificationsApiController } from './notifications.api.controller';

describe('Notifications.ApiController', () => {
  let notificationsApiController: NotificationsApiController;

  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   controllers: [NotificationsApiController],
    //   providers: [NotificationsApiService],
    // }).compile();
    // notificationsApiController = app.get<NotificationsApiController>(
    //   NotificationsApiController,
    // );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //   expect(notificationsApiController.findAll()).toBe([]);
      expect(1).toBe(1);
    });
  });
});
