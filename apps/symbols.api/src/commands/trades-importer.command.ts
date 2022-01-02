import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';
import * as moment from 'moment';
import { Command, Positional } from 'nestjs-command';
import { ProductGateway } from './gateways/product.gateway';

@Injectable()
export class TradesImporterCommand {
  constructor(private readonly productGateway: ProductGateway) {}
  @Command({
    command: 'trades:importer <path> <accountId>',
    describe: 'import trades from eToro',
    autoExit: true,
  })
  async create(
    @Positional({
      name: 'path',
      describe: 'path for file.csv',
      type: 'string',
      alias: 'p',
    })
    path: string,
  ) {
    try {
      const allTrades = (await csv().fromFile(`${path}-trades.csv`)) as any[];

      const allTradesId = {};
      for (const trade of allTrades) {
        if (
          trade.Type == 'Open Position' ||
          trade.Type == 'Profit/Loss of Trade' ||
          trade.Type == 'Rollover Fee'
        ) {
          allTradesId[trade['Position ID']] = trade.Details.split('/')[0];
        }
      }

      const all = {};
      const closedTrades = (await csv().fromFile(`${path}.csv`)) as any[];
      for (const trade of closedTrades) {
        const closeTrade = moment(trade['Close Date'], 'DD-MM-YYYY HH:mm');
        if (closeTrade.year() == 2021) {
          const id = trade['Position ID'];
          const product = allTradesId[id];
          const result = (await this.productGateway.find(product)) || {};
          const market = (result.market || 'CUSTOM').toUpperCase();
          all[market] = all[market] || [];

          all[market].push({
            id,
            market,
            product,
            profit:
              parseFloat(trade.Profit) +
              parseFloat(trade['Rollover Fees And Dividends']),
          });
        }
      }

      const markets = Object.keys(all);
      for (const market of markets) {
        const total = all[market].reduce((acc, value) => acc + value.profit, 0);
        console.log(`Total Market: '${market}': $${total}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
