import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import {FileService} from "./file.service";
import {AwsSdkModule} from "nest-aws-sdk";
import {S3} from "aws-sdk";

@Module({
  controllers: [FileController]
})
@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  providers: [FileService],
  exports: [FileService],
})

export class FileModule {}
