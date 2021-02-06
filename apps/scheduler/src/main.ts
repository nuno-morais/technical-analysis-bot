import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(SchedulerModule);
}
bootstrap();
