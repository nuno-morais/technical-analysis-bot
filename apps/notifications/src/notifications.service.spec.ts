import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepository } from '@tab/core';
import { SlackGateway } from './gateways/slack.gateway';
import { TelegramGateway } from './gateways/telegram.gateway';
import { NotificationsService } from './notifications.service';

const mockFind = jest.fn();
const mockNotificationRepository = jest.fn().mockImplementation(() => {
  return { find: mockFind };
});

const mockSendSlack = jest.fn();
const mockSlackGateway = jest.fn().mockImplementation(() => {
  return { send: mockSendSlack };
});
const mockSendTelegram = jest.fn();
const mockTelegramGateway = jest.fn().mockImplementation(() => {
  return { send: mockSendTelegram };
});

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    mockFind.mockClear();
    mockSendSlack.mockClear();
    mockSendTelegram.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationRepository,
          useClass: mockNotificationRepository,
        },
        {
          provide: SlackGateway,
          useClass: mockSlackGateway,
        },
        {
          provide: TelegramGateway,
          useClass: mockTelegramGateway,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const result = {
    technicalAnalysis: {
      count: {
        buy: 1,
        sell: 2,
        neutral: 3,
      },
      signal: 'signal',
      trend: {
        adx: '25',
        trending: false,
      },
    },
  };

  describe('#sellSymbol', () => {
    it('should find all anabled notification providers', async () => {
      mockFind.mockImplementation(() => []);
      await service.sellSymbol('AAPL', result);

      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockFind.mock.calls[0][0]).toStrictEqual({ enabled: true });
    });

    describe('when the repository has an empty array', () => {
      it('should not call any sell gateway', async () => {
        mockFind.mockImplementation(() => []);
        await service.sellSymbol('AAPL', result);

        expect(mockSendSlack).toHaveBeenCalledTimes(0);
        expect(mockSendTelegram).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the repository has slack results', () => {
      const slackResults = [
        { providerName: 'SLACK', accountId: 'account-1' },
        { providerName: 'SLACK', accountId: 'account-2' },
        { providerName: 'SLACK', accountId: 'account-3' },
      ];
      beforeEach(() => {
        mockFind.mockImplementation(() => slackResults);
      });

      it('should call the slack gateway the same time as results', async () => {
        await service.sellSymbol('AAPL', result);

        expect(mockSendSlack).toHaveBeenCalledTimes(3);
      });
    });

    describe('when the repository has telegram results', () => {
      const slackResults = [
        { providerName: 'TELEGRAM', accountId: 'account-1' },
        { providerName: 'TELEGRAM', accountId: 'account-2' },
        { providerName: 'TELEGRAM', accountId: 'account-3' },
      ];
      beforeEach(() => {
        mockFind.mockImplementation(() => slackResults);
      });

      it('should call the slack gateway the same time as results', async () => {
        await service.sellSymbol('AAPL', result);

        expect(mockSendTelegram).toHaveBeenCalledTimes(3);
      });
    });

    describe('when the repository has slack and telegram results', () => {
      const slackResults = [
        { providerName: 'TELEGRAM', accountId: 'account-1' },
        { providerName: 'SLACK', accountId: 'account-2' },
        { providerName: 'TELEGRAM', accountId: 'account-3' },
      ];
      beforeEach(() => {
        mockFind.mockImplementation(() => slackResults);
      });

      it('should call the slack gateway the same time as results', async () => {
        await service.sellSymbol('AAPL', result);

        expect(mockSendTelegram).toHaveBeenCalledTimes(2);
        expect(mockSendSlack).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#buySymbol', () => {
    it('should find all anabled notification providers', async () => {
      mockFind.mockImplementation(() => []);
      await service.buySymbol('AAPL', result);

      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockFind.mock.calls[0][0]).toStrictEqual({ enabled: true });
    });

    describe('when the repository has an empty array', () => {
      it('should not call any buy gateway', async () => {
        mockFind.mockImplementation(() => []);
        await service.buySymbol('AAPL', result);

        expect(mockSendSlack).toHaveBeenCalledTimes(0);
        expect(mockSendTelegram).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the repository has slack results', () => {
      const slackResults = [
        { providerName: 'SLACK', accountId: 'account-1' },
        { providerName: 'SLACK', accountId: 'account-2' },
        { providerName: 'SLACK', accountId: 'account-3' },
      ];
      beforeEach(() => {
        mockFind.mockImplementation(() => slackResults);
      });

      it('should call the slack gateway the same time as results', async () => {
        await service.buySymbol('AAPL', result);

        expect(mockSendSlack).toHaveBeenCalledTimes(3);
      });
    });

    describe('when the repository has telegram results', () => {
      const slackResults = [
        { providerName: 'TELEGRAM', accountId: 'account-1' },
        { providerName: 'TELEGRAM', accountId: 'account-2' },
        { providerName: 'TELEGRAM', accountId: 'account-3' },
      ];
      beforeEach(() => {
        mockFind.mockImplementation(() => slackResults);
      });

      it('should call the slack gateway the same time as results', async () => {
        await service.buySymbol('AAPL', result);

        expect(mockSendTelegram).toHaveBeenCalledTimes(3);
      });
    });

    describe('when the repository has slack and telegram results', () => {
      const slackResults = [
        { providerName: 'TELEGRAM', accountId: 'account-1' },
        { providerName: 'SLACK', accountId: 'account-2' },
        { providerName: 'TELEGRAM', accountId: 'account-3' },
      ];
      beforeEach(() => {
        mockFind.mockImplementation(() => slackResults);
      });

      it('should call the slack gateway the same time as results', async () => {
        await service.buySymbol('AAPL', result);

        expect(mockSendTelegram).toHaveBeenCalledTimes(2);
        expect(mockSendSlack).toHaveBeenCalledTimes(1);
      });
    });
  });
});
