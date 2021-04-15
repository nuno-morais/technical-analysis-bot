import { Trade } from '@tab/core';

export class TradesSummary {
  constructor(
    public trades: Trade[],
    public total: number,
    public year: number = null,
  ) {}
}
