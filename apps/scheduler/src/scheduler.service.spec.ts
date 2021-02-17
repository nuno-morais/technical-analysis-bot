import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioRepository } from '@tab/core';
import { SchedulerService } from './scheduler.service';
import { WaitingService } from './waiting.service';

const mockAllCurrenciesByMarket = jest.fn();
const mockPortfolioRepository = jest.fn().mockImplementation(() => {
  return {
    allCurrenciesByMarket: mockAllCurrenciesByMarket,
  };
});
const mockPublish = jest.fn();
const mockAmqpConnection = jest.fn().mockImplementation(() => {
  return { publish: mockPublish };
});
const mockWait = jest.fn(() => {
  return;
});
const mockWaitingService = jest.fn().mockImplementation(() => {
  return { wait: mockWait };
});

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    mockPublish.mockClear();
    mockWait.mockClear();
    mockAllCurrenciesByMarket.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: PortfolioRepository,
          useClass: mockPortfolioRepository,
        },
        {
          provide: AmqpConnection,
          useClass: mockAmqpConnection,
        },
        {
          provide: WaitingService,
          useClass: mockWaitingService,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#handleUsStocks', () => {
    it('should call AllCurrenciesByMarket from repository', async () => {
      mockAllCurrenciesByMarket.mockImplementation(() => []);

      await service.handleUsStocks();

      expect(mockAllCurrenciesByMarket).toBeCalledTimes(1);
      expect(mockAllCurrenciesByMarket.mock.calls[0][0]).toBe('US');
    });

    describe('when there is no stocks', () => {
      beforeEach(() => {
        mockAllCurrenciesByMarket.mockImplementation(() => []);
      });

      it('should not call any publish', async () => {
        await service.handleUsStocks();
        expect(mockPublish).toBeCalledTimes(0);
      });
    });

    describe('when there are stocks', () => {
      beforeEach(() => {
        mockAllCurrenciesByMarket.mockImplementation(() => ['AAPL', 'OTHER']);
      });

      it('should be called one time per stock', async () => {
        await service.handleUsStocks();

        expect(mockWait).toBeCalledTimes(2);
        expect(mockPublish).toBeCalledTimes(2);
      });
    });
  });
});
