import {IsEmail, IsNumber, IsString} from 'class-validator';
import {SendApproveAndRejectRequest, SendForgotPasswordRequest, SendTimeOffRequest, WelcomeRequest} from './mail.pb';
import {int} from "aws-sdk/clients/datapipeline";

export class WelcomeRequestDto implements WelcomeRequest {
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly code: string;

  @IsString()
  public readonly department: string;
}

export class SendForgotPasswordRequestDto implements SendForgotPasswordRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly token: string;
}

export class SendApproveAndRejectRequestDto implements SendApproveAndRejectRequest {
  @IsNumber()
  public readonly id: number;

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly type: string;

  @IsString()
  public readonly name: string;

  @IsString()
  public readonly description: string;

  @IsString()
  public readonly date_time_off: string;

  @IsString()
  public readonly date: string;
}

export class SendTimeOffRequestDto implements SendTimeOffRequest{
  @IsNumber()
  public readonly id: number;

  @IsEmail()
  public readonly email_approve: string;

  @IsString()
  public readonly name: string;

  @IsString()
  public readonly date_time_off: string;

  @IsString()
  public readonly reason: string;

  @IsString()
  public readonly token: string;
}
