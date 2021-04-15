import { Trade } from '@tab/core';

export class TradesSummary {
  id: string;
  constructor(
    public trades: Trade[],
    public total: number,
    public year: number = null,
  ) {
    this.id = (year || 'current').toString();
  }
}
