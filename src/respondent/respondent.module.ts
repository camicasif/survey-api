import { Module } from '@nestjs/common';
import { RespondantController } from './respondant.controller';
import { RespondantService } from './respondant.service';
import {CareerService} from "./career.service";
import {CareerController} from "./career.controller";

@Module({
  controllers: [RespondantController,CareerController],
  providers: [RespondantService, CareerService]
})
export class RespondentModule {}
