import { Body, Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @GrpcMethod('GoogleService', 'SignIn')
  async getRetrieveUser(@Body() payload: any) {
    console.log('Google Controller getRetrieveUser');
    return await this.googleService.retrieveUser(payload.credential);
  }
}
