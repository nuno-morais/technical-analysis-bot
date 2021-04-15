import { Injectable } from '@nestjs/common';
import { TradeRepository } from '@tab/core';
import * as moment from 'moment';
import { TradesSummary } from './entities/trades-summary.entity';

@Injectable()
export class TradesSummaryInteractor {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async call(accountId: string) {
    const result = await this.tradeRepository.find({ accountId });
    const aggregatedValues = result.reduce(
      (acc, trade) => {
        if (trade.closed_at == null) {
          acc.opened = acc.opened || { trades: [], total: 0 };
          acc.opened.trades.push(trade);
          acc.opened.total -= trade.opened_price * trade.shares;
        } else {
          const year = moment(trade.closed_at).year();
          acc.closed = acc.closed || {};
          if (acc.closed[year] == null) {
            acc.closed[year] = { trades: [], total: 0 };
          }
          acc.closed[year].trades.push(trade);
          acc.closed[year].total +=
            (trade.closed_price - trade.opened_price) * trade.shares;
        }
        return acc;
      },
      { opened: { trades: [], total: 0 }, closed: {} },
    );

    const summaries: TradesSummary[] = [];
    if (aggregatedValues.opened.trades.length > 0) {
      summaries.push(
        new TradesSummary(
          aggregatedValues.opened.trades,
          aggregatedValues.opened.total,
        ),
      );
    }
    for (const closed in aggregatedValues.closed) {
      summaries.push(
        new TradesSummary(
          aggregatedValues.closed[closed].trades,
          aggregatedValues.closed[closed].total,
          Number(closed),
        ),
      );
    }
    summaries.sort((a, b) => {
      if (a.year == null) {
        return -1;
      }
      if (b.year == null) {
        return 1;
      }
      return b.year - a.year;
    });

    return summaries;
  }
}
