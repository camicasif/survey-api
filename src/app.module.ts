import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respondent } from './respondent/respondent.entity';
import { RespondentModule } from './respondent/respondent.module';
import {DataInitializer} from "./seeds/data-initializer";
import {Career} from "./respondent/career.entity";
import { SurveyModule } from './survey/survey.module';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'asdf123',
      database: 'eco_game_db',
      entities: [Respondent, Career],
      synchronize: true, // Reemplazado para borrar datos y recrear tablas
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([Respondent,Career]),
    RespondentModule,
    SurveyModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataInitializer],
})
export class AppModule {}
