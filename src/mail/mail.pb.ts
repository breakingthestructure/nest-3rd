import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import {Observable} from "rxjs";

export const protobufPackage = 'mail';

export interface WelcomeRequest {
  name: string;
  email: string;
  code: string;
  department: string;
}

export interface SendForgotPasswordRequest {
  email: string;
  token: string;
}

export interface SendForgotPasswordResponse {
  status: number;
  error: string[];
}

export interface SendApproveAndRejectRequest {
  id: number;
  email: string;
  type: string;
  name: string,
  description: string,
  date_time_off: string,
  date: string,
}

export interface SendApproveAndRejectResponse {
  status: number;
  error: string[];
}

export interface SendTimeOffRequest {
  id: number;
  email_approve: string;
  name: string,
  date_time_off: string,
}

export interface SendTimeOffResponse {
  status: number;
  error: string[];
}

export const MAIL_PACKAGE_NAME = 'mail';

export interface MailServiceClient {
  sendWelcomeMail(request: WelcomeRequest);
  sendForgotPassword(request: SendForgotPasswordRequest): Observable<SendForgotPasswordResponse>;
  sendApproveAndRejectTimeOff(request: SendApproveAndRejectRequest): Observable<SendApproveAndRejectResponse>;
  sendTimeOff(request: SendTimeOffRequest): Observable<SendTimeOffResponse>;
}

export interface MailServiceController {
  sendWelcomeMail(request: WelcomeRequest);
  sendForgotPassword(request: SendForgotPasswordRequest): Promise<SendForgotPasswordResponse> | Observable<SendForgotPasswordResponse> | SendForgotPasswordResponse;
  sendApproveAndRejectTimeOff(request: SendApproveAndRejectRequest): Promise<SendApproveAndRejectResponse> | Observable<SendApproveAndRejectResponse> | SendApproveAndRejectResponse;
  SendTimeOff(request: SendApproveAndRejectRequest): Promise<SendTimeOffResponse> | Observable<SendTimeOffResponse> | SendTimeOffResponse;
}

export const MAIL_SERVICE_NAME = 'MailService';

export function AuthServiceControllerMethods() {
  return function (constructor: () => void) {
    const grpcMethods: string[] = ['sendWelcomeMail'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod(MAIL_SERVICE_NAME, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod(MAIL_SERVICE_NAME, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
