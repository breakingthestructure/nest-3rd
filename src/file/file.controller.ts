import { Body, Controller } from '@nestjs/common';
import { FileService } from './file.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  RequestExportTimeOff,
  RequestPostUpload,
  ResponseUpload,
} from './file.pb';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @GrpcMethod('FileService', 'PostUploadImage')
  async uploadFile(
    @Body() payload: RequestPostUpload,
  ): Promise<ResponseUpload> {
    return this.fileService.upload(payload.buffer, payload.name);
  }

  @GrpcMethod('FileService', 'GetExportTimeOff')
  async exportFile(
    @Body() payload: RequestExportTimeOff,
  ): Promise<ResponseUpload> {
    return this.fileService.export(payload);
  }
}
