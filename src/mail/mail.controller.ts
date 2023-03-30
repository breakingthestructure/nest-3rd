import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  SendApproveAndRejectRequestDto,
  SendForgotPasswordRequestDto,
  SendTimeOffRequestDto,
  WelcomeRequestDto
} from './mail.dto';
import { MailService } from './mail.service';
import { MAIL_SERVICE_NAME } from './mail.pb';

@Controller('mail')
export class MailController implements OnModuleInit {
  @Inject(MailService)
  private readonly service: MailService;

  public onModuleInit(): void {
    console.log('MailController onModuleInit');
  }

  @GrpcMethod(MAIL_SERVICE_NAME, 'sendWelcomeMail')
  private sendWelcomeMail(payload: WelcomeRequestDto) {
    console.log('controller sendWelcomeMail');
    return this.service.welcome(payload);
  }

  @GrpcMethod(MAIL_SERVICE_NAME, 'SendForgotPassword')
  private sendForgotPassword(payload: SendForgotPasswordRequestDto) {
    console.log('controller sendForgotPassword', payload);
    return this.service.sendForgotPassword(payload);
  }

  @GrpcMethod(MAIL_SERVICE_NAME, 'SendApproveAndRejectTimeOff')
  private sendApproveAndRejectTimeOff(payload: SendApproveAndRejectRequestDto) {
    console.log('controller sendApproveAndRejectTimeOff', payload);
    return this.service.sendApproveAndRejectTimeOff(payload);
  }

  @GrpcMethod(MAIL_SERVICE_NAME, 'SendRequestTimeOff')
  private sendTimeOff(payload: SendTimeOffRequestDto) {
    console.log('Controller sendTimeOff', payload);
    return this.service.sendTimeOff(payload);
  }
}
