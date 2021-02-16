import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsConsumer } from './notifications.consumer';
import { NotificationsService } from './notifications.service';

const mockBuySymbol = jest.fn();
const mockSellSymbol = jest.fn();
const mockNotificationsService = jest.fn().mockImplementation(() => {
  return { sellSymbol: mockSellSymbol, buySymbol: mockBuySymbol };
});

describe('NotificationsConsumer', () => {
  let service: NotificationsConsumer;

  beforeEach(async () => {
    mockBuySymbol.mockClear();
    mockSellSymbol.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsConsumer,
        {
          provide: NotificationsService,
          useClass: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<NotificationsConsumer>(NotificationsConsumer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#competingPubSubHandler', () => {
    describe('when the event is SYSTEM_BUY_SYMBOL', () => {
      it('should call the buySymbol', async () => {
        await service.competingPubSubHandler({
          event: 'SYSTEM_BUY_SYMBOL',
          object: {
            symbol: 'AAPL',
            result: { test: 'test' },
          },
        });

        expect(mockBuySymbol).toHaveBeenCalledTimes(1);
        expect(mockBuySymbol.mock.calls[0][0]).toBe('AAPL');
        expect(mockBuySymbol.mock.calls[0][1]).toStrictEqual({ test: 'test' });
      });
    });

    describe('when the event is SYSTEM_SELL_SYMBOL', () => {
      it('should call the sellSymbol', async () => {
        await service.competingPubSubHandler({
          event: 'SYSTEM_SELL_SYMBOL',
          object: {
            symbol: 'AAPL',
            result: { test: 'test' },
          },
        });

        expect(mockSellSymbol).toHaveBeenCalledTimes(1);
        expect(mockSellSymbol.mock.calls[0][0]).toBe('AAPL');
        expect(mockSellSymbol.mock.calls[0][1]).toStrictEqual({ test: 'test' });
      });
    });
  });
});
