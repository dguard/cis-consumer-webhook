import { Module } from '@nestjs/common';
import {ConsumeController} from "./consume.controller";
import {ConsumeService} from "./consume.service";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
  ],
  controllers: [ConsumeController],
  providers: [ConsumeService],
  exports: [ConsumeService],
})
export class ConsumeModule {}
