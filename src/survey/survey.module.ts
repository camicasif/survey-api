import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Survey} from "./survey.entity";
import {Decision} from "./decision.entity";
import { SurveyService } from './survey.service';
import { Form } from '../form/form.entity';
import { Respondent } from '../respondent/respondent.entity';
import { SurveyController } from './survey.controller';
import { Question } from '../form/question.entity';
import { Answer } from '../form/answer.entity';
import { LoggerService } from '../backoffice/logger.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Survey, Decision,Form, Respondent, Question, Answer])
    ],
    providers: [SurveyService, LoggerService],
    controllers: [SurveyController],

})
export class SurveyModule {}
