import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AnalyserModule } from './analyser.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyserModule,
  );

  await app.listen(() =>
    console.log("Microservice 'SchedulerModule' is listening"),
  );
}
bootstrap();
