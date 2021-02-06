import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SchedulerModule } from './scheduler.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SchedulerModule,
  );

  await app.listen(() =>
    console.log("Microservice 'SchedulerModule' is listening"),
  );
}
bootstrap();
