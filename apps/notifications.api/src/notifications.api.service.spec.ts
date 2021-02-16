import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Notification,
  NotificationProviders,
  NotificationRepository,
} from '@tab/core';
import { ObjectID } from 'mongodb';
import {
  CreateNotificationDto,
  NotificationProvider,
} from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsApiService } from './notifications.api.service';

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockReplaceOne = jest.fn();
const mockDelete = jest.fn();
const mockNotificationRepository = jest.fn().mockImplementation(() => {
  return {
    find: mockFind,
    save: mockSave,
    findOne: mockFindOne,
    replaceOne: mockReplaceOne,
    delete: mockDelete,
  };
});

describe('NotificationsApiService', () => {
  let service: NotificationsApiService;

  beforeEach(async () => {
    mockFind.mockClear();
    mockSave.mockClear();
    mockFindOne.mockClear();
    mockReplaceOne.mockClear();
    mockDelete.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsApiService,
        {
          provide: NotificationRepository,
          useClass: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsApiService>(NotificationsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#create', () => {
    const input = new CreateNotificationDto({
      enabled: true,
      provider: new NotificationProvider({
        name: 'TELEGRAM',
        token: 'token',
        chatId: 'chatId',
      }),
    });

    it('should find a notification by account name and provider name', async () => {
      mockFindOne.mockImplementation(() => null);
      await service.create(input, 'account-id');

      expect(mockFindOne).toBeCalledTimes(1);
      expect(mockFindOne.mock.calls[0][0]).toStrictEqual({
        providerName: 'TELEGRAM',
        accountId: 'account-id',
      });
    });

    describe('when there is not any notification founded', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => null);
      });

      it('should create a new notification', async () => {
        await service.create(input, 'account-id');

        const expected = new Notification();
        expected._id = undefined;
        expected.accountId = 'account-id';
        expected.enabled = true;
        expected.providerName = 'TELEGRAM';
        expected.provider = {
          name: NotificationProviders.TELEGRAM,
          chat_id: 'chatId',
          token: 'token',
          webhook_url: undefined,
        };

        expect(mockSave).toBeCalledTimes(1);
        expect(mockSave.mock.calls[0][0]).toStrictEqual(expected);
      });

      it('should return the repository  result', async () => {
        mockSave.mockImplementation(() => ({ result: 'demo' }));
        const result = await service.create(input, 'account-id');

        expect(result).toStrictEqual({ result: 'demo' });
      });
    });

    describe('when a notificatioin already exists', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => ({}));
      });

      it('should throw a BadRequestException exception', async () => {
        await expect(service.create(input, 'account-id')).rejects.toThrowError(
          BadRequestException,
        );
      });
    });
  });

  describe('#findAll', () => {
    it('should find notifications', async () => {
      mockFind.mockImplementation(() => []);

      await service.findAll('account-id');

      expect(mockFind).toBeCalledTimes(1);
      expect(mockFind.mock.calls[0][0]).toStrictEqual({
        accountId: 'account-id',
      });
    });

    it('should return the notifications list from repository', async () => {
      mockFind.mockImplementation(() => [{ name: 'demo1' }, { name: 'demo2' }]);

      const result = await service.findAll('account-id');

      expect(result).toStrictEqual([{ name: 'demo1' }, { name: 'demo2' }]);
    });
  });

  describe('#findOne', () => {
    it('should findOne notification', async () => {
      mockFindOne.mockImplementation(() => ({}));

      await service.findOne('60285738faff9fb89b58b2d9', 'account-id');

      expect(mockFindOne).toBeCalledTimes(1);
      expect(mockFindOne.mock.calls[0][0]).toStrictEqual({
        _id: new ObjectID('60285738faff9fb89b58b2d9'),
        accountId: 'account-id',
      });
    });

    describe('when a notification exist', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => ({ name: 'demo1' }));
      });

      it('should return the notifications list from repository', async () => {
        const result = await service.findOne(
          '60285738faff9fb89b58b2d9',
          'account-id',
        );

        expect(result).toStrictEqual({ name: 'demo1' });
      });
    });

    describe('when a notification does not exist', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => null);
      });

      it('should throw not found exception', async () => {
        await expect(
          service.findOne('60285738faff9fb89b58b2d9', 'account-id'),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('#update', () => {
    const input = new UpdateNotificationDto({ enabled: true });
    it('should findOne notification', async () => {
      mockFindOne.mockImplementation(() => ({}));

      await service.update('60285738faff9fb89b58b2d9', input, 'account-id');

      expect(mockFindOne).toBeCalledTimes(1);
      expect(mockFindOne.mock.calls[0][0]).toStrictEqual({
        _id: new ObjectID('60285738faff9fb89b58b2d9'),
        accountId: 'account-id',
      });
    });

    describe('when a notification exist', () => {
      describe('when stored object is different', () => {
        beforeEach(() => {
          mockFindOne.mockImplementation(() => ({
            name: 'demo1',
            enabled: false,
          }));
        });

        it('should update the notification', async () => {
          await service.update('60285738faff9fb89b58b2d9', input, 'account-id');

          expect(mockReplaceOne).toBeCalledTimes(1);
          expect(mockReplaceOne.mock.calls[0][0]).toStrictEqual({
            _id: new ObjectID('60285738faff9fb89b58b2d9'),
          });
          expect(mockReplaceOne.mock.calls[0][1]).toStrictEqual({
            name: 'demo1',
            enabled: true,
          });
        });

        it('should return the updated notification', async () => {
          const result = await service.update(
            '60285738faff9fb89b58b2d9',
            input,
            'account-id',
          );

          expect(result).toStrictEqual({
            name: 'demo1',
            enabled: true,
          });
        });
      });

      describe('when the stored object is equals', () => {
        beforeEach(() => {
          mockFindOne.mockImplementation(() => ({
            name: 'demo1',
            enabled: true,
          }));
        });

        it('should update the notification', async () => {
          await service.update('60285738faff9fb89b58b2d9', input, 'account-id');

          expect(mockReplaceOne).toBeCalledTimes(0);
        });

        it('should return the updated notification', async () => {
          const result = await service.update(
            '60285738faff9fb89b58b2d9',
            input,
            'account-id',
          );

          expect(result).toStrictEqual({
            name: 'demo1',
            enabled: true,
          });
        });
      });
    });

    describe('when a notification does not exist', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => null);
      });

      it('should throw not found exception', async () => {
        await expect(
          service.findOne('60285738faff9fb89b58b2d9', 'account-id'),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('#remove', () => {
    it('should findOne notification', async () => {
      mockFindOne.mockImplementation(() => ({}));

      await service.remove('60285738faff9fb89b58b2d9', 'account-id');

      expect(mockFindOne).toBeCalledTimes(1);
      expect(mockFindOne.mock.calls[0][0]).toStrictEqual({
        _id: new ObjectID('60285738faff9fb89b58b2d9'),
        accountId: 'account-id',
      });
    });

    describe('when a notification exist', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => ({ name: 'demo1' }));
      });

      it('should remove the notification from repository', async () => {
        await service.remove('60285738faff9fb89b58b2d9', 'account-id');

        expect(mockDelete).toBeCalledTimes(1);
        expect(mockDelete.mock.calls[0][0]).toStrictEqual({
          _id: new ObjectID('60285738faff9fb89b58b2d9'),
          accountId: 'account-id',
        });
      });

      it('should return the notification from repository', async () => {
        mockDelete.mockImplementation(() => ({ name: 'demo1' }));
        const result = await service.remove(
          '60285738faff9fb89b58b2d9',
          'account-id',
        );

        expect(result).toStrictEqual({ name: 'demo1' });
      });
    });

    describe('when a notification does not exist', () => {
      beforeEach(() => {
        mockFindOne.mockImplementation(() => null);
      });

      it('should throw not found exception', async () => {
        await expect(
          service.remove('60285738faff9fb89b58b2d9', 'account-id'),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });
});
