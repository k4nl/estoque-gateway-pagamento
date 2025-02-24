import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import CustomValidationPipe from './@core/application/errors/custom-validation-pipe';
import { DatabaseErrorFilter } from './@core/application/errors/database-error-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    },
  });

  app.useGlobalPipes(CustomValidationPipe);

  app.useGlobalFilters(new DatabaseErrorFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
