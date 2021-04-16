import { NestFactory } from '@nestjs/core';
import { SymbolsTrackerModule } from './symbols.tracker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(SymbolsTrackerModule);
}
bootstrap();
