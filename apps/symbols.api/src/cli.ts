import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { SymbolsCLIModule } from './symbols.cli.module';

(async () => {
  const app = await NestFactory.createApplicationContext(SymbolsCLIModule, {
    logger: false,
  });
  app.select(CommandModule).get(CommandService).exec();
})();
