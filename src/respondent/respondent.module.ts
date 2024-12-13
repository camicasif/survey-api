import { Module } from '@nestjs/common';
import { RespondentController } from './respondent.controller';
import { RespondentService } from './respondent.service';
import {Career} from "./career.entity";
import {Respondent} from "./respondent.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerService} from "../backoffice/logger.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Respondent, Career]),
  ],
  controllers: [RespondentController],
  providers: [RespondentService, LoggerService]
})
export class RespondentModule {}
