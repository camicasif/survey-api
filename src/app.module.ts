import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respondent } from './respondent/respondent.entity';
import { RespondentModule } from './respondent/respondent.module';
import {RespondentInitializer} from "./seeds/respondent-initializer";
import {Career} from "./respondent/career.entity";
import { SurveyModule } from './survey/survey.module';
import { FormModule } from './form/form.module';
import {FormInitializer} from "./seeds/form-initializer";
import {Question} from "./form/question.entity";
import {Answer} from "./form/answer.entity";
import {Form} from "./form/form.entity";
import {Survey} from "./survey/survey.entity";
import {Decision} from "./survey/decision.entity";
import { User } from './backoffice/user.entity';
import { AuthModule } from './backoffice/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'asdf123',
      database: 'eco_game_db',
      entities: [Respondent, Career, Form, Question,Answer, Survey, Decision, User],
      synchronize: true, // Reemplazado para borrar datos y recrear tablas
      dropSchema: false,
    }),
    TypeOrmModule.forFeature([Respondent,Career, Form, Question,Answer,Survey,Decision, User]),
    RespondentModule,
    SurveyModule,
    FormModule,
    AuthModule,
  ],
  controllers: [AppController],

  providers: [AppService, RespondentInitializer, FormInitializer],
})
export class AppModule {}
