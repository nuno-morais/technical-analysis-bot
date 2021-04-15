import { Trade } from '@tab/core';

export class TradesSummary {
  closed: { [key: number]: { trades: Trade[]; total: number } };
  opened: { trades: Trade[]; invested: number };
}
