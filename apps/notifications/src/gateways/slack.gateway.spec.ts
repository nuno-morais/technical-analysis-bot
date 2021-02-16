import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepository } from '@tab/core';
import * as slack from 'slack-notify';
import { SlackGateway } from './slack.gateway';

const mockAlert = jest.fn();
jest.mock('slack-notify', () =>
  jest.fn().mockImplementation(() => {
    return { alert: mockAlert };
  }),
);

const mockFindOne = jest.fn();
const mockNotificationRepository = jest.fn().mockImplementation(() => {
  return { findOne: mockFindOne };
});

describe('SlackGateway', () => {
  let service: SlackGateway;
  const repository = mockNotificationRepository;

  beforeEach(async () => {
    mockFindOne.mockClear();
    mockAlert.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlackGateway,
        {
          provide: NotificationRepository,
          useClass: repository,
        },
      ],
    }).compile();

    service = module.get<SlackGateway>(SlackGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#send', () => {
    beforeEach(async () => {
      mockFindOne.mockImplementation(() => ({
        provider: { webhook_url: 'http://test' },
      }));
    });
    it('should find the provider data on repository', async () => {
      await service.send('account-id', 'text', {});

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne.mock.calls[0][0]).toStrictEqual({
        accountId: 'account-id',
        providerName: 'SLACK',
      });
    });

    it('should send an alert to slack', async () => {
      await service.send('account-id', 'text', {});

      expect(slack).toHaveBeenCalled();
      expect(slack.mock.calls[0][0]).toBe('http://test');

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert.mock.calls[0][0]).toStrictEqual({
        text: 'text',
        fields: {},
      });
    });
  });
});
