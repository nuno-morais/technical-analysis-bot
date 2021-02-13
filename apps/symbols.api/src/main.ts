import { NestFactory } from '@nestjs/core';
import { SymbolsApiModule } from './symbols.api.module';

async function bootstrap() {
  const app = await NestFactory.create(SymbolsApiModule);
  await app.listen(3000);
}
bootstrap();
