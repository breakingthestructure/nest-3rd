import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { MailController } from './mail/mail.controller';
import { MailService } from './mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SharedIniFileCredentials } from 'aws-sdk';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: 'us-east-1',
        credentials: new SharedIniFileCredentials({
          profile: 'my-profile',
        }),
      },
      services: [S3],
    }),
  ],
  controllers: [AppController, MailController, GoogleController],
  providers: [AppService, MailService, GoogleService],
})
export class AppModule {}
