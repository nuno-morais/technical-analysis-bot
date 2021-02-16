import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepository } from '@tab/core';
import * as Telegram from 'telegram-notify';
import { TelegramGateway } from './telegram.gateway';

const mockSend = jest.fn();
jest.mock('telegram-notify', () =>
  jest.fn().mockImplementation(() => {
    return { send: mockSend };
  }),
);

const mockFindOne = jest.fn();
const mockNotificationRepository = jest.fn().mockImplementation(() => {
  return { findOne: mockFindOne };
});

describe('TelegramGateway', () => {
  let service: TelegramGateway;
  const repository = mockNotificationRepository;

  beforeEach(async () => {
    mockFindOne.mockClear();
    mockSend.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramGateway,
        {
          provide: NotificationRepository,
          useClass: repository,
        },
      ],
    }).compile();

    service = module.get<TelegramGateway>(TelegramGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#send', () => {
    beforeEach(async () => {
      mockFindOne.mockImplementation(() => ({
        provider: { token: 'token1', chat_id: 'chatId1' },
      }));
    });
    it('should find the provider data on repository', async () => {
      await service.send('account-id', 'text');

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne.mock.calls[0][0]).toStrictEqual({
        accountId: 'account-id',
        providerName: 'TELEGRAM',
      });
    });

    it('should send an alert to TELEGRAM', async () => {
      await service.send('account-id', 'text');

      expect(Telegram).toHaveBeenCalled();
      expect(Telegram.mock.calls[0][0]).toStrictEqual({
        token: 'token1',
        chatId: 'chatId1',
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend.mock.calls[0][0]).toBe('text');
    });
  });
});
