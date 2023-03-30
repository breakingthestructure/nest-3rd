import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { protobufPackage } from './mail/mail.pb';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: configService.get('GRPC_URL'),
      package: [protobufPackage, 'file', 'google'],
      protoPath: [
        join('src/proto/mail.proto'),
        join('src/proto/file.proto'),
        join('src/proto/google.proto'),
      ],
      loader: { keepCase: true },
    },
  });

  app.startAllMicroservices();
  // await app.listen(3004);
}

bootstrap();
