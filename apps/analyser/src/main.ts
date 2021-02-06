import { NestFactory } from '@nestjs/core';
import { AnalyserModule } from './analyser.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AnalyserModule);
}
bootstrap();
