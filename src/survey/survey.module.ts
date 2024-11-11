import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Survey} from "./survey.entity";
import {Decision} from "./decision.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Survey, Decision])
    ],
})
export class SurveyModule {}
